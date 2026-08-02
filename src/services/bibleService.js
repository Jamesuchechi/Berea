import { ALL_BOOKS } from '../data/canonMetadata';
import { LOCAL_BIBLE_DATA } from '../data/localBibleData';

// ─────────────────────────────────────────────────────────────────────────────
// Translation → API routing map
// ─────────────────────────────────────────────────────────────────────────────
const BIBLE_API_COM_TRANSLATIONS = ['kjv', 'web', 'asv', 'ylt', 'darby', 'bbe', 'oeb-us', 'webbe'];

const TRANSLATION_CONFIG = {
  KJV:   { provider: 'bible-api', param: 'kjv' },
  WEB:   { provider: 'bible-api', param: 'web' },
  ASV:   { provider: 'bible-api', param: 'asv' },
  YLT:   { provider: 'bible-api', param: 'ylt' },
  DARBY: { provider: 'bible-api', param: 'darby' },
  NET:   { provider: 'net-bible', param: 'net' },
  // ESV: key required from Crossway — not yet configured
};

// ─────────────────────────────────────────────────────────────────────────────
// Public-Domain Static Floor (KJV) — permanent offline fallback
// Extended with more passages so users always have something to read
// ─────────────────────────────────────────────────────────────────────────────
const STATIC_FLOOR = {
  'john-3': {
    book: 'John', chapter: 3, translation: 'KJV', license: 'public_domain',
    verses: [
      { num: 1,  text: 'There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:' },
      { num: 2,  text: 'The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.' },
      { num: 3,  text: 'Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.' },
      { num: 4,  text: 'Nicodemus saith unto him, How can a man be born when he is old? can he enter the second time into his mother\'s womb, and be born?' },
      { num: 5,  text: 'Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.' },
      { num: 6,  text: 'That which is born of the flesh is flesh; and that which is born of the Spirit is spirit.' },
      { num: 7,  text: 'Marvel not that I said unto thee, Ye must be born again.' },
      { num: 8,  text: 'The wind bloweth where it listeth, and thou hearest the sound thereof, but canst not tell whence it cometh, and whither it goeth: so is every one that is born of the Spirit.' },
      { num: 9,  text: 'Nicodemus answered and said unto him, How can these things be?' },
      { num: 10, text: 'Jesus answered and said unto him, Art thou a master of Israel, and knowest not these things?' },
      { num: 11, text: 'Verily, verily, I say unto thee, We speak that we do know, and testify that we have seen; and ye receive not our witness.' },
      { num: 12, text: 'If I have told you earthly things, and ye believe not, how shall ye believe, if I tell you of heavenly things?' },
      { num: 13, text: 'And no man hath ascended up to heaven, but he that came down from heaven, even the Son of man which is in heaven.' },
      { num: 14, text: 'And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up:' },
      { num: 15, text: 'That whosoever believeth in him should not perish, but have eternal life.' },
      { num: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
      { num: 17, text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.' },
      { num: 18, text: 'He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.' },
      { num: 19, text: 'And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil.' },
      { num: 20, text: 'For every one that doeth evil hateth the light, neither cometh to the light, lest his deeds should be reproved.' },
      { num: 21, text: 'But he that doeth truth cometh to the light, that his deeds may be made manifest, that they are wrought in God.' },
      { num: 36, text: 'He that believeth on the Son hath everlasting life: and he that believeth not the Son shall not see life; but the wrath of God abideth on him.' }
    ]
  },
  'genesis-1': {
    book: 'Genesis', chapter: 1, translation: 'KJV', license: 'public_domain',
    verses: [
      { num: 1,  text: 'In the beginning God created the heaven and the earth.' },
      { num: 2,  text: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.' },
      { num: 3,  text: 'And God said, Let there be light: and there was light.' },
      { num: 4,  text: 'And God saw the light, that it was good: and God divided the light from the darkness.' },
      { num: 5,  text: 'And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day.' },
      { num: 26, text: 'And God said, Let us make man in our image, after our likeness: and let them have dominion over the fish of the sea, and over the fowl of the air, and over the cattle, and over all the earth, and over every creeping thing that creepeth upon the earth.' },
      { num: 27, text: 'So God created man in his own image, in the image of God created he him; male and female created he them.' },
      { num: 31, text: 'And God saw every thing that he had made, and, behold, it was very good. And the evening and the morning were the sixth day.' }
    ]
  },
  'psalms-23': {
    book: 'Psalms', chapter: 23, translation: 'KJV', license: 'public_domain',
    verses: [
      { num: 1, text: 'The LORD is my shepherd; I shall not want.' },
      { num: 2, text: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.' },
      { num: 3, text: 'He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.' },
      { num: 4, text: 'Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.' },
      { num: 5, text: 'Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.' },
      { num: 6, text: 'Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.' }
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// Build the cache key
// ─────────────────────────────────────────────────────────────────────────────
function cacheKey(translation, slug, chapter) {
  return `berea_v2_${translation}_${slug}_${chapter}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Get a book's API-safe slug from the metadata
// ─────────────────────────────────────────────────────────────────────────────
function getApiSlug(bookSlug) {
  const book = ALL_BOOKS.find(b => b.slug === bookSlug);
  // slugApi is set for API-accessible books; null for local-text-only books
  return book?.slugApi || bookSlug.replace(/-/g, '+');
}

// ─────────────────────────────────────────────────────────────────────────────
// Check if a book has local text available
// ─────────────────────────────────────────────────────────────────────────────
function isLocalTextBook(bookSlug) {
  const book = ALL_BOOKS.find(b => b.slug === bookSlug);
  return book?.localText === true;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN: Get chapter passage with multi-provider fallback & local caching
// ─────────────────────────────────────────────────────────────────────────────
export async function getChapterPassage(bookSlug, chapter = 1, translationCode = 'KJV') {
  const slug = bookSlug.toLowerCase();
  const ch = Number(chapter);
  const trans = translationCode.toUpperCase();
  const key = cacheKey(trans, slug, ch);

  // 1. Check local browser cache
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed?.verses?.length > 0) return parsed;
    }
  } catch (e) {
    console.warn('[bibleService] Cache read error:', e);
  }

  // 2. Local text for Ethiopian/Early Church books (no API available)
  if (isLocalTextBook(slug)) {
    const local = LOCAL_BIBLE_DATA[slug]?.[ch];
    if (local) {
      try { localStorage.setItem(key, JSON.stringify(local)); } catch (e) {}
      return local;
    }
    return {
      book: slug, chapter: ch, translation: trans,
      license: 'local_public_domain',
      verses: [{ num: 1, text: 'Full text for this chapter is being added. Please check back soon.' }]
    };
  }

  // 3. bible-api.com (free, covers KJV, WEB, ASV, YLT, DARBY etc.)
  const apiSlug = getApiSlug(slug);
  const transParam = TRANSLATION_CONFIG[trans]?.param || 'kjv';
  const provider = TRANSLATION_CONFIG[trans]?.provider || 'bible-api';

  if (provider === 'bible-api' || provider === 'net-bible') {
    try {
      const url = provider === 'net-bible'
        ? `https://labs.bible.org/api/?passage=${encodeURIComponent(apiSlug.replace(/\+/g, ' '))}+${ch}&type=json`
        : `https://bible-api.com/${apiSlug}+${ch}?translation=${transParam}`;

      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      if (res.ok) {
        const data = await res.json();
        let formatted = null;

        if (provider === 'bible-api' && data?.verses?.length > 0) {
          const bookName = data.reference
            ? data.reference.replace(/\s*\d+$/, '').trim()
            : slug;
          formatted = {
            book: bookName,
            chapter: ch,
            translation: trans,
            license: 'free_use_api',
            source: 'bible-api.com',
            verses: data.verses.map(v => ({
              num: v.verse,
              text: v.text.trim().replace(/\n/g, ' ')
            }))
          };
        } else if (provider === 'net-bible' && Array.isArray(data) && data.length > 0) {
          formatted = {
            book: data[0]?.bookname || slug,
            chapter: ch,
            translation: 'NET',
            license: 'free_use_api',
            source: 'bible.org NET Bible API',
            verses: data.map(v => ({
              num: parseInt(v.verse, 10),
              text: v.text?.trim() || ''
            }))
          };
        }

        if (formatted) {
          try { localStorage.setItem(key, JSON.stringify(formatted)); } catch (e) {}
          return formatted;
        }
      }
    } catch (err) {
      if (err.name !== 'TimeoutError') {
        console.info('[bibleService] Remote API unavailable:', err.message);
      }
    }
  }

  // 4. Static floor fallback
  const floorKey = `${slug}-${ch}`;
  if (STATIC_FLOOR[floorKey]) return STATIC_FLOOR[floorKey];

  // 5. Ultimate fallback — john 3
  return STATIC_FLOOR['john-3'];
}

// ─────────────────────────────────────────────────────────────────────────────
// Full-text search across cached + static passages
// ─────────────────────────────────────────────────────────────────────────────
export function searchScripture(query = '') {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results = [];

  // Search static floor
  Object.entries(STATIC_FLOOR).forEach(([, passage]) => {
    passage.verses.forEach(v => {
      if (v.text.toLowerCase().includes(q)) {
        results.push({
          book: passage.book,
          chapter: passage.chapter,
          verseNum: v.num,
          text: v.text,
          translation: passage.translation,
          slug: `${passage.book.toLowerCase()}-${passage.chapter}`
        });
      }
    });
  });

  // Search local cache
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (!k?.startsWith('berea_v2_')) continue;
    try {
      const data = JSON.parse(localStorage.getItem(k));
      if (!data?.verses) continue;
      data.verses.forEach(v => {
        if (v.text.toLowerCase().includes(q)) {
          results.push({
            book: data.book,
            chapter: data.chapter,
            verseNum: v.num,
            text: v.text,
            translation: data.translation,
            slug: `${data.book.toLowerCase()}-${data.chapter}`
          });
        }
      });
    } catch (_) {}
  }

  // Deduplicate
  const seen = new Set();
  return results.filter(r => {
    const sig = `${r.book}-${r.chapter}-${r.verseNum}-${r.translation}`;
    if (seen.has(sig)) return false;
    seen.add(sig);
    return true;
  });
}
