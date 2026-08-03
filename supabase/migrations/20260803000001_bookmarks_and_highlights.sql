-- Migration: Bookmarks & Highlights with RLS
-- Migration ID: 20260803000001

-- 1. Bookmark Table
CREATE TABLE IF NOT EXISTS bookmark (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_slug TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_slug, chapter, verse_number)
);

-- 2. Highlight Table (separated from notes)
CREATE TABLE IF NOT EXISTS highlight (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_slug TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  color TEXT NOT NULL DEFAULT 'amber',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, book_slug, chapter, verse_number)
);

-- Indexes for fast querying per user
CREATE INDEX IF NOT EXISTS idx_bookmark_user ON bookmark(user_id, book_slug, chapter);
CREATE INDEX IF NOT EXISTS idx_highlight_user ON highlight(user_id, book_slug, chapter);

-- Enable RLS
ALTER TABLE bookmark ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlight ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Bookmark
CREATE POLICY "Users can view own bookmarks" ON bookmark FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON bookmark FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookmarks" ON bookmark FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmark FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Highlight
CREATE POLICY "Users can view own highlights" ON highlight FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own highlights" ON highlight FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own highlights" ON highlight FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own highlights" ON highlight FOR DELETE USING (auth.uid() = user_id);
