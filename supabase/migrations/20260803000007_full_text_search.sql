-- Migration: Full-Text Search (FTS), Trigram Indexing & Ranked Search RPC
-- Migration ID: 20260803000007

-- 1. Enable pg_trgm extension for fuzzy/typo-tolerant matching
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Add tsvector generated columns & GIN Indexes to verse table
ALTER TABLE verse ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(text, ''))) STORED;

CREATE INDEX IF NOT EXISTS idx_verse_fts ON verse USING GIN(fts);
CREATE INDEX IF NOT EXISTS idx_verse_text_trgm ON verse USING GIN(text gin_trgm_ops);

-- 3. Add tsvector generated column & GIN Index to user_note table
ALTER TABLE user_note ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (to_tsvector('english', coalesce(content, ''))) STORED;

CREATE INDEX IF NOT EXISTS idx_user_note_fts ON user_note USING GIN(fts);

-- 4. Server-Side Ranked Search RPC Function
CREATE OR REPLACE FUNCTION search_berea_scripture(
  query_text TEXT,
  limit_count INT DEFAULT 50
)
RETURNS TABLE (
  id UUID,
  type TEXT,
  book_title TEXT,
  book_slug TEXT,
  chapter INT,
  verse_number INT,
  text TEXT,
  rank REAL
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF query_text IS NULL OR trim(query_text) = '' THEN
    RETURN;
  END IF;

  RETURN QUERY
  SELECT
    v.id,
    CASE 
      WHEN b.category = 'canonical' THEN 'canon'
      WHEN b.category = 'deuterocanon' THEN 'deuterocanon'
      WHEN b.category = 'pseudepigrapha' THEN 'pseudepigrapha'
      ELSE 'early_church'
    END AS type,
    b.title AS book_title,
    b.slug AS book_slug,
    v.chapter,
    v.verse_number,
    v.text,
    ts_rank_cd(v.fts, websearch_to_tsquery('english', query_text)) AS rank
  FROM verse v
  JOIN translation t ON t.id = v.translation_id
  JOIN book b ON b.id = t.book_id
  WHERE v.fts @@ websearch_to_tsquery('english', query_text)
     OR v.text ILIKE '%' || query_text || '%'
  ORDER BY rank DESC, b.title, v.chapter, v.verse_number
  LIMIT limit_count;
END;
$$;
