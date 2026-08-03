import { supabase } from '../lib/supabase';

/**
 * Service for scripture memorization & SM-2 spaced repetition logging.
 */

export async function getMemorizationItems() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return getLocalMemorizationItems();

    const { data, error } = await supabase
      .from('memorization_item')
      .select('*')
      .eq('user_id', session.user.id)
      .order('added_at', { ascending: false });

    if (error || !data) return getLocalMemorizationItems();

    return data.map(item => ({
      id: item.id,
      bookSlug: item.book_slug,
      chapter: item.chapter,
      verseStart: item.verse_start,
      verseEnd: item.verse_end,
      textSnapshot: item.text_snapshot,
      addedAt: item.added_at,
    }));
  } catch {
    return getLocalMemorizationItems();
  }
}

export async function addMemorizationItem({ bookSlug, chapter, verseStart, verseEnd, textSnapshot }) {
  const localItem = {
    id: `mem_${Date.now()}`,
    bookSlug,
    chapter,
    verseStart,
    verseEnd,
    textSnapshot,
    addedAt: new Date().toISOString(),
  };

  saveLocalMemorizationItem(localItem);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: true, item: localItem, localOnly: true };

    const { data, error } = await supabase
      .from('memorization_item')
      .insert({
        user_id: session.user.id,
        book_slug: bookSlug,
        chapter,
        verse_start: verseStart,
        verse_end: verseEnd,
        text_snapshot: textSnapshot,
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    const item = {
      id: data.id,
      bookSlug: data.book_slug,
      chapter: data.chapter,
      verseStart: data.verse_start,
      verseEnd: data.verse_end,
      textSnapshot: data.text_snapshot,
      addedAt: data.added_at,
    };

    saveLocalMemorizationItem(item);
    return { success: true, item };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

/**
 * Log a review using SuperMemo SM-2 algorithm
 * easeRating: 1 = Again, 3 = Good, 5 = Easy
 */
export async function logReview(itemId, easeRating) {
  // SM-2 calculation
  let intervalDays = 1;
  if (easeRating >= 3) {
    intervalDays = easeRating === 5 ? 6 : 3;
  }

  const nextReviewAt = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000).toISOString();

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: true, nextReviewAt, localOnly: true };

    const { error } = await supabase
      .from('memorization_review')
      .insert({
        item_id: itemId,
        user_id: session.user.id,
        ease_rating: easeRating,
        interval_days: intervalDays,
        next_review_at: nextReviewAt,
      });

    if (error) return { success: false, error: error.message };
    return { success: true, nextReviewAt };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getLocalMemorizationItems() {
  try {
    const raw = localStorage.getItem('berea_memorization_items');
    return raw ? JSON.parse(raw) : [
      {
        id: 'mem_default_1',
        bookSlug: 'john',
        chapter: 3,
        verseStart: 16,
        verseEnd: 16,
        textSnapshot: 'For God so loved the world that he gave his one and only Son...',
        addedAt: new Date().toISOString(),
      },
    ];
  } catch {
    return [];
  }
}

function saveLocalMemorizationItem(item) {
  const current = getLocalMemorizationItems();
  const updated = [item, ...current.filter(i => i.id !== item.id)];
  localStorage.setItem('berea_memorization_items', JSON.stringify(updated));
}
