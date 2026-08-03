import { supabase } from '../lib/supabase';

/**
 * Service for managing scripture bookmarks and highlights
 * with Supabase persistence and localStorage fallback.
 */

// ── Bookmarks ─────────────────────────────────────────────────────────────────

export async function getBookmarks() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return getLocalBookmarks();
    }

    const { data, error } = await supabase
      .from('bookmark')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('[bookmarkService] Remote fetch error, fallback to local:', error.message);
      return getLocalBookmarks();
    }

    return data.map(b => ({
      id: b.id,
      bookSlug: b.book_slug,
      chapter: b.chapter,
      verseNumber: b.verse_number,
      createdAt: b.created_at,
    }));
  } catch (err) {
    console.warn('[bookmarkService] Error getting bookmarks:', err);
    return getLocalBookmarks();
  }
}

export async function addBookmark({ bookSlug, chapter, verseNumber }) {
  const localItem = {
    id: `bm_${Date.now()}`,
    bookSlug,
    chapter,
    verseNumber,
    createdAt: new Date().toISOString(),
  };

  saveLocalBookmark(localItem);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: true, item: localItem, localOnly: true };

    const { data, error } = await supabase
      .from('bookmark')
      .insert({
        user_id: session.user.id,
        book_slug: bookSlug,
        chapter,
        verse_number: verseNumber,
      })
      .select()
      .single();

    if (error) {
      console.warn('[bookmarkService] Remote insert failed:', error.message);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      item: {
        id: data.id,
        bookSlug: data.book_slug,
        chapter: data.chapter,
        verseNumber: data.verse_number,
        createdAt: data.created_at,
      },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function removeBookmark(bookmarkId) {
  removeLocalBookmark(bookmarkId);

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: true };

    const { error } = await supabase
      .from('bookmark')
      .delete()
      .eq('id', bookmarkId)
      .eq('user_id', session.user.id);

    if (error) {
      console.warn('[bookmarkService] Remote delete failed:', error.message);
    }
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Highlights ────────────────────────────────────────────────────────────────

export async function getHighlights(bookSlug, chapter) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return getLocalHighlights(bookSlug, chapter);
    }

    let query = supabase
      .from('highlight')
      .select('*')
      .eq('user_id', session.user.id);

    if (bookSlug) query = query.eq('book_slug', bookSlug);
    if (chapter) query = query.eq('chapter', chapter);

    const { data, error } = await query;
    if (error) return getLocalHighlights(bookSlug, chapter);

    return data.map(h => ({
      id: h.id,
      bookSlug: h.book_slug,
      chapter: h.chapter,
      verseNumber: h.verse_number,
      color: h.color,
      createdAt: h.created_at,
    }));
  } catch (err) {
    return getLocalHighlights(bookSlug, chapter);
  }
}

export async function saveHighlight({ bookSlug, chapter, verseNumber, color = 'amber' }) {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: true, localOnly: true };

    const { data, error } = await supabase
      .from('highlight')
      .upsert({
        user_id: session.user.id,
        book_slug: bookSlug,
        chapter,
        verse_number: verseNumber,
        color,
      }, { onConflict: 'user_id,book_slug,chapter,verse_number' })
      .select()
      .single();

    if (error) return { success: false, error: error.message };

    return {
      success: true,
      item: {
        id: data.id,
        bookSlug: data.book_slug,
        chapter: data.chapter,
        verseNumber: data.verse_number,
        color: data.color,
      },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

// ── Local Storage Fallbacks ───────────────────────────────────────────────────

function getLocalBookmarks() {
  try {
    const stored = localStorage.getItem('berea_bookmarks');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveLocalBookmark(item) {
  const current = getLocalBookmarks();
  const updated = [item, ...current.filter(b => !(b.bookSlug === item.bookSlug && b.chapter === item.chapter && b.verseNumber === item.verseNumber))];
  localStorage.setItem('berea_bookmarks', JSON.stringify(updated));
}

function removeLocalBookmark(id) {
  const current = getLocalBookmarks();
  const updated = current.filter(b => b.id !== id);
  localStorage.setItem('berea_bookmarks', JSON.stringify(updated));
}

function getLocalHighlights(bookSlug, chapter) {
  try {
    const stored = localStorage.getItem('berea_highlights');
    const all = stored ? JSON.parse(stored) : [];
    return all.filter(h => (!bookSlug || h.bookSlug === bookSlug) && (!chapter || h.chapter === chapter));
  } catch {
    return [];
  }
}
