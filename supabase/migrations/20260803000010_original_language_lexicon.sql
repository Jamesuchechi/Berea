-- Migration: Original Language Lexicon & Data-Driven Interlinear Tables
-- Migration ID: 20260803000010

-- 1. Lexicon Table (Strong's Concordance Dictionary Entries)
CREATE TABLE IF NOT EXISTS lexicon (
  strongs_id TEXT PRIMARY KEY, -- e.g. 'G3779', 'H7225'
  language TEXT NOT NULL CHECK (language IN ('greek', 'hebrew')),
  lemma TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  pronunciation TEXT,
  part_of_speech TEXT NOT NULL,
  definition TEXT NOT NULL,
  short_definition TEXT,
  derivation TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Interlinear Word Breakdown Table
CREATE TABLE IF NOT EXISTS interlinear_word (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_slug TEXT NOT NULL,
  chapter INT NOT NULL,
  verse_number INT NOT NULL,
  word_order INT NOT NULL,
  original_text TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  strongs_id TEXT REFERENCES lexicon(strongs_id) ON DELETE SET NULL,
  part_of_speech TEXT,
  gloss TEXT NOT NULL, -- English translation/gloss
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_interlinear_passage ON interlinear_word(book_slug, chapter, verse_number, word_order);
CREATE INDEX IF NOT EXISTS idx_interlinear_strongs ON interlinear_word(strongs_id);
CREATE INDEX IF NOT EXISTS idx_lexicon_language ON lexicon(language);

-- Enable RLS
ALTER TABLE lexicon ENABLE ROW LEVEL SECURITY;
ALTER TABLE interlinear_word ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Public read access)
CREATE POLICY "Allow public read on lexicon" ON lexicon 
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on interlinear_word" ON interlinear_word 
  FOR SELECT USING (true);
