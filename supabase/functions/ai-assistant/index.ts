// Supabase Edge Function: AI Assistant proxy
// Follows AI context passing interface defined in docs/ARCHITECTURE.md

interface AIContextPayload {
  book: string;
  chapter: number;
  verse: number | null;
  translation: string;
  tradition: string;
  trigger: "chat" | "explain_verse" | "cross_references" | "expand_note";
  userInput: string | null;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  try {
    const payload: AIContextPayload = await req.json();

    const reply = `Context-aware insight for ${payload.book} ${payload.chapter}:${payload.verse || ''} (${payload.tradition} tradition). Prompt: "${payload.userInput || 'General overview'}"`;

    return new Response(
      JSON.stringify({
        success: true,
        message: reply,
        context: payload,
      }),
      {
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
      }
    );
  }
});
