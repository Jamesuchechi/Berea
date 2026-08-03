// Supabase Edge Function: ai-assistant
// Server-side proxy for Groq API — the GROQ_API_KEY never leaves the server.
// Follows the AI context interface defined in docs/ARCHITECTURE.md.
//
// Required Supabase secret (set via CLI):
//   supabase secrets set GROQ_API_KEY=gsk_...
//
// The client must pass a valid Supabase JWT in the Authorization header.
// Unauthenticated requests are rejected with 401.

import { createClient } from "jsr:@supabase/supabase-js@2";

interface AIContextPayload {
  book: string;
  chapter: number;
  verse: number | null;
  translation: string;
  tradition: string;
  trigger: "chat" | "explain_verse" | "cross_references" | "expand_note";
  userInput: string | null;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  // Verify the caller is an authenticated Supabase user
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
    });
  }

  try {
    // Validate the JWT against the Supabase project
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const payload: AIContextPayload = await req.json();

    const groqApiKey = Deno.env.get("GROQ_API_KEY");
    if (!groqApiKey) {
      // Graceful degradation — return a structured fallback if secret isn't set
      return new Response(
        JSON.stringify({
          success: true,
          message: buildFallbackResponse(payload),
          source: "fallback",
        }),
        {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    // Build prompts (same logic as the former client-side call)
    const systemPrompt = buildSystemPrompt(payload);
    const userPrompt = buildUserPrompt(payload);

    const groqRes = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
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
        }),
      }
    );

    if (!groqRes.ok) {
      const errBody = await groqRes.text();
      console.error("Groq error:", groqRes.status, errBody);
      // Graceful degradation on upstream error
      return new Response(
        JSON.stringify({
          success: true,
          message: buildFallbackResponse(payload),
          source: "fallback",
        }),
        {
          headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
        }
      );
    }

    const groqData = await groqRes.json();
    const message = groqData?.choices?.[0]?.message?.content;

    return new Response(
      JSON.stringify({
        success: true,
        message: message ?? buildFallbackResponse(payload),
        model: "llama-3.3-70b-versatile",
        source: "groq",
      }),
      {
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
      }
    );
  }
});

// ─── Prompt Builders ──────────────────────────────────────────────────────────

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
