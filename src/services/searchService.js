import { supabase } from '../lib/supabase';
import { parseScriptureReference } from './referenceParser';

/**
 * Unified Search Service
 *
 * Spans Canonical Scripture, Deuterocanon, Pseudepigrapha, Early Church writings,
 * and User Notes with server-side ranking (Postgres RPC) and offline fallbacks.
 */

const STATIC_SEARCH_CORPUS = [
  {
    type: 'canon',
    bookTitle: 'John',
    bookSlug: 'john',
    chapter: 3,
    verseNumber: 16,
    text: 'For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
    translation: 'ESV'
  },
  {
    type: 'canon',
    bookTitle: 'Genesis',
    bookSlug: 'genesis',
    chapter: 1,
    verseNumber: 1,
    text: 'In the beginning, God created the heavens and the earth.',
    translation: 'ESV'
  },
  {
    type: 'deuterocanon',
    bookTitle: 'Tobit',
    bookSlug: 'tobit',
    chapter: 1,
    verseNumber: 3,
    text: 'I Tobit walked in the ways of truth and righteousness all the days of my life in Assyrian exile in Nineveh.',
    translation: 'NRSV Catholic'
  },
  {
    type: 'deuterocanon',
    bookTitle: 'Wisdom of Solomon',
    bookSlug: 'wisdom_of_solomon',
    chapter: 7,
    verseNumber: 26,
    text: 'For she is a reflection of eternal light, a spotless mirror of the working of God, and an image of his goodness.',
    translation: 'NRSV Catholic'
  },
  {
    type: 'pseudepigrapha',
    bookTitle: '1 Enoch',
    bookSlug: '1_enoch',
    chapter: 1,
    verseNumber: 9,
    text: 'Behold, he comes with ten thousands of his holy ones to execute judgment upon all.',
    translation: 'R.H. Charles'
  },
  {
    type: 'early_church',
    bookTitle: 'Didache',
    bookSlug: 'didache',
    chapter: 1,
    verseNumber: 1,
    text: 'There are two ways, one of life and one of death, and there is a great difference between the two ways.',
    translation: 'Lightfoot'
  }
];

export async function performUnifiedSearch(query, filterCategory = 'All') {
  if (!query || !query.trim()) {
    return {
      referenceMatch: null,
      results: [],
      totalCount: 0,
    };
  }

  const trimmed = query.trim();

  // 1. Instant Reference Parse Check
  const refParsed = parseScriptureReference(trimmed);

  // 2. Perform Server-Side Supabase RPC FTS Search
  let remoteResults = [];
  try {
    const { data, error } = await supabase
      .rpc('search_berea_scripture', { query_text: trimmed, limit_count: 40 });

    if (!error && data && data.length > 0) {
      remoteResults = data.map(item => ({
        type: item.type || 'canon',
        bookTitle: item.book_title,
        bookSlug: item.book_slug,
        chapter: item.chapter,
        verseNumber: item.verse_number,
        text: item.text,
        rank: item.rank || 0.5,
      }));
    }
  } catch (err) {
    console.warn('[searchService] Server RPC search fallback to local corpus:', err);
  }

  // 3. Search Local/Static Corpus if remote gave 0 results
  let searchResults = remoteResults;
  if (searchResults.length === 0) {
    const qLower = trimmed.toLowerCase();
    searchResults = STATIC_SEARCH_CORPUS.filter(item =>
      item.bookTitle.toLowerCase().includes(qLower) ||
      item.text.toLowerCase().includes(qLower)
    );
  }

  // 4. Search User Notes
  let noteResults = [];
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const { data: userNotes } = await supabase
        .from('user_note')
        .select('*')
        .eq('user_id', session.user.id)
        .ilike('content', `%${trimmed}%`);

      if (userNotes) {
        noteResults = userNotes.map(n => ({
          type: 'user_note',
          bookTitle: 'Study Note',
          bookSlug: 'note',
          chapter: n.chapter,
          verseNumber: n.verse_number,
          text: n.content,
          createdAt: n.created_at,
        }));
      }
    }
  } catch {}

  const combined = [...searchResults, ...noteResults];

  // 5. Apply Filter Category
  const filtered = combined.filter(item => {
    if (filterCategory === 'All') return true;
    if (filterCategory === 'Scripture' && item.type === 'canon') return true;
    if (filterCategory === 'Beyond' && (item.type === 'deuterocanon' || item.type === 'pseudepigrapha' || item.type === 'early_church')) return true;
    if (filterCategory === 'Notes' && item.type === 'user_note') return true;
    return false;
  });

  return {
    referenceMatch: refParsed.isReference ? refParsed : null,
    results: filtered,
    totalCount: filtered.length,
  };
}
