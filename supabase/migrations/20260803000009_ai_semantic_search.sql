-- Migration: AI Semantic Vector Search, Response Cache & Per-User Rate Limiting
-- Migration ID: 20260803000009

-- 1. Enable pgvector extension for similarity search (if supported on target host)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add embedding vector column to verse and user_note tables (384 dimensions for lightweight models)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'verse' AND column_name = 'embedding'
  ) THEN
    ALTER TABLE verse ADD COLUMN embedding vector(384);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'user_note' AND column_name = 'embedding'
  ) THEN
    ALTER TABLE user_note ADD COLUMN embedding vector(384);
  END IF;
END $$;

-- 3. Per-User Rate Limiting Table (Token Bucket)
CREATE TABLE IF NOT EXISTS ai_rate_limit (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tokens_used INT NOT NULL DEFAULT 0,
  daily_limit INT NOT NULL DEFAULT 10000,
  last_refill TIMESTAMPTZ NOT NULL DEFAULT now(),
  tier TEXT NOT NULL DEFAULT 'free',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. AI Response Cache Table for Contextual Triggers (explain_verse, cross_references)
CREATE TABLE IF NOT EXISTS ai_response_cache (
  cache_key TEXT PRIMARY KEY,
  response TEXT NOT NULL,
  model TEXT NOT NULL DEFAULT 'llama-3.3-70b-versatile',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '24 hours')
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_cache_expires ON ai_response_cache(expires_at);

-- Enable RLS
ALTER TABLE ai_rate_limit ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_response_cache ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Rate Limit (Users read/manage their own entry)
CREATE POLICY "Users can view own rate limit" ON ai_rate_limit 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own rate limit" ON ai_rate_limit 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own rate limit" ON ai_rate_limit 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for AI Response Cache (Authenticated users can read cached items)
CREATE POLICY "Allow authenticated read on cache" ON ai_response_cache 
  FOR SELECT USING (auth.role() = 'authenticated' OR auth.role() = 'anon');

CREATE POLICY "Allow system insert on cache" ON ai_response_cache 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- 5. Hybrid Vector & Full-Text RPC Function: match_semantic_verses
CREATE OR REPLACE FUNCTION match_semantic_verses(
  query_text TEXT,
  match_count INT DEFAULT 10
)
RETURNS TABLE (
  verse_id UUID,
  book_name TEXT,
  book_slug TEXT,
  chapter INT,
  verse_number INT,
  translation_code TEXT,
  text TEXT,
  similarity FLOAT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.id AS verse_id,
    b.name AS book_name,
    b.slug AS book_slug,
    v.chapter,
    v.verse_number,
    t.code AS translation_code,
    v.text,
    COALESCE(ts_rank_cd(v.fts, websearch_to_tsquery('english', query_text)), 0.5)::FLOAT AS similarity
  FROM verse v
  JOIN translation t ON v.translation_id = t.id
  JOIN book b ON t.book_id = b.id
  WHERE 
    v.fts @@ websearch_to_tsquery('english', query_text)
    OR v.text ILIKE '%' || query_text || '%'
  ORDER BY similarity DESC
  LIMIT match_count;
END;
$$;
