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

export const INITIAL_BOOKS = [
  {
    id: 'b1',
    slug: 'genesis',
    title: 'Genesis',
    category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '15th-13th Century BC',
    originNote: 'Attributed to Moses, traditional beginning of the Torah'
  },
  {
    id: 'b43',
    slug: 'john',
    title: 'John',
    category: CANON_CATEGORIES.CANONICAL,
    originPeriod: '1st Century AD',
    originNote: 'Gospel according to John the Apostle'
  },
  {
    id: 'b67',
    slug: 'tobit',
    title: 'Tobit',
    category: CANON_CATEGORIES.DEUTEROCANON,
    originPeriod: '2nd Century BC',
    originNote: 'Accepted in Catholic and Orthodox traditions'
  },
  {
    id: 'b68',
    slug: 'enoch',
    title: '1 Enoch',
    category: CANON_CATEGORIES.PSEUDEPIGRAPHA,
    originPeriod: '3rd-1st Century BC',
    originNote: 'Accepted in Ethiopian Orthodox canon, quoted in Jude'
  }
];
