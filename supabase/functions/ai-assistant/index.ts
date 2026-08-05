// Supabase Edge Function: ai-assistant
// Server-side proxy for Groq API with JWT auth, rate limiting, and response caching.

import { createClient } from "jsr:@supabase/supabase-js@2";

interface AIContextPayload {
  book: string;
  chapter: number;
  verse: number | null;
  translation: string;
  tradition: string;
  trigger: "chat" | "explain_verse" | "cross_references" | "expand_note";
  userInput: string | null;
  conversationId?: string | null;
  stream?: boolean;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, access-control-allow-origin, access-control-allow-headers",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { status: 200, headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // 1. Verify Authorization Header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized: Missing Bearer Token" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid JWT Session" }), {
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    const payload: AIContextPayload = await req.json();

    // 2. Deterministic Cache Key Check for explain_verse & cross_references
    const cacheKey = buildCacheKey(payload);
    if (cacheKey) {
      const cachedResponse = await fetchCachedResponse(supabase, cacheKey);
      if (cachedResponse) {
        return new Response(
          JSON.stringify({
            success: true,
            message: cachedResponse,
            model: "llama-3.3-70b-versatile",
            source: "cache",
          }),
          { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
        );
      }
    }

    // 3. Per-User Token Bucket Rate Limiting Check
    const rateCheck = await checkAndUpdateRateLimit(supabase, user.id);
    if (!rateCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: "Rate limit exceeded. Please wait before asking more questions.",
          tier: rateCheck.tier,
          resetInSeconds: 3600,
        }),
        {
          status: 429,
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    if (!groqApiKey) {
      // Graceful degradation fallback if secret is unconfigured
      const fallback = buildFallbackResponse(payload);
      return new Response(
        JSON.stringify({
          success: true,
          message: fallback,
          source: "fallback",
        }),
        { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = buildSystemPrompt(payload);
    const userPrompt = buildUserPrompt(payload);

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${groqApiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 600,
        stream: payload.stream || false,
      }),
    });

    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      console.error("Groq upstream error:", groqRes.status, errBody);
      return new Response(
        JSON.stringify({
          success: true,
          message: buildFallbackResponse(payload),
          source: "fallback",
        }),
        { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
      );
    }

    if (payload.stream) {
      // Pipe stream directly back to client
      return new Response(groqRes.body, {
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    const groqData = await groqRes.json();
    const message = groqData?.choices?.[0]?.message?.content ?? buildFallbackResponse(payload);

    // Save to Cache if deterministic trigger
    if (cacheKey && message) {
      await saveCachedResponse(supabase, cacheKey, message);
    }

    // Record to AI Message history if conversationId supplied
    if (payload.conversationId) {
      await recordAIMessage(supabase, payload.conversationId, "user", payload.userInput || payload.trigger);
      await recordAIMessage(supabase, payload.conversationId, "assistant", message);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message,
        model: "llama-3.3-70b-versatile",
        source: "groq",
      }),
      { headers: { ...CORS_HEADERS, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Edge function execution error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildCacheKey(ctx: AIContextPayload): string | null {
  if (ctx.trigger === "explain_verse" || ctx.trigger === "cross_references") {
    return `${ctx.trigger}:${ctx.book}:${ctx.chapter}:${ctx.verse || 1}:${(ctx.tradition || "protestant").toLowerCase()}`;
  }
  return null;
}

async function fetchCachedResponse(supabase: any, key: string): Promise<string | null> {
  try {
    const { data } = await supabase
      .from("ai_response_cache")
      .select("response, expires_at")
      .eq("cache_key", key)
      .gt("expires_at", new Date().toISOString())
      .single();
    return data?.response || null;
  } catch {
    return null;
  }
}

async function saveCachedResponse(supabase: any, key: string, response: string): Promise<void> {
  try {
    await supabase.from("ai_response_cache").upsert({
      cache_key: key,
      response,
      model: "llama-3.3-70b-versatile",
    });
  } catch (err) {
    console.warn("Failed to write to response cache:", err);
  }
}

async function checkAndUpdateRateLimit(supabase: any, userId: string): Promise<{ allowed: boolean; tier: string }> {
  try {
    const { data } = await supabase
      .from("ai_rate_limit")
      .select("tokens_used, daily_limit, tier")
      .eq("user_id", userId)
      .single();

    if (!data) {
      await supabase.from("ai_rate_limit").insert({ user_id: userId, tokens_used: 1 });
      return { allowed: true, tier: "free" };
    }

    if (data.tokens_used >= data.daily_limit) {
      return { allowed: false, tier: data.tier };
    }

    await supabase
      .from("ai_rate_limit")
      .update({ tokens_used: data.tokens_used + 1, updated_at: new Date().toISOString() })
      .eq("user_id", userId);

    return { allowed: true, tier: data.tier };
  } catch {
    return { allowed: true, tier: "free" };
  }
}

async function recordAIMessage(supabase: any, conversationId: string, sender: string, content: string): Promise<void> {
  try {
    await supabase.from("ai_message").insert({
      conversation_id: conversationId,
      sender,
      content,
    });
  } catch (err) {
    console.warn("Failed to log message to conversation history:", err);
  }
}

function buildSystemPrompt(ctx: AIContextPayload): string {
  return `You are Berea AI — a reverent, objective, scholarly, and context-aware Scripture Study Assistant.

Core Guardrails:
1. When answering questions regarding contested scriptures, canon boundaries, or doctrines (e.g., Deuterocanon, Maccabees, Tobit, 1 Enoch, justification, sacraments), DO NOT assert a single denominational view as the sole truth.
2. Present Protestant, Catholic, Eastern Orthodox, and Ethiopian Orthodox perspectives with historical clarity, mutual respect, and manuscript references.
3. Acknowledge the user's active tradition lens (${ctx.tradition || "Protestant"}), while clearly explaining how other traditions interpret the verse.
4. Keep your tone reverent, unhurried, concise, and academically grounded.`;
}

function buildUserPrompt(ctx: AIContextPayload): string {
  let prompt = `Passage Context: ${ctx.book} Chapter ${ctx.chapter}${ctx.verse ? ":" + ctx.verse : ""} (${ctx.translation || "ESV"} translation, ${ctx.tradition || "Protestant"} tradition lens).`;

  if (ctx.trigger === "explain_verse") {
    prompt += ` Please provide a breakdown of verse ${ctx.verse}, covering historical background, Greek/Hebrew terms, and cross-tradition interpretations.`;
  } else if (ctx.trigger === "cross_references") {
    prompt += ` Provide key canonical and deuterocanonical cross-references for this passage.`;
  } else if (ctx.trigger === "expand_note") {
    prompt += ` Expand this study note with historical and theological context: "${ctx.userInput}"`;
  } else if (ctx.userInput) {
    prompt += ` User Question: "${ctx.userInput}"`;
  } else {
    prompt += ` Provide a reverent historical and theological summary of this passage.`;
  }

  return prompt;
}

function buildFallbackResponse(ctx: AIContextPayload): string {
  const ref = `${ctx.book} ${ctx.chapter}${ctx.verse ? ":" + ctx.verse : ""}`;
  const trad = (ctx.tradition ?? "protestant").toLowerCase();

  if (ctx.trigger === "explain_verse") {
    return `### Historical Context for ${ref} (${ctx.tradition} Lens)\n\nThis passage reflects key 1st-century Biblical themes. Under the **${trad}** tradition, ${ref} is understood in connection with covenant history.\n\n* **Protestant View**: Emphasizes scriptural authority and direct personal faith.\n* **Catholic View**: Connects this passage to sacramental theology and Church tradition.\n* **Orthodox View**: Reads this through the lens of theosis and Septuagint liturgy.`;
  }

  if (ctx.trigger === "cross_references") {
    return `### Cross References for ${ref}\n\n1. **Protestant Canon**: Numbers 21:9, Romans 5:8\n2. **Deuterocanon**: Wisdom of Solomon 16:6-7\n3. **Early Church Fathers**: 1 Clement 12:7`;
  }

  return `Berea AI analyzing ${ref} (${ctx.tradition} tradition). Ask about manuscript origins, Greek/Hebrew word studies, or cross-tradition views.`;
}
