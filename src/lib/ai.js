/**
 * Standard AI context object constructor according to ARCHITECTURE.md
 * @param {Object} params
 * @param {string} params.book - e.g. "John"
 * @param {number} params.chapter - e.g. 3
 * @param {number|null} [params.verse] - e.g. 16
 * @param {string} [params.translation] - e.g. "ESV"
 * @param {string} [params.tradition] - e.g. "protestant"
 * @param {"chat"|"explain_verse"|"cross_references"|"expand_note"} [params.trigger]
 * @param {string|null} [params.userInput]
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
  return {
    book,
    chapter,
    verse,
    translation,
    tradition,
    trigger,
    userInput
  };
}

export async function askAIContextualAssistant(contextPayload) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) {
    return {
      message: `Offline mode: AI context response for ${contextPayload.book} ${contextPayload.chapter}:${contextPayload.verse || ''} (${contextPayload.tradition} lens).`
    };
  }

  try {
    const res = await fetch(`${supabaseUrl}/functions/v1/ai-assistant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contextPayload)
    });
    if (!res.ok) throw new Error('AI Edge Function request failed');
    return await res.json();
  } catch (err) {
    console.warn('AI Assistant request failed, using offline fallback', err);
    return {
      message: `Berea Assistant: Exploring ${contextPayload.book} ${contextPayload.chapter}:${contextPayload.verse || ''} under the ${contextPayload.tradition} tradition.`
    };
  }
}
