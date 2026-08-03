/**
 * Scripture Reference Parser & Book Abbreviation Normalizer
 *
 * Short-circuits queries like "John 3:16", "Jn 3:16-18", or "Tobit 1:3" into instant
 * passage lookups.
 */

const BOOK_ALIAS_MAP = {
  // Old & New Testament
  gen: 'genesis', genesis: 'genesis',
  ex: 'exodus', exod: 'exodus', exodus: 'exodus',
  lev: 'leviticus', leviticus: 'leviticus',
  num: 'numbers', numbers: 'numbers',
  deut: 'deuteronomy', dt: 'deuteronomy', deuteronomy: 'deuteronomy',
  ps: 'psalms', psa: 'psalms', psalm: 'psalms', psalms: 'psalms',
  prov: 'proverbs', proverbs: 'proverbs',
  isa: 'isaiah', isaiah: 'isaiah',
  jer: 'jeremiah', jeremiah: 'jeremiah',
  matt: 'matthew', mt: 'matthew', matthew: 'matthew',
  mark: 'mark', mk: 'mark',
  luke: 'luke', lk: 'luke',
  john: 'john', jn: 'john',
  acts: 'acts',
  rom: 'romans', romans: 'romans',
  cor: '1_corinthians',
  gal: 'galatians',
  eph: 'ephesians',
  phil: 'philippians',
  col: 'colossians',
  heb: 'hebrews', hebrews: 'hebrews',
  jas: 'james', james: 'james',
  pet: '1_peter',
  jude: 'jude',
  rev: 'revelation', revelation: 'revelation',

  // Deuterocanon & Apocrypha
  tob: 'tobit', tobit: 'tobit',
  judith: 'judith', jdt: 'judith',
  wis: 'wisdom_of_solomon', wisdom: 'wisdom_of_solomon',
  sir: 'sirach', ecclesiasticus: 'sirach', sirach: 'sirach',
  bar: 'baruch', baruch: 'baruch',
  macc: '1_maccabees', '1macc': '1_maccabees', '2macc': '2_maccabees',
  enoch: '1_enoch', '1 en': '1_enoch', '1en': '1_enoch',
  didache: 'didache', did: 'didache',
};

const DISPLAY_TITLES = {
  genesis: 'Genesis',
  exodus: 'Exodus',
  leviticus: 'Leviticus',
  numbers: 'Numbers',
  deuteronomy: 'Deuteronomy',
  psalms: 'Psalms',
  proverbs: 'Proverbs',
  isaiah: 'Isaiah',
  jeremiah: 'Jeremiah',
  matthew: 'Matthew',
  mark: 'Mark',
  luke: 'Luke',
  john: 'John',
  acts: 'Acts',
  romans: 'Romans',
  hebrews: 'Hebrews',
  james: 'James',
  jude: 'Jude',
  revelation: 'Revelation',
  tobit: 'Tobit',
  judith: 'Judith',
  wisdom_of_solomon: 'Wisdom of Solomon',
  sirach: 'Sirach',
  baruch: 'Baruch',
  '1_maccabees': '1 Maccabees',
  '2_maccabees': '2 Maccabees',
  '1_enoch': '1 Enoch',
  didache: 'Didache',
};

/**
 * Parse input text to see if it's a direct scripture reference
 */
export function parseScriptureReference(queryText) {
  if (!queryText || typeof queryText !== 'string') {
    return { isReference: false };
  }

  const q = queryText.trim().toLowerCase();

  // Pattern: Book Chapter:Verse or Book Chapter:Verse-Verse or Book Chapter
  // e.g., "John 3:16", "Jn 3:16-18", "Tobit 1:3", "Genesis 1"
  const refRegex = /^([1-3]?\s*[a-z]+)\s+([0-9]+)(?::([0-9]+)(?:-([0-9]+))?)?$/i;
  const match = q.match(refRegex);

  if (!match) {
    return { isReference: false };
  }

  const rawBook = match[1].trim().replace(/\s+/g, '');
  const chapter = parseInt(match[2], 10);
  const verseStart = match[3] ? parseInt(match[3], 10) : null;
  const verseEnd = match[4] ? parseInt(match[4], 10) : verseStart;

  // Resolve book slug
  const bookSlug = BOOK_ALIAS_MAP[rawBook] || BOOK_ALIAS_MAP[match[1].trim()];

  if (!bookSlug) {
    return { isReference: false };
  }

  const bookTitle = DISPLAY_TITLES[bookSlug] || match[1].trim();

  return {
    isReference: true,
    bookSlug,
    bookTitle,
    chapter,
    verseStart,
    verseEnd,
    formatted: `${bookTitle} ${chapter}${verseStart ? `:${verseStart}${verseEnd && verseEnd !== verseStart ? `-${verseEnd}` : ''}` : ''}`,
  };
}
