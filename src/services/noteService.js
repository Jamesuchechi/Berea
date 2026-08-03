import { supabase } from '../lib/supabase';
import { enqueueAction, registerSyncProcessor } from './offlineQueue';

/**
 * Service for managing user study notes with Supabase persistence
 * and offline IndexedDB queueing.
 */

export async function fetchUserNotes() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return getLocalNotes();

    const { data, error } = await supabase
      .from('user_note')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false });

    if (error) {
      console.warn('[noteService] Fetch error, returning local notes:', error.message);
      return getLocalNotes();
    }

    const mapped = data.map(n => ({
      id: n.id,
      bookId: n.book_id,
      chapter: n.chapter,
      verseNumber: n.verse_number,
      content: n.content,
      highlightColor: n.highlight_color || 'amber',
      createdAt: n.created_at,
      updatedAt: n.updated_at,
    }));

    saveLocalNotesBatch(mapped);
    return mapped;
  } catch (err) {
    console.warn('[noteService] Error fetching user notes:', err);
    return getLocalNotes();
  }
}

export async function createNote({ bookId, chapter, verseNumber, content, highlightColor = 'amber' }) {
  const notePayload = {
    id: `temp_note_${Date.now()}`,
    bookId,
    chapter,
    verseNumber,
    content,
    highlightColor,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  saveLocalNoteItem(notePayload);

  if (!navigator.onLine) {
    await enqueueAction('CREATE_NOTE', notePayload);
    return { success: true, item: notePayload, queued: true };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: true, item: notePayload, localOnly: true };

    const { data, error } = await supabase
      .from('user_note')
      .insert({
        user_id: session.user.id,
        book_id: bookId,
        chapter,
        verse_number: verseNumber,
        content,
        highlight_color: highlightColor,
      })
      .select()
      .single();

    if (error) {
      await enqueueAction('CREATE_NOTE', notePayload);
      return { success: true, item: notePayload, queued: true, error: error.message };
    }

    const savedNote = {
      id: data.id,
      bookId: data.book_id,
      chapter: data.chapter,
      verseNumber: data.verse_number,
      content: data.content,
      highlightColor: data.highlight_color,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    saveLocalNoteItem(savedNote);
    return { success: true, item: savedNote };
  } catch (err) {
    await enqueueAction('CREATE_NOTE', notePayload);
    return { success: true, item: notePayload, queued: true };
  }
}

export async function updateNote(id, content) {
  updateLocalNoteItem(id, content);

  if (!navigator.onLine) {
    await enqueueAction('UPDATE_NOTE', { id, content });
    return { success: true, queued: true };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: true, localOnly: true };

    const { error } = await supabase
      .from('user_note')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      await enqueueAction('UPDATE_NOTE', { id, content });
      return { success: true, queued: true };
    }

    return { success: true };
  } catch {
    await enqueueAction('UPDATE_NOTE', { id, content });
    return { success: true, queued: true };
  }
}

export async function deleteNote(id) {
  removeLocalNoteItem(id);

  if (!navigator.onLine) {
    await enqueueAction('DELETE_NOTE', { id });
    return { success: true, queued: true };
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: true, localOnly: true };

    const { error } = await supabase
      .from('user_note')
      .delete()
      .eq('id', id)
      .eq('user_id', session.user.id);

    if (error) {
      await enqueueAction('DELETE_NOTE', { id });
      return { success: true, queued: true };
    }

    return { success: true };
  } catch {
    await enqueueAction('DELETE_NOTE', { id });
    return { success: true, queued: true };
  }
}

// ── Offline Sync Handler Registration ────────────────────────────────────────

registerSyncProcessor(async (action) => {
  const { type, payload } = action;

  if (type === 'CREATE_NOTE') {
    const result = await createNote(payload);
    return result.success;
  }
  if (type === 'UPDATE_NOTE') {
    const result = await updateNote(payload.id, payload.content);
    return result.success;
  }
  if (type === 'DELETE_NOTE') {
    const result = await deleteNote(payload.id);
    return result.success;
  }

  return true;
});

// ── Local Storage Helpers ─────────────────────────────────────────────────────

function getLocalNotes() {
  try {
    const raw = localStorage.getItem('berea_user_notes');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalNotesBatch(notes) {
  try {
    localStorage.setItem('berea_user_notes', JSON.stringify(notes));
  } catch (err) {
    console.warn('[noteService] Local storage batch write failed:', err);
  }
}

function saveLocalNoteItem(note) {
  const current = getLocalNotes();
  const filtered = current.filter(n => n.id !== note.id);
  localStorage.setItem('berea_user_notes', JSON.stringify([note, ...filtered]));
}

function updateLocalNoteItem(id, content) {
  const current = getLocalNotes();
  const updated = current.map(n => n.id === id ? { ...n, content, updatedAt: new Date().toISOString() } : n);
  localStorage.setItem('berea_user_notes', JSON.stringify(updated));
}

function removeLocalNoteItem(id) {
  const current = getLocalNotes();
  const filtered = current.filter(n => n.id !== id);
  localStorage.setItem('berea_user_notes', JSON.stringify(filtered));
}
