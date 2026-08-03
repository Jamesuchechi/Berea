import { supabase } from '../lib/supabase';
import { getBookBySlug } from '../data/canonMetadata';

/**
 * Beyond-Canon Service & Tradition-Lens Status Resolver
 */

const TRADITION_STATUS_MATRIX = {
  tobit: {
    catholic: { isCanonical: true, label: '🟢 Deuterocanonical Scripture', details: 'Accepted as Scripture by Catholic Church (Council of Trent).' },
    orthodox: { isCanonical: true, label: '🟢 Anagignoskomena (Scripture)', details: 'Accepted as Scripture by Eastern Orthodox Church.' },
    ethiopian: { isCanonical: true, label: '🟢 Canonical Scripture (Tewahedo)', details: 'Accepted in Ethiopian Orthodox Tewahedo Canon.' },
    protestant: { isCanonical: false, label: '🟡 Apocrypha (Not in Protestant Canon)', details: 'Regarded as valuable historical/edifying reading, but not inspired Scripture.' },
  },
  '1_enoch': {
    ethiopian: { isCanonical: true, label: '🟢 Canonical Scripture (Tewahedo)', details: 'Canonical Scripture in Ethiopian Orthodox Tewahedo Church.' },
    protestant: { isCanonical: false, label: '🟡 Pseudepigrapha (Not Canonical)', details: 'Non-canonical ancient apocalyptic text (quoted in Jude 1:14-15).' },
    catholic: { isCanonical: false, label: '🟡 Pseudepigrapha (Not Canonical)', details: 'Non-canonical ancient text.' },
    orthodox: { isCanonical: false, label: '🟡 Pseudepigrapha (Not Canonical)', details: 'Non-canonical ancient text.' },
  },
  didache: {
    protestant: { isCanonical: false, label: '📜 Early Church Writing', details: '1st-century Christian manual; historic church guidance.' },
    catholic: { isCanonical: false, label: '📜 Apostolic Fathers Writing', details: 'Historic 1st-century Christian document.' },
    orthodox: { isCanonical: false, label: '📜 Early Church Father Writing', details: 'Historic 1st-century Christian document.' },
    ethiopian: { isCanonical: false, label: '📜 Early Church Manual', details: 'Historic 1st-century document.' },
  },
};

/**
 * Resolve unmissable theological status badge per tradition lens
 */
export function resolveTraditionStatusBadge(bookSlug, tradition = 'protestant') {
  const trad = (tradition || 'protestant').toLowerCase();
  const bookMatrix = TRADITION_STATUS_MATRIX[bookSlug];

  if (bookMatrix && bookMatrix[trad]) {
    return bookMatrix[trad];
  }

  // Fallback default
  return {
    isCanonical: false,
    label: `📜 ${tradition.toUpperCase()} Tradition View`,
    details: 'Non-canonical historical or deuterocanonical text.',
  };
}

/**
 * Fetch Beyond-Canon books from Supabase with local metadata fallback
 */
export async function getBeyondCanonBooks(categoryFilter = 'All') {
  try {
    const { data, error } = await supabase
      .from('book')
      .select('*')
      .neq('category', 'canonical');

    if (error || !data || data.length === 0) {
      return getLocalBeyondCanonBooks(categoryFilter);
    }

    const filtered = data.filter(b => {
      if (categoryFilter === 'All') return true;
      if (categoryFilter === 'Deuterocanon' && b.category === 'deuterocanon') return true;
      if (categoryFilter === 'Pseudepigrapha' && b.category === 'pseudepigrapha') return true;
      if (categoryFilter === 'Early Church' && b.category === 'early_church_writing') return true;
      return false;
    });

    return filtered.map(b => ({
      id: b.id,
      slug: b.slug,
      title: b.title,
      category: b.category,
      originPeriod: b.origin_period || 'c. 200 BCE',
      originNote: b.origin_note || 'Historic manuscript.',
    }));
  } catch {
    return getLocalBeyondCanonBooks(categoryFilter);
  }
}

/**
 * Fetch Beyond-Canon passage text with attribution
 */
export async function getBeyondCanonPassage(bookSlug, chapter = 1) {
  try {
    const { data: book } = await supabase.from('book').select('id').eq('slug', bookSlug).single();
    if (!book) return getLocalBeyondCanonPassage(bookSlug, chapter);

    const { data: translation } = await supabase
      .from('translation')
      .select('id, attribution, source')
      .eq('book_id', book.id)
      .single();

    if (!translation) return getLocalBeyondCanonPassage(bookSlug, chapter);

    const { data: verses } = await supabase
      .from('verse')
      .select('verse_number, text')
      .eq('translation_id', translation.id)
      .eq('chapter', chapter)
      .order('verse_number', { ascending: true });

    if (!verses || verses.length === 0) return getLocalBeyondCanonPassage(bookSlug, chapter);

    return {
      bookSlug,
      chapter,
      attribution: translation.attribution || 'Public Domain Translation',
      verses: verses.map(v => ({ num: v.verse_number, text: v.text })),
    };
  } catch {
    return getLocalBeyondCanonPassage(bookSlug, chapter);
  }
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function getLocalBeyondCanonBooks(filter) {
  const defaults = [
    { slug: 'tobit', title: 'Tobit', category: 'deuterocanon', originPeriod: 'c. 200–175 BCE', originNote: 'Septuagint Deuterocanon; discovered at Qumran.' },
    { slug: 'wisdom_of_solomon', title: 'Wisdom of Solomon', category: 'deuterocanon', originPeriod: 'c. 50 BCE', originNote: 'Influential Alexandrian Jewish wisdom text.' },
    { slug: '1_enoch', title: '1 Enoch', category: 'pseudepigrapha', originPeriod: 'c. 300 BCE–100 CE', originNote: 'Quoted in Jude 1:14-15; Canonical in Ethiopian Tewahedo Church.' },
    { slug: 'didache', title: 'Didache', category: 'early_church_writing', originPeriod: 'c. 50–100 CE', originNote: 'Earliest 1st-century Christian manual.' },
  ];

  return defaults.filter(b => {
    if (filter === 'All') return true;
    if (filter === 'Deuterocanon' && b.category === 'deuterocanon') return true;
    if (filter === 'Pseudepigrapha' && b.category === 'pseudepigrapha') return true;
    if (filter === 'Early Church' && b.category === 'early_church_writing') return true;
    return false;
  });
}

function getLocalBeyondCanonPassage(bookSlug, chapter) {
  if (bookSlug === 'didache') {
    return {
      bookSlug: 'didache',
      chapter: 1,
      attribution: 'J.B. Lightfoot Translation (Public Domain)',
      verses: [
        { num: 1, text: 'There are two ways, one of life and one of death, and there is a great difference between the two ways.' },
        { num: 2, text: 'The way of life is this: First, thou shalt love God who made thee; secondly, thy neighbor as thyself.' }
      ]
    };
  }

  return {
    bookSlug: bookSlug || 'tobit',
    chapter: chapter || 1,
    attribution: 'Public Domain Translation',
    verses: [
      { num: 1, text: 'I Tobit walked in the ways of truth and righteousness all the days of my life in Assyrian exile in Nineveh.' }
    ]
  };
}
