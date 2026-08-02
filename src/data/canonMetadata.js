export const CANON_CATEGORIES = {
  CANONICAL: 'canonical',
  DEUTEROCANON: 'deuterocanon',
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

export const ALL_BOOKS = [
  // Canonical Old Testament (Sample)
  {
    id: 'gen',
    slug: 'genesis',
    title: 'Genesis',
    testament: 'OT',
    category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '15th-13th Century BC',
    originNote: 'Attributed to Moses, opening book of the Torah and covenant history.',
    canons: {
      protestant: { accepted: true, order: 1, label: 'Canonical' },
      catholic: { accepted: true, order: 1, label: 'Canonical' },
      orthodox: { accepted: true, order: 1, label: 'Canonical' },
      ethiopian: { accepted: true, order: 1, label: 'Canonical' }
    }
  },
  {
    id: 'psa',
    slug: 'psalms',
    title: 'Psalms',
    testament: 'OT',
    category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '10th-5th Century BC',
    originNote: 'Hebrew hymnal composed by David, Asaph, Sons of Korah and others.',
    canons: {
      protestant: { accepted: true, order: 19, label: 'Canonical' },
      catholic: { accepted: true, order: 19, label: 'Canonical' },
      orthodox: { accepted: true, order: 19, label: 'Canonical' },
      ethiopian: { accepted: true, order: 19, label: 'Canonical' }
    }
  },
  
  // Deuterocanon / Apocrypha
  {
    id: 'tob',
    slug: 'tobit',
    title: 'Tobit',
    testament: 'Deuterocanon',
    category: CANON_CATEGORIES.DEUTEROCANON,
    originPeriod: '2nd Century BC',
    originNote: 'Preserved in Septuagint; relates exile story of righteous Tobit in Nineveh.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha (Non-canonical)' },
      catholic: { accepted: true, order: 15, label: 'Deuterocanon' },
      orthodox: { accepted: true, order: 15, label: 'Deuterocanon' },
      ethiopian: { accepted: true, order: 15, label: 'Deuterocanon' }
    }
  },
  {
    id: 'jud',
    slug: 'judith',
    title: 'Judith',
    testament: 'Deuterocanon',
    category: CANON_CATEGORIES.DEUTEROCANON,
    originPeriod: '2nd Century BC',
    originNote: 'Account of the heroic deliverance of Bethulia from Holofernes.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha (Non-canonical)' },
      catholic: { accepted: true, order: 16, label: 'Deuterocanon' },
      orthodox: { accepted: true, order: 16, label: 'Deuterocanon' },
      ethiopian: { accepted: true, order: 16, label: 'Deuterocanon' }
    }
  },
  {
    id: 'wis',
    slug: 'wisdom',
    title: 'Wisdom of Solomon',
    testament: 'Deuterocanon',
    category: CANON_CATEGORIES.DEUTEROCANON,
    originPeriod: '1st Century BC',
    originNote: 'Alexandrian Jewish wisdom poem praising Divine Wisdom and immortality.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha (Non-canonical)' },
      catholic: { accepted: true, order: 25, label: 'Deuterocanon' },
      orthodox: { accepted: true, order: 25, label: 'Deuterocanon' },
      ethiopian: { accepted: true, order: 25, label: 'Deuterocanon' }
    }
  },
  {
    id: 'sir',
    slug: 'sirach',
    title: 'Sirach (Ecclesiasticus)',
    testament: 'Deuterocanon',
    category: CANON_CATEGORIES.DEUTEROCANON,
    originPeriod: '180 BC',
    originNote: 'Ethical proverbs by Ben Sirach of Jerusalem, translated into Greek by his grandson.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha (Non-canonical)' },
      catholic: { accepted: true, order: 26, label: 'Deuterocanon' },
      orthodox: { accepted: true, order: 26, label: 'Deuterocanon' },
      ethiopian: { accepted: true, order: 26, label: 'Deuterocanon' }
    }
  },
  {
    id: 'mac1',
    slug: '1-maccabees',
    title: '1 Maccabees',
    testament: 'Deuterocanon',
    category: CANON_CATEGORIES.DEUTEROCANON,
    originPeriod: '100 BC',
    originNote: 'Historical chronicle of the Hasmonaean revolt against Antiochus IV Epiphanes.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Apocrypha (Non-canonical)' },
      catholic: { accepted: true, order: 45, label: 'Deuterocanon' },
      orthodox: { accepted: true, order: 45, label: 'Deuterocanon' },
      ethiopian: { accepted: true, order: 45, label: 'Deuterocanon' }
    }
  },

  // Pseudepigrapha
  {
    id: 'eno',
    slug: '1-enoch',
    title: '1 Enoch (Ethiopic Book of Enoch)',
    testament: 'Pseudepigrapha',
    category: CANON_CATEGORIES.PSEUDEPIGRAPHA,
    originPeriod: '3rd-1st Century BC',
    originNote: 'R.H. Charles translation. Canonical in Ethiopian Orthodox Tewahedo; directly quoted in Jude 1:14.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Pseudepigrapha' },
      catholic: { accepted: false, order: null, label: 'Pseudepigrapha' },
      orthodox: { accepted: false, order: null, label: 'Pseudepigrapha' },
      ethiopian: { accepted: true, order: 42, label: 'Canonical (Ethiopian)' }
    }
  },
  {
    id: 'jub',
    slug: 'jubilees',
    title: 'Book of Jubilees (Little Genesis)',
    testament: 'Pseudepigrapha',
    category: CANON_CATEGORIES.PSEUDEPIGRAPHA,
    originPeriod: '2nd Century BC',
    originNote: 'R.H. Charles translation. Sacred history arranged by 49-year Jubilee periods; canonical in Ethiopia.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Pseudepigrapha' },
      catholic: { accepted: false, order: null, label: 'Pseudepigrapha' },
      orthodox: { accepted: false, order: null, label: 'Pseudepigrapha' },
      ethiopian: { accepted: true, order: 43, label: 'Canonical (Ethiopian)' }
    }
  },

  // Early Church Writings
  {
    id: 'did',
    slug: 'didache',
    title: 'The Didache (Teaching of the Twelve Apostles)',
    testament: 'Early Church',
    category: CANON_CATEGORIES.EARLY_CHURCH_WRITING,
    originPeriod: '50-70 AD',
    originNote: 'First-century Christian manual covering moral instructions (The Two Ways), baptism, and Eucharist.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Early Church Fathers' },
      catholic: { accepted: false, order: null, label: 'Apostolic Fathers' },
      orthodox: { accepted: false, order: null, label: 'Apostolic Fathers' },
      ethiopian: { accepted: false, order: null, label: 'Apostolic Fathers' }
    }
  },
  {
    id: 'cle1',
    slug: '1-clement',
    title: '1 Clement',
    testament: 'Early Church',
    category: CANON_CATEGORIES.EARLY_CHURCH_WRITING,
    originPeriod: '96 AD',
    originNote: 'Epistle from Clement, Bishop of Rome, to the Church at Corinth regarding unity and order.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Early Church Fathers' },
      catholic: { accepted: false, order: null, label: 'Apostolic Fathers' },
      orthodox: { accepted: false, order: null, label: 'Apostolic Fathers' },
      ethiopian: { accepted: false, order: null, label: 'Apostolic Fathers' }
    }
  },
  {
    id: 'ign',
    slug: 'epistles-of-ignatius',
    title: 'Epistles of Ignatius of Antioch',
    testament: 'Early Church',
    category: CANON_CATEGORIES.EARLY_CHURCH_WRITING,
    originPeriod: '110 AD',
    originNote: 'Letters written en route to martyrdom in Rome, discussing church leadership, martyrdom, and Christology.',
    canons: {
      protestant: { accepted: false, order: null, label: 'Early Church Fathers' },
      catholic: { accepted: false, order: null, label: 'Apostolic Fathers' },
      orthodox: { accepted: false, order: null, label: 'Apostolic Fathers' },
      ethiopian: { accepted: false, order: null, label: 'Apostolic Fathers' }
    }
  },

  // New Testament (Sample)
  {
    id: 'joh',
    slug: 'john',
    title: 'John',
    testament: 'NT',
    category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '1st Century AD',
    originNote: 'Fourth Gospel emphasizing the divine Logos incarnate.',
    canons: {
      protestant: { accepted: true, order: 43, label: 'Canonical' },
      catholic: { accepted: true, order: 50, label: 'Canonical' },
      orthodox: { accepted: true, order: 50, label: 'Canonical' },
      ethiopian: { accepted: true, order: 55, label: 'Canonical' }
    }
  }
];

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
  });
}
