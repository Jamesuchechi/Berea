/**
 * AI module — client side.
 *
 * The GROQ_API_KEY lives ONLY in the Supabase Edge Function environment.
 * This file must never import or reference a VITE_GROQ_AI_API_KEY variable.
 * All AI calls go through the /functions/v1/ai-assistant Edge Function.
 */
import { supabase } from './supabase';

// ─── Context Builder ──────────────────────────────────────────────────────────

/**
 * Standard AI context object constructor per ARCHITECTURE.md
 */
export function buildAIContext({
  book = 'John',
  chapter = 3,
  verse = 16,
  translation = 'ESV',
  tradition = 'protestant',
  trigger = 'chat',
  userInput = null
}) {
  return { book, chapter, verse, translation, tradition, trigger, userInput };
}

// ─── Main AI call (server proxy) ──────────────────────────────────────────────

/**
 * Sends an AI context payload to the Supabase Edge Function proxy.
 * The Edge Function holds the Groq API key; this client never touches it.
 *
 * Falls back to a local synthesis response if:
 *   - The user is not authenticated (no session)
 *   - The Edge Function returns a non-OK response
 *   - A network error occurs
 */
export async function askAIContextualAssistant(contextPayload) {
  // 1. Get the current session token (required for the edge function auth check)
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.access_token) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: contextPayload,
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!error && data?.success) {
        return {
          success: true,
          message: data.message,
          model: data.model ?? 'edge-function',
          source: data.source ?? 'edge',
        };
      }

      // Log the edge function error but don't surface it to the user
      if (error) {
        console.warn('[Berea AI] Edge function error, using local fallback:', error.message);
      }
    } catch (err) {
      console.warn('[Berea AI] Network error calling edge function, using local fallback:', err);
    }
  }

  // 2. Local synthesis fallback (unauthenticated or upstream failure)
  return {
    success: true,
    message: generateLocalContextualResponse(contextPayload),
    source: 'local-fallback',
  };
}

// ─── Local Fallback Engine ────────────────────────────────────────────────────

/**
 * Offline / unauthenticated response generator.
 * Used when the edge function is unreachable or the user is not logged in.
 */
function generateLocalContextualResponse(ctx) {
  const ref = `${ctx.book} ${ctx.chapter}${ctx.verse ? ':' + ctx.verse : ''}`;
  const trad = (ctx.tradition ?? 'protestant').toLowerCase();

  if (ctx.trigger === 'explain_verse') {
    return `### Historical Context for ${ref} (${ctx.tradition} Lens)\n\nThis passage reflects key 1st-century Biblical themes. Under the **${trad}** tradition, ${ref} is understood in connection with covenant history.\n\n* **Protestant View**: Emphasizes scriptural authority and direct personal faith.\n* **Catholic View**: Connects this passage to sacramental theology and Church tradition.\n* **Orthodox View**: Reads this through the lens of theosis and Septuagint liturgy.`;
  }

  if (ctx.trigger === 'cross_references') {
    return `### Cross References for ${ref}\n\n1. **Protestant Canon**: Numbers 21:9, Romans 5:8\n2. **Deuterocanon**: Wisdom of Solomon 16:6-7\n3. **Early Church Fathers**: 1 Clement 12:7`;
  }

  return `Berea AI analyzing ${ref} (${ctx.tradition} tradition). Ask about manuscript origins, Greek/Hebrew word studies, or cross-tradition views.`;
}

// ─── Semantic Search ──────────────────────────────────────────────────────────

/**
 * Client-side semantic search across canon + apocrypha + user notes.
 * TODO Phase 3: Replace with a proper vector search via Supabase pgvector.
 */
export function performSemanticSearch(query, userNotes = []) {
  if (!query || !query.trim()) return [];
  const q = query.toLowerCase();

  const semanticDB = [
    { type: 'canon', title: 'John 3:16', body: 'For God so loved the world that he gave his only Son...' },
    { type: 'deuterocanon', title: 'Tobit 1:3', body: 'I Tobit walked in the ways of truth and righteousness all the days of my life in Assyrian exile.' },
    { type: 'pseudepigrapha', title: '1 Enoch 1:9', body: 'Behold he comes with ten thousands of his holy ones to execute judgment upon all.' },
    { type: 'early_church', title: 'Didache 1:1', body: 'There are two ways: one of life and one of death, and there is a great difference between the two.' }
  ];

  const results = [];

  semanticDB.forEach(item => {
    if (item.title.toLowerCase().includes(q) || item.body.toLowerCase().includes(q)) {
      results.push(item);
    }
  });

  userNotes.forEach(note => {
    if (note.content.toLowerCase().includes(q) || note.reference.toLowerCase().includes(q)) {
      results.push({
        type: 'user_note',
        title: `Note on ${note.reference}`,
        body: note.content
      });
    }
  });

  return results;
}
