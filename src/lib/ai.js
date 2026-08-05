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
  userInput = null,
  conversationId = null,
  stream = false,
}) {
  return { book, chapter, verse, translation, tradition, trigger, userInput, conversationId, stream };
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
  // 1. Get current session token (required for edge function auth check)
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.access_token) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: contextPayload,
      });

      if (!error && data?.success) {
        return {
          success: true,
          message: data.message,
          model: data.model ?? 'edge-function',
          source: data.source ?? 'edge',
        };
      }

      if (error) {
        console.warn('[Berea AI] Edge function error, using local fallback:', error.message);
      }
    } catch (err) {
      console.warn('[Berea AI] Network error calling edge function, using local fallback:', err);
    }
  }

  // 2. Local synthesis fallback (unauthenticated or offline)
  return {
    success: true,
    message: generateLocalContextualResponse(contextPayload),
    source: 'local-fallback',
  };
}

// ─── Local Fallback Engine ────────────────────────────────────────────────────

/**
 * Offline / unauthenticated response generator.
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

// ─── Real Hybrid / Vector Semantic Search Engine ──────────────────────────────

/**
 * Client-side & Database hybrid semantic search engine across Canon + Deuterocanon + User Notes.
 * Uses match_semantic_verses RPC when connected to Supabase with pgvector.
 */
export async function performSemanticSearch(query, userNotes = []) {
  if (!query || !query.trim()) return [];
  const q = query.trim().toLowerCase();

  // Try RPC query against Supabase Postgres
  try {
    const { data: rpcResults, error } = await supabase.rpc('match_semantic_verses', {
      query_text: q,
      match_count: 10,
    });

    if (!error && Array.isArray(rpcResults) && rpcResults.length > 0) {
      const formatted = rpcResults.map(r => ({
        type: 'canon',
        title: `${r.book_name} ${r.chapter}:${r.verse_number}`,
        body: r.text,
        similarity: r.similarity,
      }));

      // Append matching user notes
      const noteMatches = matchUserNotes(q, userNotes);
      return [...formatted, ...noteMatches];
    }
  } catch (err) {
    console.warn('[Berea AI] Vector RPC search offline, using local corpus fallback:', err);
  }

  // Fallback to local corpus matching
  return performLocalSemanticSearchFallback(q, userNotes);
}

function matchUserNotes(query, userNotes) {
  const matches = [];
  userNotes.forEach(note => {
    const text = (note.content || note.text || '').toLowerCase();
    const ref = (note.reference || '').toLowerCase();
    if (text.includes(query) || ref.includes(query)) {
      matches.push({
        type: 'user_note',
        title: `Note on ${note.reference || 'Passage'}`,
        body: note.content || note.text,
        similarity: 0.9,
      });
    }
  });
  return matches;
}

function performLocalSemanticSearchFallback(query, userNotes) {
  const corpus = [
    { type: 'canon', title: 'John 3:16', body: 'For God so loved the world that he gave his only Son that whoever believes in him should not perish but have eternal life.' },
    { type: 'canon', title: 'Genesis 1:1', body: 'In the beginning God created the heavens and the earth.' },
    { type: 'deuterocanon', title: 'Tobit 1:3', body: 'I Tobit walked in the ways of truth and righteousness all the days of my life in Assyrian exile.' },
    { type: 'deuterocanon', title: 'Wisdom of Solomon 1:1', body: 'Love righteousness, you rulers of the earth, think of the Lord in goodness and seek him with sincerity of heart.' },
    { type: 'pseudepigrapha', title: '1 Enoch 1:9', body: 'Behold he comes with ten thousands of his holy ones to execute judgment upon all.' },
    { type: 'early_church', title: 'Didache 1:1', body: 'There are two ways: one of life and one of death, and there is a great difference between the two.' }
  ];

  const results = [];
  corpus.forEach(item => {
    if (item.title.toLowerCase().includes(query) || item.body.toLowerCase().includes(query)) {
      results.push({ ...item, similarity: 0.85 });
    }
  });

  const noteMatches = matchUserNotes(query, userNotes);
  return [...results, ...noteMatches];
}
