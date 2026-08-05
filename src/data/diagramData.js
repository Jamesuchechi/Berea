/**
 * Structured Graph Datasets for Diagrams, Timelines, Maps, and Cross-Reference Network
 */

export const GENEALOGY_DATA = {
  id: 'davidic_lineage',
  title: 'Patriarchal & Davidic Lineage Tree',
  nodes: [
    { id: 'abraham', name: 'Abraham', era: 'Patriarchal', bio: 'Father of the faithful; covenant established in Genesis 15.' },
    { id: 'isaac', name: 'Isaac', parentId: 'abraham', era: 'Patriarchal', bio: 'Son of promise born to Sarah.' },
    { id: 'jacob', name: 'Jacob (Israel)', parentId: 'isaac', era: 'Patriarchal', bio: 'Wrestled with God; father of the 12 Tribes.' },
    { id: 'judah', name: 'Judah', parentId: 'jacob', era: 'Patriarchal', bio: 'Ancestor of the royal Davidic tribe.' },
    { id: 'boaz', name: 'Boaz', parentId: 'judah', era: 'Judges', bio: 'Kinsman redeemer who married Ruth the Moabitess.' },
    { id: 'jesse', name: 'Jesse', parentId: 'boaz', era: 'Kingdom', bio: 'Father of King David (Isaiah 11:1 root of Jesse).' },
    { id: 'david', name: 'King David', parentId: 'jesse', era: 'Kingdom', bio: 'Anointed King of Israel; recipient of Davidic Covenant (2 Samuel 7).' },
    { id: 'solomon', name: 'King Solomon', parentId: 'david', era: 'Kingdom', bio: 'Builder of the First Temple; author of Proverbs and Ecclesiastes.' },
    { id: 'zerubbabel', name: 'Zerubbabel', parentId: 'solomon', era: 'Post-Exile', bio: 'Leader of returning Jewish exiles who rebuilt the Second Temple.' },
    { id: 'jesus', name: 'Jesus Christ', parentId: 'zerubbabel', era: 'New Covenant', bio: 'Son of David, Messiah, and Savior of the world (Matthew 1:1).' },
  ],
};

export const TIMELINE_DATA = [
  { id: 't1', year: -2000, label: '2000 BCE', title: 'Age of the Patriarchs', era: 'Patriarchal', summary: 'Covenant established with Abraham, Isaac, and Jacob.' },
  { id: 't2', year: -1446, label: '1446 BCE', title: 'Exodus & Sinai Covenant', era: 'Moses', summary: 'Moses leads Israel out of Egypt; reception of the Torah at Sinai.' },
  { id: 't3', year: -1000, label: '1000 BCE', title: 'Davidic Kingdom & Temple', era: 'Kingdom', summary: 'King David unites Israel; Solomon builds the First Temple in Jerusalem.' },
  { id: 't4', year: -586, label: '586 BCE', title: 'Babylonian Exile & Destruction', era: 'Exile', summary: 'Nebuchadnezzar destroys Jerusalem Temple; Tobit and Daniel in exile.' },
  { id: 't5', year: -167, label: '167 BCE', title: 'Hasmonean Revolt & Maccabees', era: 'Deuterocanonical', summary: 'Judas Maccabeus rededicates Second Temple (recorded in 1–2 Maccabees).' },
  { id: 't6', year: 30, label: '30 CE', title: 'Crucifixion & Resurrection', era: 'Apostolic', summary: 'Death, Burial, and Resurrection of Jesus; Birth of the Church at Pentecost.' },
  { id: 't7', year: 96, label: '96 CE', title: 'Apostolic Fathers Era', era: 'Early Church', summary: 'Clement of Rome writes 1 Clement; Didache compiled.' },
];

export const MAP_LOCATIONS_DATA = {
  title: 'Ancient Near East & Mediterranean Sacred Sites',
  locations: [
    { id: 'loc_jerusalem', name: 'Jerusalem', lat: 31.7683, lng: 35.2137, era: 'Kingdom / Second Temple', details: 'Site of Solomon’s Temple, Golgotha, and early Church council.' },
    { id: 'loc_nineveh', name: 'Nineveh', lat: 36.36, lng: 43.15, era: 'Assyrian Exile', details: 'Capital of Assyria where Tobit lived and Jonah preached.' },
    { id: 'loc_ecbatana', name: 'Ecbatana', lat: 34.7983, lng: 48.5147, era: 'Persian Exile', details: 'Destination of Tobias and Raphael in the Book of Tobit.' },
    { id: 'loc_antioch', name: 'Antioch', lat: 36.2021, lng: 36.1604, era: 'Apostolic', details: 'Where disciples were first called Christians (Acts 11:26).' },
    { id: 'loc_rome', name: 'Rome', lat: 41.9028, lng: 12.4964, era: 'Apostolic', details: 'Destination of Paul’s final journey; martyrdom of Peter and Paul.' },
    { id: 'loc_alexandria', name: 'Alexandria', lat: 31.2001, lng: 29.9187, era: 'Hellenistic', details: 'Center of LXX Septuagint translation & Wisdom of Solomon.' },
  ],
  routes: [
    {
      id: 'route_tobit',
      name: 'Tobit & Raphael’s Journey (Nineveh to Ecbatana)',
      color: '#f59e0b',
      path: [
        { name: 'Nineveh', lat: 36.36, lng: 43.15 },
        { name: 'Rages', lat: 35.58, lng: 51.44 },
        { name: 'Ecbatana', lat: 34.7983, lng: 48.5147 },
      ],
    },
    {
      id: 'route_paul_3',
      name: 'Paul’s 3rd Missionary Journey',
      color: '#10b981',
      path: [
        { name: 'Antioch', lat: 36.2021, lng: 36.1604 },
        { name: 'Ephesus', lat: 37.9486, lng: 27.368 },
        { name: 'Corinth', lat: 37.9062, lng: 22.8791 },
        { name: 'Jerusalem', lat: 31.7683, lng: 35.2137 },
      ],
    },
  ],
};

export const CROSS_REF_NETWORK_DATA = {
  title: 'Treasury of Scripture Knowledge Cross-Reference Graph',
  nodes: [
    { id: 'john_3_16', label: 'John 3:16', group: 'canon', text: 'For God so loved the world...' },
    { id: 'num_21_9', label: 'Numbers 21:9', group: 'canon', text: 'Moses made a bronze serpent...' },
    { id: 'wis_16_6', label: 'Wisdom 16:6', group: 'deuterocanon', text: 'They had a token of salvation...' },
    { id: 'rom_5_8', label: 'Romans 5:8', group: 'canon', text: 'God shows his love for us...' },
    { id: 'clement_12', label: '1 Clement 12', group: 'early_church', text: 'By faith Rahab was saved...' },
  ],
  links: [
    { source: 'john_3_16', target: 'num_21_9', relationship: 'Typological Prophecy' },
    { source: 'john_3_16', target: 'wis_16_6', relationship: 'Deuterocanonical Parallel' },
    { source: 'john_3_16', target: 'rom_5_8', relationship: 'New Testament Fulfillment' },
    { source: 'john_3_16', target: 'clement_12', relationship: 'Patristic Allusion' },
  ],
};
