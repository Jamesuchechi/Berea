-- Migration: Beyond-Canon Content Attribution & Tradition Lens Mapping
-- Migration ID: 20260803000008

-- 1. Add attribution column to translation table
ALTER TABLE translation ADD COLUMN IF NOT EXISTS attribution TEXT;

-- 2. Populate Beyond-Canon Book Metadata
INSERT INTO book (slug, title, category, origin_period, origin_note)
VALUES
  ('tobit', 'Tobit', 'deuterocanon', 'c. 200–175 BCE', 'Part of LXX Deuterocanon; discovered in Hebrew/Aramaic at Qumran Cave 4.'),
  ('judith', 'Judith', 'deuterocanon', 'c. 150–100 BCE', 'Hellenistic Jewish historical novella preserved in the Septuagint.'),
  ('wisdom_of_solomon', 'Wisdom of Solomon', 'deuterocanon', 'c. 50 BCE–30 CE', 'Alexandrian Jewish wisdom text deeply influential in early Pauline Christology.'),
  ('sirach', 'Sirach (Ecclesiasticus)', 'deuterocanon', 'c. 196–175 BCE', 'Wisdom text composed in Hebrew by Ben Sira, translated to Greek by his grandson.'),
  ('baruch', 'Baruch', 'deuterocanon', 'c. 200–100 BCE', 'Prophetic text associated with Jeremiah’s scribe Baruch son of Neriah.'),
  ('1_maccabees', '1 Maccabees', 'deuterocanon', 'c. 100 BCE', 'Historical record of the Hasmonean revolt and Hanukkah origins.'),
  ('2_maccabees', '2 Maccabees', 'deuterocanon', 'c. 124 BCE', 'Theological history emphasizing bodily resurrection and prayer for the dead.'),
  ('1_enoch', '1 Enoch', 'pseudepigrapha', 'c. 300 BCE–100 CE', 'Ancient apocalyptic text quoted directly in Jude 1:14-15; fully preserved in Ge’ez (Ethiopic).'),
  ('jubilees', 'Jubilees', 'pseudepigrapha', 'c. 160–150 BCE', 'Solar-calendar expansion of Genesis–Exodus discovered among Dead Sea Scrolls.'),
  ('didache', 'Didache (Teaching of the Twelve)', 'early_church_writing', 'c. 50–100 CE', 'Earliest non-canonical Christian manual on baptism, Eucharist, and church order.'),
  ('1_clement', '1 Clement', 'early_church_writing', 'c. 96 CE', 'Epistle from the Church of Rome to Corinth; included in Codex Alexandrinus.'),
  ('shepherd_of_hermas', 'Shepherd of Hermas', 'early_church_writing', 'c. 100–140 CE', 'Early Christian vision text highly regarded by Irenaeus and Clement of Alexandria.')
ON CONFLICT (slug) DO UPDATE SET
  origin_period = EXCLUDED.origin_period,
  origin_note = EXCLUDED.origin_note;

-- 3. Populate Canon Membership Status Mapping across Traditions
-- Tobit: Catholic=true, Orthodox=true, Ethiopian=true, Protestant=false
INSERT INTO canon_membership (book_id, tradition, accepted_as_scripture, canonical_order)
SELECT id, 'catholic'::tradition_type, true, 17 FROM book WHERE slug = 'tobit'
ON CONFLICT (book_id, tradition) DO NOTHING;

INSERT INTO canon_membership (book_id, tradition, accepted_as_scripture, canonical_order)
SELECT id, 'orthodox'::tradition_type, true, 17 FROM book WHERE slug = 'tobit'
ON CONFLICT (book_id, tradition) DO NOTHING;

INSERT INTO canon_membership (book_id, tradition, accepted_as_scripture, canonical_order)
SELECT id, 'ethiopian'::tradition_type, true, 17 FROM book WHERE slug = 'tobit'
ON CONFLICT (book_id, tradition) DO NOTHING;

INSERT INTO canon_membership (book_id, tradition, accepted_as_scripture, canonical_order)
SELECT id, 'protestant'::tradition_type, false, NULL FROM book WHERE slug = 'tobit'
ON CONFLICT (book_id, tradition) DO NOTHING;

-- 1 Enoch: Ethiopian=true (Tewahedo Canon), Protestant=false, Catholic=false, Orthodox=false
INSERT INTO canon_membership (book_id, tradition, accepted_as_scripture, canonical_order)
SELECT id, 'ethiopian'::tradition_type, true, 26 FROM book WHERE slug = '1_enoch'
ON CONFLICT (book_id, tradition) DO NOTHING;

INSERT INTO canon_membership (book_id, tradition, accepted_as_scripture, canonical_order)
SELECT id, 'protestant'::tradition_type, false, NULL FROM book WHERE slug = '1_enoch'
ON CONFLICT (book_id, tradition) DO NOTHING;

INSERT INTO canon_membership (book_id, tradition, accepted_as_scripture, canonical_order)
SELECT id, 'catholic'::tradition_type, false, NULL FROM book WHERE slug = '1_enoch'
ON CONFLICT (book_id, tradition) DO NOTHING;

INSERT INTO canon_membership (book_id, tradition, accepted_as_scripture, canonical_order)
SELECT id, 'orthodox'::tradition_type, false, NULL FROM book WHERE slug = '1_enoch'
ON CONFLICT (book_id, tradition) DO NOTHING;
