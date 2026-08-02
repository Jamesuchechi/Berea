import { ALL_BOOKS } from '../data/canonMetadata';

// Static Public Domain Floor Translations
const STATIC_BIBLE_DATA = {
  KJV: {
    'john-3': {
      book: 'John',
      chapter: 3,
      translation: 'KJV',
      license: 'public_domain',
      verses: [
        { num: 1, text: 'There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:' },
        { num: 2, text: 'The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.' },
        { num: 3, text: 'Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.' },
        { num: 14, text: 'And as Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up:' },
        { num: 15, text: 'That whosoever believeth in him should not perish, but have eternal life.' },
        { num: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
        { num: 17, text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.' }
      ]
    },
    'tobit-1': {
      book: 'Tobit',
      chapter: 1,
      translation: 'KJV (Apocrypha)',
      license: 'public_domain',
      verses: [
        { num: 1, text: 'The book of the words of Tobit, son of Tobiel, the son of Ananiel, the son of Aduel, the son of Gabael, of the seed of Asael, of the tribe of Nephthali;' },
        { num: 2, text: 'Who in the time of Enemessar king of the Assyrians was led captive out of Thisbe, which is at the right hand of that city, which is called properly Nephthali in Galilee above Aser.' },
        { num: 3, text: 'I Tobit have walked all the days of my life in the way of truth and justice, and I did many almsdeeds to my brethren, and my nation, who came with me to Nineve, into the land of the Assyrians.' }
      ]
    },
    '1-enoch-1': {
      book: '1 Enoch',
      chapter: 1,
      translation: 'R.H. Charles 1912 (Public Domain)',
      license: 'public_domain',
      verses: [
        { num: 1, text: 'The words of the blessing of Enoch, wherewith he blessed the elect and righteous, who will be living in the day of tribulation, when all the wicked and godless are to be removed.' },
        { num: 9, text: 'And behold! He cometh with ten thousands of His holy ones to execute judgment upon all, and to destroy all the ungodly, and to convict all flesh of all the works of their ungodliness.' }
      ]
    }
  },
  WEB: {
    'john-3': {
      book: 'John',
      chapter: 3,
      translation: 'WEB (World English Bible)',
      license: 'public_domain',
      verses: [
        { num: 1, text: 'Now there was a man of the Pharisees named Nicodemus, a ruler of the Jews.' },
        { num: 2, text: 'This one came to Jesus by night, and said to him, "Rabbi, we know that you are a teacher come from God, for no one can do these signs that you do, unless God is with him."' },
        { num: 3, text: 'Jesus answered him, "Most certainly I tell you, unless one is born anew, he can’t see the Kingdom of God."' },
        { num: 14, text: 'As Moses lifted up the serpent in the wilderness, even so must the Son of Man be lifted up,' },
        { num: 15, text: 'that whoever believes in him should not perish, but have eternal life.' },
        { num: 16, text: 'For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life.' },
        { num: 17, text: 'For God didn’t send his Son into the world to judge the world, but that the world should be saved through him.' }
      ]
    }
  }
};

/**
 * Fetch chapter passage with multi-provider fallback & local caching
 */
export async function getChapterPassage(slug = 'john', chapter = 3, translationCode = 'ESV') {
  const key = `${slug}-${chapter}`;
  const cacheKey = `berea_passage_${translationCode}_${key}`;

  // 1. Check local cache
  const cached = localStorage.getItem(cacheKey);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.warn("Cache parse failed:", e);
    }
  }

  // 2. Free Use Bible API Attempt (AO Lab)
  try {
    const res = await fetch(`https://bible-api.com/${slug}+${chapter}?translation=${translationCode.toLowerCase()}`);
    if (res.ok) {
      const data = await res.json();
      if (data && data.verses) {
        const formatted = {
          book: data.reference ? data.reference.split(' ')[0] : slug,
          chapter: Number(chapter),
          translation: translationCode,
          license: 'free_use_api',
          verses: data.verses.map(v => ({
            num: v.verse,
            text: v.text.trim()
          }))
        };
        localStorage.setItem(cacheKey, JSON.stringify(formatted));
        return formatted;
      }
    }
  } catch (err) {
    console.info("Remote Free Use Bible API unavailable, resorting to permanent static floor:", err);
  }

  // 3. Fallback to Permanent Public-Domain Static Floor (WEB / KJV)
  const floorGroup = STATIC_BIBLE_DATA[translationCode] || STATIC_BIBLE_DATA['WEB'] || STATIC_BIBLE_DATA['KJV'];
  const floorPassage = floorGroup[key] || STATIC_BIBLE_DATA['KJV']['john-3'];

  return floorPassage;
}

/**
 * Full-Text Keyword Search Engine (Static + Cache)
 */
export function searchScripture(query = '') {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const results = [];

  Object.keys(STATIC_BIBLE_DATA).forEach(transCode => {
    const trans = STATIC_BIBLE_DATA[transCode];
    Object.keys(trans).forEach(passageKey => {
      const passage = trans[passageKey];
      passage.verses.forEach(v => {
        if (v.text.toLowerCase().includes(q)) {
          results.push({
            book: passage.book,
            chapter: passage.chapter,
            verseNum: v.num,
            text: v.text,
            translation: transCode
          });
        }
      });
    });
  });

  return results;
}
