// ─────────────────────────────────────────────────────────────────────────────
// Berea — Canon Metadata
// Covers: Protestant (66), Catholic (73), Eastern Orthodox (76+), Ethiopian (81+)
// Each book carries: slug for display, slugApi for bible-api.com URL, chapterCount,
// testament group, canon category, and per-tradition acceptance matrix.
// ─────────────────────────────────────────────────────────────────────────────

export const CANON_CATEGORIES = {
  CANONICAL: 'canonical',
  DEUTEROCANON: 'deuterocanon',
  ANAGIGNOSKOMENA: 'anagignoskomena', // Orthodox "worthy to be read"
  PSEUDEPIGRAPHA: 'pseudepigrapha',
  EARLY_CHURCH_WRITING: 'early_church_writing',
  GNOSTIC: 'gnostic'
};

export const TRADITIONS = {
  PROTESTANT: 'protestant',
  CATHOLIC: 'catholic',
  ORTHODOX: 'orthodox',
  ETHIOPIAN: 'ethiopian'
};

export const TRADITION_BOOK_COUNTS = {
  [TRADITIONS.PROTESTANT]: 66,
  [TRADITIONS.CATHOLIC]: 73,
  [TRADITIONS.ORTHODOX]: 76,
  [TRADITIONS.ETHIOPIAN]: 81
};

export const TRADITION_NAMES = {
  protestant: 'Protestant',
  catholic: 'Roman Catholic',
  orthodox: 'Eastern Orthodox',
  ethiopian: 'Ethiopian Orthodox'
};

// ─────────────────────────────────────────────────────────────────────────────
// ALL BOOKS — Complete canon across all traditions
// slugApi: the slug used in bible-api.com requests (book name as URL path)
// chapterCount: total chapters in the canonical form of the book
// localText: true if text must come from embedded local data (not API)
// ─────────────────────────────────────────────────────────────────────────────

export const ALL_BOOKS = [

  // ═══════════════════════════════════════════════════════
  // OLD TESTAMENT — 39 Books (Protestant Canon)
  // ═══════════════════════════════════════════════════════

  {
    id: 'gen', slug: 'genesis', slugApi: 'genesis', title: 'Genesis', chapterCount: 50,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '15th–13th Century BC',
    originNote: 'Attributed to Moses; creation, fall, patriarchs, covenant with Abraham, Isaac, Jacob, and Joseph in Egypt.',
    canons: {
      protestant: { accepted: true, order: 1, label: 'Canonical' },
      catholic:   { accepted: true, order: 1, label: 'Canonical' },
      orthodox:   { accepted: true, order: 1, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 1, label: 'Canonical' }
    }
  },
  {
    id: 'exo', slug: 'exodus', slugApi: 'exodus', title: 'Exodus', chapterCount: 40,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '15th–13th Century BC',
    originNote: 'Deliverance from Egypt, Sinai covenant, the Law of Moses, and the Tabernacle construction.',
    canons: {
      protestant: { accepted: true, order: 2, label: 'Canonical' },
      catholic:   { accepted: true, order: 2, label: 'Canonical' },
      orthodox:   { accepted: true, order: 2, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 2, label: 'Canonical' }
    }
  },
  {
    id: 'lev', slug: 'leviticus', slugApi: 'leviticus', title: 'Leviticus', chapterCount: 27,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '15th–13th Century BC',
    originNote: 'Priestly legislation covering sacrifices, purity laws, atonement, and the Holiness Code.',
    canons: {
      protestant: { accepted: true, order: 3, label: 'Canonical' },
      catholic:   { accepted: true, order: 3, label: 'Canonical' },
      orthodox:   { accepted: true, order: 3, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 3, label: 'Canonical' }
    }
  },
  {
    id: 'num', slug: 'numbers', slugApi: 'numbers', title: 'Numbers', chapterCount: 36,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '15th–13th Century BC',
    originNote: 'Wilderness census, journeys, rebellions, and the transition to conquest under Moses and then Joshua.',
    canons: {
      protestant: { accepted: true, order: 4, label: 'Canonical' },
      catholic:   { accepted: true, order: 4, label: 'Canonical' },
      orthodox:   { accepted: true, order: 4, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 4, label: 'Canonical' }
    }
  },
  {
    id: 'deu', slug: 'deuteronomy', slugApi: 'deuteronomy', title: 'Deuteronomy', chapterCount: 34,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '7th Century BC (Josianic edition)',
    originNote: 'Moses\'s farewell sermons, restatement of the covenant, Shema (6:4), and his death on Nebo.',
    canons: {
      protestant: { accepted: true, order: 5, label: 'Canonical' },
      catholic:   { accepted: true, order: 5, label: 'Canonical' },
      orthodox:   { accepted: true, order: 5, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 5, label: 'Canonical' }
    }
  },
  {
    id: 'jos', slug: 'joshua', slugApi: 'joshua', title: 'Joshua', chapterCount: 24,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '7th–6th Century BC',
    originNote: 'Conquest and allotment of Canaan under Joshua; covenant renewal at Shechem.',
    canons: {
      protestant: { accepted: true, order: 6, label: 'Canonical' },
      catholic:   { accepted: true, order: 6, label: 'Canonical' },
      orthodox:   { accepted: true, order: 6, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 6, label: 'Canonical' }
    }
  },
  {
    id: 'jdg', slug: 'judges', slugApi: 'judges', title: 'Judges', chapterCount: 21,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '7th–6th Century BC',
    originNote: 'Cyclical disobedience and deliverance through judges including Deborah, Gideon, and Samson.',
    canons: {
      protestant: { accepted: true, order: 7, label: 'Canonical' },
      catholic:   { accepted: true, order: 7, label: 'Canonical' },
      orthodox:   { accepted: true, order: 7, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 7, label: 'Canonical' }
    }
  },
  {
    id: 'rut', slug: 'ruth', slugApi: 'ruth', title: 'Ruth', chapterCount: 4,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '6th–5th Century BC',
    originNote: 'Story of loyal Moabite widow Ruth who becomes an ancestor of King David; themes of hesed (covenant love).',
    canons: {
      protestant: { accepted: true, order: 8, label: 'Canonical' },
      catholic:   { accepted: true, order: 8, label: 'Canonical' },
      orthodox:   { accepted: true, order: 8, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 8, label: 'Canonical' }
    }
  },
  {
    id: '1sa', slug: '1-samuel', slugApi: '1+samuel', title: '1 Samuel', chapterCount: 31,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '6th Century BC',
    originNote: 'Rise of the monarchy; Samuel, Saul\'s kingship, and the anointing and rise of David.',
    canons: {
      protestant: { accepted: true, order: 9, label: 'Canonical' },
      catholic:   { accepted: true, order: 9, label: 'Canonical' },
      orthodox:   { accepted: true, order: 9, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 9, label: 'Canonical' }
    }
  },
  {
    id: '2sa', slug: '2-samuel', slugApi: '2+samuel', title: '2 Samuel', chapterCount: 24,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '6th Century BC',
    originNote: 'David\'s full reign over united Israel; his sins, Bathsheba, Absalom\'s revolt, and Davidic covenant.',
    canons: {
      protestant: { accepted: true, order: 10, label: 'Canonical' },
      catholic:   { accepted: true, order: 10, label: 'Canonical' },
      orthodox:   { accepted: true, order: 10, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 10, label: 'Canonical' }
    }
  },
  {
    id: '1ki', slug: '1-kings', slugApi: '1+kings', title: '1 Kings', chapterCount: 22,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '6th Century BC',
    originNote: 'Solomon\'s glory and Temple, kingdom divided after him; Elijah and the prophetic contest on Carmel.',
    canons: {
      protestant: { accepted: true, order: 11, label: 'Canonical' },
      catholic:   { accepted: true, order: 11, label: 'Canonical' },
      orthodox:   { accepted: true, order: 11, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 11, label: 'Canonical' }
    }
  },
  {
    id: '2ki', slug: '2-kings', slugApi: '2+kings', title: '2 Kings', chapterCount: 25,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '6th Century BC',
    originNote: 'Elisha\'s ministry; fall of Israel (722 BC) and Judah (586 BC); exile to Babylon.',
    canons: {
      protestant: { accepted: true, order: 12, label: 'Canonical' },
      catholic:   { accepted: true, order: 12, label: 'Canonical' },
      orthodox:   { accepted: true, order: 12, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 12, label: 'Canonical' }
    }
  },
  {
    id: '1ch', slug: '1-chronicles', slugApi: '1+chronicles', title: '1 Chronicles', chapterCount: 29,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '5th Century BC',
    originNote: 'Genealogies from Adam through David\'s reign, with emphasis on Temple worship and the Levitical priesthood.',
    canons: {
      protestant: { accepted: true, order: 13, label: 'Canonical' },
      catholic:   { accepted: true, order: 13, label: 'Canonical' },
      orthodox:   { accepted: true, order: 13, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 13, label: 'Canonical' }
    }
  },
  {
    id: '2ch', slug: '2-chronicles', slugApi: '2+chronicles', title: '2 Chronicles', chapterCount: 36,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '5th Century BC',
    originNote: 'Solomon\'s Temple to its destruction; focus on Judah\'s kings, Temple reforms, and Cyrus\'s decree.',
    canons: {
      protestant: { accepted: true, order: 14, label: 'Canonical' },
      catholic:   { accepted: true, order: 14, label: 'Canonical' },
      orthodox:   { accepted: true, order: 14, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 14, label: 'Canonical' }
    }
  },
  {
    id: 'ezr', slug: 'ezra', slugApi: 'ezra', title: 'Ezra', chapterCount: 10,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '5th Century BC',
    originNote: 'Return from Babylonian exile; rebuilding the Temple and Ezra\'s Torah reform.',
    canons: {
      protestant: { accepted: true, order: 15, label: 'Canonical' },
      catholic:   { accepted: true, order: 15, label: 'Canonical' },
      orthodox:   { accepted: true, order: 15, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 15, label: 'Canonical' }
    }
  },
  {
    id: 'neh', slug: 'nehemiah', slugApi: 'nehemiah', title: 'Nehemiah', chapterCount: 13,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '5th Century BC',
    originNote: 'Rebuilding Jerusalem\'s walls, community covenant renewal, and Sabbath reform under Nehemiah.',
    canons: {
      protestant: { accepted: true, order: 16, label: 'Canonical' },
      catholic:   { accepted: true, order: 16, label: 'Canonical' },
      orthodox:   { accepted: true, order: 16, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 16, label: 'Canonical' }
    }
  },
  {
    id: 'est', slug: 'esther', slugApi: 'esther', title: 'Esther', chapterCount: 10,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '5th–4th Century BC',
    originNote: 'Esther\'s courageous intervention to save Jews from Haman\'s plot in Persia. Catholic/Orthodox canon includes Greek additions.',
    canons: {
      protestant: { accepted: true, order: 17, label: 'Canonical (10 chapters)' },
      catholic:   { accepted: true, order: 17, label: 'Canonical (Greek additions included)' },
      orthodox:   { accepted: true, order: 17, label: 'Canonical (Greek additions included)' },
      ethiopian:  { accepted: true, order: 17, label: 'Canonical' }
    }
  },
  {
    id: 'job', slug: 'job', slugApi: 'job', title: 'Job', chapterCount: 42,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: 'Unknown — 6th–4th Century BC',
    originNote: 'Wisdom theodicy; the righteous sufferer Job challenges his friends\' retributive theology and encounters God in the whirlwind.',
    canons: {
      protestant: { accepted: true, order: 18, label: 'Canonical' },
      catholic:   { accepted: true, order: 18, label: 'Canonical' },
      orthodox:   { accepted: true, order: 18, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 18, label: 'Canonical' }
    }
  },
  {
    id: 'psa', slug: 'psalms', slugApi: 'psalms', title: 'Psalms', chapterCount: 150,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '10th–5th Century BC',
    originNote: 'Hebrew hymnal of 150 poems; lament, praise, royal, wisdom, and pilgrimage psalms by David, Asaph, Sons of Korah, and others. Ethiopian canon includes Psalm 151.',
    canons: {
      protestant: { accepted: true, order: 19, label: 'Canonical' },
      catholic:   { accepted: true, order: 19, label: 'Canonical' },
      orthodox:   { accepted: true, order: 19, label: 'Canonical (+ Psalm 151)' },
      ethiopian:  { accepted: true, order: 19, label: 'Canonical (+ Psalm 151 + Psalms of Solomon)' }
    }
  },
  {
    id: 'pro', slug: 'proverbs', slugApi: 'proverbs', title: 'Proverbs', chapterCount: 31,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '10th–5th Century BC',
    originNote: 'Collected wisdom literature from Solomonic tradition; personified Lady Wisdom calls all to fear the LORD.',
    canons: {
      protestant: { accepted: true, order: 20, label: 'Canonical' },
      catholic:   { accepted: true, order: 20, label: 'Canonical' },
      orthodox:   { accepted: true, order: 20, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 20, label: 'Canonical' }
    }
  },
  {
    id: 'ecc', slug: 'ecclesiastes', slugApi: 'ecclesiastes', title: 'Ecclesiastes', chapterCount: 12,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '4th–3rd Century BC',
    originNote: '"Vanity of vanities" — Qohelet\'s philosophical inquiry into meaning under the sun; concludes: fear God and keep his commandments.',
    canons: {
      protestant: { accepted: true, order: 21, label: 'Canonical' },
      catholic:   { accepted: true, order: 21, label: 'Canonical' },
      orthodox:   { accepted: true, order: 21, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 21, label: 'Canonical' }
    }
  },
  {
    id: 'sng', slug: 'song-of-solomon', slugApi: 'song+of+solomon', title: 'Song of Solomon', chapterCount: 8,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '10th–6th Century BC',
    originNote: 'Lyric love poetry attributed to Solomon; interpreted allegorically as God\'s love for Israel (Jewish) or Christ\'s love for the Church (Christian).',
    canons: {
      protestant: { accepted: true, order: 22, label: 'Canonical' },
      catholic:   { accepted: true, order: 22, label: 'Canonical' },
      orthodox:   { accepted: true, order: 22, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 22, label: 'Canonical' }
    }
  },
  {
    id: 'isa', slug: 'isaiah', slugApi: 'isaiah', title: 'Isaiah', chapterCount: 66,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '8th–6th Century BC',
    originNote: 'Major prophet; vision of Zion, the Servant Songs (52–53), and eschatological new creation. "The fifth Gospel" in early church tradition.',
    canons: {
      protestant: { accepted: true, order: 23, label: 'Canonical' },
      catholic:   { accepted: true, order: 23, label: 'Canonical' },
      orthodox:   { accepted: true, order: 23, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 23, label: 'Canonical' }
    }
  },
  {
    id: 'jer', slug: 'jeremiah', slugApi: 'jeremiah', title: 'Jeremiah', chapterCount: 52,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '7th–6th Century BC',
    originNote: 'The "weeping prophet" who announced judgment and the New Covenant (31:31); witnessed Jerusalem\'s fall to Babylon.',
    canons: {
      protestant: { accepted: true, order: 24, label: 'Canonical' },
      catholic:   { accepted: true, order: 24, label: 'Canonical' },
      orthodox:   { accepted: true, order: 24, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 24, label: 'Canonical' }
    }
  },
  {
    id: 'lam', slug: 'lamentations', slugApi: 'lamentations', title: 'Lamentations', chapterCount: 5,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '6th Century BC',
    originNote: 'Five acrostic dirges mourning the destruction of Jerusalem and the Temple in 586 BC. Attributed to Jeremiah.',
    canons: {
      protestant: { accepted: true, order: 25, label: 'Canonical' },
      catholic:   { accepted: true, order: 25, label: 'Canonical' },
      orthodox:   { accepted: true, order: 25, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 25, label: 'Canonical' }
    }
  },
  {
    id: 'eze', slug: 'ezekiel', slugApi: 'ezekiel', title: 'Ezekiel', chapterCount: 48,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '6th Century BC',
    originNote: 'Priest-prophet among the Babylonian exiles; Merkavah visions, valley of dry bones (ch.37), and the eschatological Temple.',
    canons: {
      protestant: { accepted: true, order: 26, label: 'Canonical' },
      catholic:   { accepted: true, order: 26, label: 'Canonical' },
      orthodox:   { accepted: true, order: 26, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 26, label: 'Canonical' }
    }
  },
  {
    id: 'dan', slug: 'daniel', slugApi: 'daniel', title: 'Daniel', chapterCount: 12,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '2nd Century BC (final form)',
    originNote: 'Court tales and apocalyptic visions; fiery furnace, lion\'s den, four kingdoms, Son of Man (7:13). Greek additions accepted by Catholic/Orthodox.',
    canons: {
      protestant: { accepted: true, order: 27, label: 'Canonical (12 chapters)' },
      catholic:   { accepted: true, order: 27, label: 'Canonical (+ Greek additions)' },
      orthodox:   { accepted: true, order: 27, label: 'Canonical (+ Greek additions)' },
      ethiopian:  { accepted: true, order: 27, label: 'Canonical' }
    }
  },
  {
    id: 'hos', slug: 'hosea', slugApi: 'hosea', title: 'Hosea', chapterCount: 14,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '8th Century BC',
    originNote: 'Northern prophet who married the unfaithful Gomer as a sign of Israel\'s covenant-breaking with God; message of divine love and restoration.',
    canons: {
      protestant: { accepted: true, order: 28, label: 'Canonical' },
      catholic:   { accepted: true, order: 28, label: 'Canonical' },
      orthodox:   { accepted: true, order: 28, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 28, label: 'Canonical' }
    }
  },
  {
    id: 'joe', slug: 'joel', slugApi: 'joel', title: 'Joel', chapterCount: 3,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '5th–4th Century BC',
    originNote: 'Locust plague as judgment and the promise of Spirit outpouring (2:28–29) quoted by Peter on Pentecost (Acts 2).',
    canons: {
      protestant: { accepted: true, order: 29, label: 'Canonical' },
      catholic:   { accepted: true, order: 29, label: 'Canonical' },
      orthodox:   { accepted: true, order: 29, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 29, label: 'Canonical' }
    }
  },
  {
    id: 'amo', slug: 'amos', slugApi: 'amos', title: 'Amos', chapterCount: 9,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '8th Century BC',
    originNote: 'Shepherd-prophet from Tekoa preaching social justice in the prosperous but corrupt northern kingdom of Israel.',
    canons: {
      protestant: { accepted: true, order: 30, label: 'Canonical' },
      catholic:   { accepted: true, order: 30, label: 'Canonical' },
      orthodox:   { accepted: true, order: 30, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 30, label: 'Canonical' }
    }
  },
  {
    id: 'oba', slug: 'obadiah', slugApi: 'obadiah', title: 'Obadiah', chapterCount: 1,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '6th Century BC',
    originNote: 'Shortest OT book; oracle against Edom for their gloating over Jerusalem\'s fall, and promise of Israel\'s restoration.',
    canons: {
      protestant: { accepted: true, order: 31, label: 'Canonical' },
      catholic:   { accepted: true, order: 31, label: 'Canonical' },
      orthodox:   { accepted: true, order: 31, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 31, label: 'Canonical' }
    }
  },
  {
    id: 'jon', slug: 'jonah', slugApi: 'jonah', title: 'Jonah', chapterCount: 4,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '8th–5th Century BC',
    originNote: 'Reluctant prophet swallowed by a great fish; God\'s mercy extended even to pagan Nineveh. A sign of Christ\'s resurrection (Matthew 12:40).',
    canons: {
      protestant: { accepted: true, order: 32, label: 'Canonical' },
      catholic:   { accepted: true, order: 32, label: 'Canonical' },
      orthodox:   { accepted: true, order: 32, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 32, label: 'Canonical' }
    }
  },
  {
    id: 'mic', slug: 'micah', slugApi: 'micah', title: 'Micah', chapterCount: 7,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '8th Century BC',
    originNote: 'Prophesied Bethlehem as the birthplace of Israel\'s ruler (5:2); "Do justice, love kindness, walk humbly" (6:8).',
    canons: {
      protestant: { accepted: true, order: 33, label: 'Canonical' },
      catholic:   { accepted: true, order: 33, label: 'Canonical' },
      orthodox:   { accepted: true, order: 33, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 33, label: 'Canonical' }
    }
  },
  {
    id: 'nah', slug: 'nahum', slugApi: 'nahum', title: 'Nahum', chapterCount: 3,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '7th Century BC',
    originNote: 'Oracle of doom against Nineveh, the Assyrian capital; vivid poetic depiction of the city\'s fall (612 BC).',
    canons: {
      protestant: { accepted: true, order: 34, label: 'Canonical' },
      catholic:   { accepted: true, order: 34, label: 'Canonical' },
      orthodox:   { accepted: true, order: 34, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 34, label: 'Canonical' }
    }
  },
  {
    id: 'hab', slug: 'habakkuk', slugApi: 'habakkuk', title: 'Habakkuk', chapterCount: 3,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '7th Century BC',
    originNote: 'Dialogic prophecy wrestling with divine justice; "the righteous shall live by faith" (2:4) — foundational to Paul\'s theology (Romans 1:17).',
    canons: {
      protestant: { accepted: true, order: 35, label: 'Canonical' },
      catholic:   { accepted: true, order: 35, label: 'Canonical' },
      orthodox:   { accepted: true, order: 35, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 35, label: 'Canonical' }
    }
  },
  {
    id: 'zep', slug: 'zephaniah', slugApi: 'zephaniah', title: 'Zephaniah', chapterCount: 3,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '7th Century BC',
    originNote: 'Announced the Day of the LORD judgment on Judah and surrounding nations, with promise of a humble remnant.',
    canons: {
      protestant: { accepted: true, order: 36, label: 'Canonical' },
      catholic:   { accepted: true, order: 36, label: 'Canonical' },
      orthodox:   { accepted: true, order: 36, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 36, label: 'Canonical' }
    }
  },
  {
    id: 'hag', slug: 'haggai', slugApi: 'haggai', title: 'Haggai', chapterCount: 2,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '520 BC',
    originNote: 'Post-exilic prophet urging the returned community to rebuild the Jerusalem Temple; four oracles in 520 BC.',
    canons: {
      protestant: { accepted: true, order: 37, label: 'Canonical' },
      catholic:   { accepted: true, order: 37, label: 'Canonical' },
      orthodox:   { accepted: true, order: 37, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 37, label: 'Canonical' }
    }
  },
  {
    id: 'zec', slug: 'zechariah', slugApi: 'zechariah', title: 'Zechariah', chapterCount: 14,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '6th–5th Century BC',
    originNote: 'Post-exilic prophet; eight night visions, the messianic King entering on a donkey (9:9), and apocalyptic chapters (12–14).',
    canons: {
      protestant: { accepted: true, order: 38, label: 'Canonical' },
      catholic:   { accepted: true, order: 38, label: 'Canonical' },
      orthodox:   { accepted: true, order: 38, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 38, label: 'Canonical' }
    }
  },
  {
    id: 'mal', slug: 'malachi', slugApi: 'malachi', title: 'Malachi', chapterCount: 4,
    testament: 'OT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '5th Century BC',
    originNote: 'Last canonical OT prophet; disputes with the community over proper worship; promises "Elijah" before the Day of the LORD (4:5).',
    canons: {
      protestant: { accepted: true, order: 39, label: 'Canonical' },
      catholic:   { accepted: true, order: 39, label: 'Canonical' },
      orthodox:   { accepted: true, order: 39, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 39, label: 'Canonical' }
    }
  },

  // ═══════════════════════════════════════════════════════
  // NEW TESTAMENT — 27 Books (All Traditions)
  // ═══════════════════════════════════════════════════════

  {
    id: 'mat', slug: 'matthew', slugApi: 'matthew', title: 'Matthew', chapterCount: 28,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '80–90 AD',
    originNote: 'Gospel for a Jewish-Christian audience; five discourses, Sermon on the Mount (5–7), Great Commission (28:18–20).',
    canons: {
      protestant: { accepted: true, order: 40, label: 'Canonical' },
      catholic:   { accepted: true, order: 47, label: 'Canonical' },
      orthodox:   { accepted: true, order: 47, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 52, label: 'Canonical' }
    }
  },
  {
    id: 'mrk', slug: 'mark', slugApi: 'mark', title: 'Mark', chapterCount: 16,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '65–70 AD',
    originNote: 'Earliest Gospel; fast-paced narrative of Jesus\'s ministry, passion, and resurrection. Peter\'s memoirs per Papias (c. 130 AD).',
    canons: {
      protestant: { accepted: true, order: 41, label: 'Canonical' },
      catholic:   { accepted: true, order: 48, label: 'Canonical' },
      orthodox:   { accepted: true, order: 48, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 53, label: 'Canonical' }
    }
  },
  {
    id: 'luk', slug: 'luke', slugApi: 'luke', title: 'Luke', chapterCount: 24,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '80–85 AD',
    originNote: 'Longest Gospel; companion to Acts (Luke-Acts). Emphasis on prayer, the Holy Spirit, women, and the poor. Written for Theophilus.',
    canons: {
      protestant: { accepted: true, order: 42, label: 'Canonical' },
      catholic:   { accepted: true, order: 49, label: 'Canonical' },
      orthodox:   { accepted: true, order: 49, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 54, label: 'Canonical' }
    }
  },
  {
    id: 'joh', slug: 'john', slugApi: 'john', title: 'John', chapterCount: 21,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '90–100 AD',
    originNote: 'Fourth Gospel; divine Logos (1:1), seven signs, I AM sayings, Farewell Discourse (14–17), high priestly prayer.',
    canons: {
      protestant: { accepted: true, order: 43, label: 'Canonical' },
      catholic:   { accepted: true, order: 50, label: 'Canonical' },
      orthodox:   { accepted: true, order: 50, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 55, label: 'Canonical' }
    }
  },
  {
    id: 'act', slug: 'acts', slugApi: 'acts', title: 'Acts', chapterCount: 28,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '80–85 AD',
    originNote: 'Acts of the Apostles by Luke; Pentecost, early church expansion from Jerusalem to Rome through Peter and Paul.',
    canons: {
      protestant: { accepted: true, order: 44, label: 'Canonical' },
      catholic:   { accepted: true, order: 51, label: 'Canonical' },
      orthodox:   { accepted: true, order: 51, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 56, label: 'Canonical' }
    }
  },
  {
    id: 'rom', slug: 'romans', slugApi: 'romans', title: 'Romans', chapterCount: 16,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '57 AD',
    originNote: 'Paul\'s magnum opus on the gospel; justification by faith (1–4), life in the Spirit (5–8), Israel\'s place (9–11), ethics (12–16).',
    canons: {
      protestant: { accepted: true, order: 45, label: 'Canonical' },
      catholic:   { accepted: true, order: 52, label: 'Canonical' },
      orthodox:   { accepted: true, order: 52, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 57, label: 'Canonical' }
    }
  },
  {
    id: '1co', slug: '1-corinthians', slugApi: '1+corinthians', title: '1 Corinthians', chapterCount: 16,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '53–54 AD',
    originNote: 'Paul addresses a fractured Corinthian church: wisdom, spiritual gifts, Lord\'s Supper, resurrection (ch.15).',
    canons: {
      protestant: { accepted: true, order: 46, label: 'Canonical' },
      catholic:   { accepted: true, order: 53, label: 'Canonical' },
      orthodox:   { accepted: true, order: 53, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 58, label: 'Canonical' }
    }
  },
  {
    id: '2co', slug: '2-corinthians', slugApi: '2+corinthians', title: '2 Corinthians', chapterCount: 13,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '55–56 AD',
    originNote: 'Paul\'s most personal letter; apostolic suffering, new covenant ministry, thorn in the flesh, generous giving.',
    canons: {
      protestant: { accepted: true, order: 47, label: 'Canonical' },
      catholic:   { accepted: true, order: 54, label: 'Canonical' },
      orthodox:   { accepted: true, order: 54, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 59, label: 'Canonical' }
    }
  },
  {
    id: 'gal', slug: 'galatians', slugApi: 'galatians', title: 'Galatians', chapterCount: 6,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '48–55 AD',
    originNote: '"The Magna Carta of Christian freedom" — Paul\'s defense of justification by faith against Judaizing teachers; fruit of the Spirit (5:22–23).',
    canons: {
      protestant: { accepted: true, order: 48, label: 'Canonical' },
      catholic:   { accepted: true, order: 55, label: 'Canonical' },
      orthodox:   { accepted: true, order: 55, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 60, label: 'Canonical' }
    }
  },
  {
    id: 'eph', slug: 'ephesians', slugApi: 'ephesians', title: 'Ephesians', chapterCount: 6,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '60–62 AD',
    originNote: 'Cosmic scope of salvation; the Church as the body of Christ; household codes; armor of God (ch.6).',
    canons: {
      protestant: { accepted: true, order: 49, label: 'Canonical' },
      catholic:   { accepted: true, order: 56, label: 'Canonical' },
      orthodox:   { accepted: true, order: 56, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 61, label: 'Canonical' }
    }
  },
  {
    id: 'php', slug: 'philippians', slugApi: 'philippians', title: 'Philippians', chapterCount: 4,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '60–62 AD',
    originNote: '"The letter of joy" written from prison; the Christ Hymn (2:6–11); "I can do all things through Christ" (4:13).',
    canons: {
      protestant: { accepted: true, order: 50, label: 'Canonical' },
      catholic:   { accepted: true, order: 57, label: 'Canonical' },
      orthodox:   { accepted: true, order: 57, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 62, label: 'Canonical' }
    }
  },
  {
    id: 'col', slug: 'colossians', slugApi: 'colossians', title: 'Colossians', chapterCount: 4,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '60–62 AD',
    originNote: 'The cosmic Christ Hymn (1:15–20); warning against "philosophy and empty deceit" — possibly early proto-Gnosticism.',
    canons: {
      protestant: { accepted: true, order: 51, label: 'Canonical' },
      catholic:   { accepted: true, order: 58, label: 'Canonical' },
      orthodox:   { accepted: true, order: 58, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 63, label: 'Canonical' }
    }
  },
  {
    id: '1th', slug: '1-thessalonians', slugApi: '1+thessalonians', title: '1 Thessalonians', chapterCount: 5,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '50–51 AD',
    originNote: 'One of Paul\'s earliest letters; comfort for the bereaved and expectation of the Lord\'s return (the Parousia).',
    canons: {
      protestant: { accepted: true, order: 52, label: 'Canonical' },
      catholic:   { accepted: true, order: 59, label: 'Canonical' },
      orthodox:   { accepted: true, order: 59, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 64, label: 'Canonical' }
    }
  },
  {
    id: '2th', slug: '2-thessalonians', slugApi: '2+thessalonians', title: '2 Thessalonians', chapterCount: 3,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '50–51 AD',
    originNote: 'Corrects misconceptions about the end times; the "man of lawlessness" must come before the Day of the Lord.',
    canons: {
      protestant: { accepted: true, order: 53, label: 'Canonical' },
      catholic:   { accepted: true, order: 60, label: 'Canonical' },
      orthodox:   { accepted: true, order: 60, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 65, label: 'Canonical' }
    }
  },
  {
    id: '1ti', slug: '1-timothy', slugApi: '1+timothy', title: '1 Timothy', chapterCount: 6,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '65 AD or later',
    originNote: 'Pastoral epistle with instructions for church order, worship, and leadership qualifications for Ephesus.',
    canons: {
      protestant: { accepted: true, order: 54, label: 'Canonical' },
      catholic:   { accepted: true, order: 61, label: 'Canonical' },
      orthodox:   { accepted: true, order: 61, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 66, label: 'Canonical' }
    }
  },
  {
    id: '2ti', slug: '2-timothy', slugApi: '2+timothy', title: '2 Timothy', chapterCount: 4,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '65–67 AD',
    originNote: 'Paul\'s final letter from prison to Timothy; Scripture inspiration (3:16); "I have fought the good fight" (4:7).',
    canons: {
      protestant: { accepted: true, order: 55, label: 'Canonical' },
      catholic:   { accepted: true, order: 62, label: 'Canonical' },
      orthodox:   { accepted: true, order: 62, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 67, label: 'Canonical' }
    }
  },
  {
    id: 'tit', slug: 'titus', slugApi: 'titus', title: 'Titus', chapterCount: 3,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '65 AD or later',
    originNote: 'Pastoral instructions for Titus in Crete; sound doctrine, elder qualifications, and Christian civic conduct.',
    canons: {
      protestant: { accepted: true, order: 56, label: 'Canonical' },
      catholic:   { accepted: true, order: 63, label: 'Canonical' },
      orthodox:   { accepted: true, order: 63, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 68, label: 'Canonical' }
    }
  },
  {
    id: 'phm', slug: 'philemon', slugApi: 'philemon', title: 'Philemon', chapterCount: 1,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '60–62 AD',
    originNote: 'Paul\'s personal appeal to Philemon to receive his runaway slave Onesimus as a brother in Christ — a touchstone on slavery and reconciliation.',
    canons: {
      protestant: { accepted: true, order: 57, label: 'Canonical' },
      catholic:   { accepted: true, order: 64, label: 'Canonical' },
      orthodox:   { accepted: true, order: 64, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 69, label: 'Canonical' }
    }
  },
  {
    id: 'heb', slug: 'hebrews', slugApi: 'hebrews', title: 'Hebrews', chapterCount: 13,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '60–90 AD',
    originNote: 'Sophisticated typological theology; Christ as the final High Priest and the better sacrifice. Author unknown — possibly Apollos, Priscilla, or Luke.',
    canons: {
      protestant: { accepted: true, order: 58, label: 'Canonical' },
      catholic:   { accepted: true, order: 65, label: 'Canonical' },
      orthodox:   { accepted: true, order: 65, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 70, label: 'Canonical' }
    }
  },
  {
    id: 'jas', slug: 'james', slugApi: 'james', title: 'James', chapterCount: 5,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '50–62 AD',
    originNote: 'Practical wisdom epistle; "faith without works is dead" (2:17); care for the poor; the prayer of faith. Written by James the brother of Jesus.',
    canons: {
      protestant: { accepted: true, order: 59, label: 'Canonical' },
      catholic:   { accepted: true, order: 66, label: 'Canonical' },
      orthodox:   { accepted: true, order: 66, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 71, label: 'Canonical' }
    }
  },
  {
    id: '1pe', slug: '1-peter', slugApi: '1+peter', title: '1 Peter', chapterCount: 5,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '60–65 AD',
    originNote: 'Encouragement to suffering Christians scattered across Asia Minor; "a royal priesthood, a holy nation" (2:9); submission and suffering.',
    canons: {
      protestant: { accepted: true, order: 60, label: 'Canonical' },
      catholic:   { accepted: true, order: 67, label: 'Canonical' },
      orthodox:   { accepted: true, order: 67, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 72, label: 'Canonical' }
    }
  },
  {
    id: '2pe', slug: '2-peter', slugApi: '2+peter', title: '2 Peter', chapterCount: 3,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '80–100 AD',
    originNote: 'Warning against false teachers and mockers of the Parousia. Latest accepted NT book. Note: excluded from the Syriac Peshitta canon.',
    canons: {
      protestant: { accepted: true, order: 61, label: 'Canonical' },
      catholic:   { accepted: true, order: 68, label: 'Canonical' },
      orthodox:   { accepted: true, order: 68, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 73, label: 'Canonical' }
    }
  },
  {
    id: '1jo', slug: '1-john', slugApi: '1+john', title: '1 John', chapterCount: 5,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '90–100 AD',
    originNote: '"God is love" (4:8); tests of authentic Christian life; warning against antichrists who deny the Incarnation.',
    canons: {
      protestant: { accepted: true, order: 62, label: 'Canonical' },
      catholic:   { accepted: true, order: 69, label: 'Canonical' },
      orthodox:   { accepted: true, order: 69, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 74, label: 'Canonical' }
    }
  },
  {
    id: '2jo', slug: '2-john', slugApi: '2+john', title: '2 John', chapterCount: 1,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '90–100 AD',
    originNote: 'Brief letter from "the Elder" about walking in truth and refusing hospitality to false teachers. Note: excluded from the Syriac Peshitta.',
    canons: {
      protestant: { accepted: true, order: 63, label: 'Canonical' },
      catholic:   { accepted: true, order: 70, label: 'Canonical' },
      orthodox:   { accepted: true, order: 70, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 75, label: 'Canonical' }
    }
  },
  {
    id: '3jo', slug: '3-john', slugApi: '3+john', title: '3 John', chapterCount: 1,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '90–100 AD',
    originNote: 'Shortest NT book; personal letter commending Gaius and rebuking the domineering Diotrephes. Note: excluded from Syriac Peshitta.',
    canons: {
      protestant: { accepted: true, order: 64, label: 'Canonical' },
      catholic:   { accepted: true, order: 71, label: 'Canonical' },
      orthodox:   { accepted: true, order: 71, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 76, label: 'Canonical' }
    }
  },
  {
    id: 'jud', slug: 'jude', slugApi: 'jude', title: 'Jude', chapterCount: 1,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '65–80 AD',
    originNote: 'Urgent appeal against false teachers; directly quotes 1 Enoch 1:9 and the Testament of Moses. Note: excluded from Syriac Peshitta.',
    canons: {
      protestant: { accepted: true, order: 65, label: 'Canonical' },
      catholic:   { accepted: true, order: 72, label: 'Canonical' },
      orthodox:   { accepted: true, order: 72, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 77, label: 'Canonical' }
    }
  },
  {
    id: 'rev', slug: 'revelation', slugApi: 'revelation', title: 'Revelation', chapterCount: 22,
    testament: 'NT', category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '95–96 AD',
    originNote: 'Apocalyptic vision of John on Patmos; seven churches, seals, trumpets, bowls of wrath, new Jerusalem. The "Apocalypse" (ἀποκάλυψις = unveiling). Note: excluded from Syriac Peshitta and the Armenian lectionary historically.',
    canons: {
      protestant: { accepted: true, order: 66, label: 'Canonical' },
      catholic:   { accepted: true, order: 73, label: 'Canonical' },
      orthodox:   { accepted: true, order: 73, label: 'Canonical' },
      ethiopian:  { accepted: true, order: 78, label: 'Canonical' }
    }
  },

  // ═══════════════════════════════════════════════════════
  // DEUTEROCANON — Catholic + Orthodox (7 main books)
  // ═══════════════════════════════════════════════════════

  {
    id: 'tob', slug: 'tobit', slugApi: 'tobit', title: 'Tobit', chapterCount: 14,
    testament: 'Deuterocanon', category: CANON_CATEGORIES.DEUTEROCANON,
    originPeriod: '3rd–2nd Century BC',
    originNote: 'Story of righteous Tobit in Assyrian exile, his blindness, and his son Tobias\'s journey with the angel Raphael. Rich in themes of piety, prayer, and marriage.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha (Non-canonical)' },
      catholic:   { accepted: true, order: 15, label: 'Deuterocanon — Council of Trent (1546)' },
      orthodox:   { accepted: true, order: 15, label: 'Deuterocanon — Septuagint canon' },
      ethiopian:  { accepted: true, order: 15, label: 'Deuterocanon' }
    }
  },
  {
    id: 'jdt', slug: 'judith', slugApi: 'judith', title: 'Judith', chapterCount: 16,
    testament: 'Deuterocanon', category: CANON_CATEGORIES.DEUTEROCANON,
    originPeriod: '2nd Century BC',
    originNote: 'Heroic widow Judith beheads the Assyrian general Holofernes to save Israel. A paradigm of courageous piety.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha (Non-canonical)' },
      catholic:   { accepted: true, order: 16, label: 'Deuterocanon' },
      orthodox:   { accepted: true, order: 16, label: 'Deuterocanon' },
      ethiopian:  { accepted: true, order: 16, label: 'Deuterocanon' }
    }
  },
  {
    id: 'wis', slug: 'wisdom', slugApi: 'wisdom', title: 'Wisdom of Solomon', chapterCount: 19,
    testament: 'Deuterocanon', category: CANON_CATEGORIES.DEUTEROCANON,
    originPeriod: '100–50 BC',
    originNote: 'Alexandrian Jewish wisdom poem praising Lady Wisdom and the immortality of the righteous soul; important background for John 1 and Paul\'s Christology.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha (Non-canonical)' },
      catholic:   { accepted: true, order: 25, label: 'Deuterocanon' },
      orthodox:   { accepted: true, order: 25, label: 'Deuterocanon' },
      ethiopian:  { accepted: true, order: 25, label: 'Deuterocanon' }
    }
  },
  {
    id: 'sir', slug: 'sirach', slugApi: 'sirach', title: 'Sirach (Ecclesiasticus)', chapterCount: 51,
    testament: 'Deuterocanon', category: CANON_CATEGORIES.DEUTEROCANON,
    originPeriod: '190–175 BC',
    originNote: 'Extensive ethical proverbs by Ben Sira (Jesus son of Sirach) of Jerusalem; praised virtuous women, Temple worship, and Israel\'s history of wisdom heroes.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha (Non-canonical)' },
      catholic:   { accepted: true, order: 26, label: 'Deuterocanon' },
      orthodox:   { accepted: true, order: 26, label: 'Deuterocanon' },
      ethiopian:  { accepted: true, order: 26, label: 'Deuterocanon' }
    }
  },
  {
    id: 'bar', slug: 'baruch', slugApi: 'baruch', title: 'Baruch', chapterCount: 6,
    testament: 'Deuterocanon', category: CANON_CATEGORIES.DEUTEROCANON,
    originPeriod: '2nd Century BC',
    originNote: 'Attributed to Jeremiah\'s secretary Baruch; includes a prayer of confession (1–3:8), hymn to Wisdom as Torah (3:9–4:4), and comfort for exiles. Chapter 6 = Letter of Jeremiah.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha (Non-canonical)' },
      catholic:   { accepted: true, order: 27, label: 'Deuterocanon' },
      orthodox:   { accepted: true, order: 27, label: 'Deuterocanon' },
      ethiopian:  { accepted: true, order: 27, label: 'Deuterocanon' }
    }
  },
  {
    id: 'mac1', slug: '1-maccabees', slugApi: '1+maccabees', title: '1 Maccabees', chapterCount: 16,
    testament: 'Deuterocanon', category: CANON_CATEGORIES.DEUTEROCANON,
    originPeriod: '100 BC',
    originNote: 'Historical chronicle of the Maccabean revolt (167–134 BC) against Antiochus IV Epiphanes; Judas Maccabeus, Temple rededication (Hanukkah). Written in Hebrew, survives in Greek.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha (Non-canonical)' },
      catholic:   { accepted: true, order: 45, label: 'Deuterocanon' },
      orthodox:   { accepted: true, order: 45, label: 'Deuterocanon' },
      ethiopian:  { accepted: true, order: 45, label: 'Deuterocanon' }
    }
  },
  {
    id: 'mac2', slug: '2-maccabees', slugApi: '2+maccabees', title: '2 Maccabees', chapterCount: 15,
    testament: 'Deuterocanon', category: CANON_CATEGORIES.DEUTEROCANON,
    originPeriod: '100 BC',
    originNote: 'Theological reinterpretation of 1 Maccabees focusing on Temple, martyrdom theology (resurrection language), and Judas\'s exploits. First clear Jewish text on bodily resurrection.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha (Non-canonical)' },
      catholic:   { accepted: true, order: 46, label: 'Deuterocanon' },
      orthodox:   { accepted: true, order: 46, label: 'Deuterocanon' },
      ethiopian:  { accepted: true, order: 46, label: 'Deuterocanon' }
    }
  },

  // ═══════════════════════════════════════════════════════
  // ORTHODOX ANAGIGNOSKOMENA — Eastern Orthodox exclusive books
  // ("Worthy to be read" — accepted in Greek/Slavic traditions)
  // ═══════════════════════════════════════════════════════

  {
    id: '1esd', slug: '1-esdras', slugApi: '1+esdras', title: '1 Esdras (3 Ezra)', chapterCount: 9,
    testament: 'Anagignoskomena', category: CANON_CATEGORIES.ANAGIGNOSKOMENA,
    originPeriod: '2nd Century BC',
    originNote: 'Parallel account of Ezra-Nehemiah events with the unique "Contest of the Three Youths" (wisdom debate about the greatest power). Called "3 Ezra" in Latin tradition.',
    localText: true,
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha (Non-canonical)' },
      catholic:   { accepted: false, order: null, label: 'Appendix (unofficial)' },
      orthodox:   { accepted: true, order: 47, label: 'Anagignoskomena' },
      ethiopian:  { accepted: false, order: null, label: 'Not in standard Ethiopian canon' }
    }
  },
  {
    id: 'mac3', slug: '3-maccabees', slugApi: '3+maccabees', title: '3 Maccabees', chapterCount: 7,
    testament: 'Anagignoskomena', category: CANON_CATEGORIES.ANAGIGNOSKOMENA,
    originPeriod: '1st Century BC',
    originNote: 'Unrelated to the Maccabean revolt; describes Ptolemy IV\'s attempt to kill Egyptian Jews via elephants and their miraculous deliverance. Important in Greek Orthodox practice.',
    localText: true,
    canons: {
      protestant: { accepted: false, order: null, label: 'Non-canonical' },
      catholic:   { accepted: false, order: null, label: 'Non-canonical' },
      orthodox:   { accepted: true, order: 48, label: 'Anagignoskomena' },
      ethiopian:  { accepted: false, order: null, label: 'Not in standard Ethiopian canon' }
    }
  },
  {
    id: 'mac4', slug: '4-maccabees', slugApi: '4+maccabees', title: '4 Maccabees', chapterCount: 18,
    testament: 'Anagignoskomena', category: CANON_CATEGORIES.ANAGIGNOSKOMENA,
    originPeriod: '1st Century AD',
    originNote: 'Philosophical treatise on Stoic virtue through the Maccabean martyrs\' stories; key text for martyrdom theology and "noble death" tradition in the church.',
    localText: true,
    canons: {
      protestant: { accepted: false, order: null, label: 'Non-canonical' },
      catholic:   { accepted: false, order: null, label: 'Non-canonical' },
      orthodox:   { accepted: true, order: 49, label: 'Anagignoskomena (Appendix in some traditions)' },
      ethiopian:  { accepted: false, order: null, label: 'Not in standard Ethiopian canon' }
    }
  },
  {
    id: 'pray-man', slug: 'prayer-of-manasseh', slugApi: 'prayer+of+manasseh', title: 'Prayer of Manasseh', chapterCount: 1,
    testament: 'Anagignoskomena', category: CANON_CATEGORIES.ANAGIGNOSKOMENA,
    originPeriod: '2nd Century BC – 1st Century AD',
    originNote: 'Penitential prayer attributed to the wicked King Manasseh (2 Chr 33:12–13); one of the most beautiful liturgical prayers in the apocrypha.',
    localText: true,
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha' },
      catholic:   { accepted: false, order: null, label: 'Appendix (unofficial)' },
      orthodox:   { accepted: true, order: 50, label: 'Anagignoskomena' },
      ethiopian:  { accepted: true, order: 50, label: 'Included in broader canon' }
    }
  },

  // ═══════════════════════════════════════════════════════
  // ETHIOPIAN EXCLUSIVE — Ethiopian Orthodox Tewahedo only
  // ═══════════════════════════════════════════════════════

  {
    id: 'eno', slug: '1-enoch', slugApi: null, title: '1 Enoch (Ethiopic Book of Enoch)', chapterCount: 108,
    testament: 'Ethiopian Canon', category: CANON_CATEGORIES.PSEUDEPIGRAPHA,
    originPeriod: '3rd–1st Century BC (composite)',
    originNote: 'R.H. Charles translation (1912, public domain). Five books: Watchers, Parables, Astronomy, Dream Visions, Epistle. Directly quoted in Jude 1:14–15. Canonical ONLY in Ethiopian Orthodox Tewahedo. Found among Dead Sea Scrolls.',
    localText: true,
    canons: {
      protestant: { accepted: false, order: null, label: 'Pseudepigrapha' },
      catholic:   { accepted: false, order: null, label: 'Pseudepigrapha' },
      orthodox:   { accepted: false, order: null, label: 'Pseudepigrapha' },
      ethiopian:  { accepted: true, order: 79, label: 'Canonical (Ethiopian Tewahedo)' }
    }
  },
  {
    id: 'jub', slug: 'jubilees', slugApi: null, title: 'Book of Jubilees (Little Genesis)', chapterCount: 50,
    testament: 'Ethiopian Canon', category: CANON_CATEGORIES.PSEUDEPIGRAPHA,
    originPeriod: '2nd Century BC',
    originNote: 'R.H. Charles translation (1902, public domain). Retells Genesis–Exodus organized in 49-year "Jubilee" periods; strict calendar, halakhic detail. Canonical in Ethiopia. Found among Dead Sea Scrolls.',
    localText: true,
    canons: {
      protestant: { accepted: false, order: null, label: 'Pseudepigrapha' },
      catholic:   { accepted: false, order: null, label: 'Pseudepigrapha' },
      orthodox:   { accepted: false, order: null, label: 'Pseudepigrapha' },
      ethiopian:  { accepted: true, order: 80, label: 'Canonical (Ethiopian Tewahedo)' }
    }
  },
  {
    id: 'meq1', slug: 'meqabyan-1', slugApi: null, title: 'Meqabyan 1 (Ethiopian Maccabees)', chapterCount: 36,
    testament: 'Ethiopian Canon', category: CANON_CATEGORIES.PSEUDEPIGRAPHA,
    originPeriod: 'Ancient — exact date unknown',
    originNote: 'Distinct from 1 Maccabees; tells of three heroes Meqabis, Meqabis, and Meqabis in a uniquely Ethiopian theological framework. Not related to the Greek Maccabees books. Only in Ge\'ez.',
    localText: true,
    canons: {
      protestant: { accepted: false, order: null, label: 'Non-canonical' },
      catholic:   { accepted: false, order: null, label: 'Non-canonical' },
      orthodox:   { accepted: false, order: null, label: 'Non-canonical' },
      ethiopian:  { accepted: true, order: 81, label: 'Canonical (Ethiopian Tewahedo)' }
    }
  },
  {
    id: 'meq2', slug: 'meqabyan-2', slugApi: null, title: 'Meqabyan 2', chapterCount: 20,
    testament: 'Ethiopian Canon', category: CANON_CATEGORIES.PSEUDEPIGRAPHA,
    originPeriod: 'Ancient — exact date unknown',
    originNote: 'Second book of the Meqabyan trilogy, unique to Ethiopian Orthodox Scripture. Only available in Ge\'ez language tradition.',
    localText: true,
    canons: {
      protestant: { accepted: false, order: null, label: 'Non-canonical' },
      catholic:   { accepted: false, order: null, label: 'Non-canonical' },
      orthodox:   { accepted: false, order: null, label: 'Non-canonical' },
      ethiopian:  { accepted: true, order: 82, label: 'Canonical (Ethiopian Tewahedo)' }
    }
  },
  {
    id: 'meq3', slug: 'meqabyan-3', slugApi: null, title: 'Meqabyan 3', chapterCount: 10,
    testament: 'Ethiopian Canon', category: CANON_CATEGORIES.PSEUDEPIGRAPHA,
    originPeriod: 'Ancient — exact date unknown',
    originNote: 'Third book of the Meqabyan trilogy. Together the three Meqabyan books are treasured in Ethiopian Orthodox liturgical tradition.',
    localText: true,
    canons: {
      protestant: { accepted: false, order: null, label: 'Non-canonical' },
      catholic:   { accepted: false, order: null, label: 'Non-canonical' },
      orthodox:   { accepted: false, order: null, label: 'Non-canonical' },
      ethiopian:  { accepted: true, order: 83, label: 'Canonical (Ethiopian Tewahedo)' }
    }
  },

  // ═══════════════════════════════════════════════════════
  // EARLY CHURCH WRITINGS — Historical/Patristic
  // (Studied but not canonical in any major tradition today)
  // ═══════════════════════════════════════════════════════

  {
    id: 'did', slug: 'didache', slugApi: null, title: 'The Didache', chapterCount: 16,
    testament: 'Early Church', category: CANON_CATEGORIES.EARLY_CHURCH_WRITING,
    originPeriod: '50–100 AD',
    originNote: 'First-century Christian manual (the "Teaching of the Twelve Apostles"); covers the Two Ways, baptism, fasting, Eucharist, and church order. Rediscovered in 1873 by Philotheos Bryennios.',
    localText: true,
    canons: {
      protestant: { accepted: false, order: null, label: 'Early Church Fathers' },
      catholic:   { accepted: false, order: null, label: 'Apostolic Fathers' },
      orthodox:   { accepted: false, order: null, label: 'Apostolic Fathers' },
      ethiopian:  { accepted: false, order: null, label: 'Apostolic Fathers' }
    }
  },
  {
    id: 'cle1', slug: '1-clement', slugApi: null, title: '1 Clement', chapterCount: 65,
    testament: 'Early Church', category: CANON_CATEGORIES.EARLY_CHURCH_WRITING,
    originPeriod: '96 AD',
    originNote: 'Epistle from Clement, Bishop of Rome, to the divided church at Corinth on unity and legitimate leadership. The earliest non-canonical Christian text after Paul\'s letters.',
    localText: true,
    canons: {
      protestant: { accepted: false, order: null, label: 'Early Church Fathers' },
      catholic:   { accepted: false, order: null, label: 'Apostolic Fathers' },
      orthodox:   { accepted: false, order: null, label: 'Apostolic Fathers' },
      ethiopian:  { accepted: false, order: null, label: 'Apostolic Fathers' }
    }
  },
  {
    id: 'ign', slug: 'epistles-of-ignatius', slugApi: null, title: 'Epistles of Ignatius of Antioch', chapterCount: 7,
    testament: 'Early Church', category: CANON_CATEGORIES.EARLY_CHURCH_WRITING,
    originPeriod: '110 AD',
    originNote: 'Seven letters written by Bishop Ignatius of Antioch on his way to martyrdom in Rome. Essential primary sources for early Christology, episcopacy, and eucharistic theology.',
    localText: true,
    canons: {
      protestant: { accepted: false, order: null, label: 'Early Church Fathers' },
      catholic:   { accepted: false, order: null, label: 'Apostolic Fathers' },
      orthodox:   { accepted: false, order: null, label: 'Apostolic Fathers' },
      ethiopian:  { accepted: false, order: null, label: 'Apostolic Fathers' }
    }
  },
  {
    id: 'shep', slug: 'shepherd-of-hermas', slugApi: null, title: 'Shepherd of Hermas', chapterCount: 5,
    testament: 'Early Church', category: CANON_CATEGORIES.EARLY_CHURCH_WRITING,
    originPeriod: '100–160 AD',
    originNote: 'Popular early Christian apocalypse; five Visions, twelve Mandates, ten Similitudes concerning repentance and the Church. Included in the Codex Sinaiticus after Revelation.',
    localText: true,
    canons: {
      protestant: { accepted: false, order: null, label: 'Early Church Fathers' },
      catholic:   { accepted: false, order: null, label: 'Apostolic Fathers' },
      orthodox:   { accepted: false, order: null, label: 'Apostolic Fathers' },
      ethiopian:  { accepted: false, order: null, label: 'Apostolic Fathers' }
    }
  }
];

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Get all books filtered and shaped for a given tradition
// ─────────────────────────────────────────────────────────────────────────────
export function getBooksForTradition(traditionKey = 'protestant') {
  const normKey = traditionKey.toLowerCase();
  return ALL_BOOKS.map(book => {
    const mem = book.canons[normKey] || { accepted: false, order: null, label: 'Not Included' };
    return {
      ...book,
      isAccepted: mem.accepted,
      canonicalOrder: mem.order,
      traditionLabel: mem.label
    };
  }).sort((a, b) => {
    // Accepted books first (by canonical order), then non-accepted alphabetically
    if (a.isAccepted && !b.isAccepted) return -1;
    if (!a.isAccepted && b.isAccepted) return 1;
    if (a.isAccepted && b.isAccepted) return (a.canonicalOrder || 999) - (b.canonicalOrder || 999);
    return a.title.localeCompare(b.title);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Chapter count lookup by slug
// ─────────────────────────────────────────────────────────────────────────────
export function getChapterCount(slug) {
  const book = ALL_BOOKS.find(b => b.slug === slug);
  return book ? book.chapterCount : 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper: Find a book by slug
// ─────────────────────────────────────────────────────────────────────────────
export function getBookBySlug(slug) {
  return ALL_BOOKS.find(b => b.slug === slug) || null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Testament group order for display
// ─────────────────────────────────────────────────────────────────────────────
export const TESTAMENT_GROUPS = [
  { key: 'OT',                label: 'Old Testament',   icon: '📜' },
  { key: 'NT',                label: 'New Testament',   icon: '✝️' },
  { key: 'Deuterocanon',      label: 'Deuterocanon',    icon: '📖' },
  { key: 'Anagignoskomena',   label: 'Orthodox Canon',  icon: '🔵' },
  { key: 'Ethiopian Canon',   label: 'Ethiopian Canon', icon: '🟣' },
  { key: 'Early Church',      label: 'Early Church',    icon: '⛪' }
];
