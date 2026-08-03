-- Migration: Memorization & Spaced Repetition (SuperMemo SM-2) with RLS
-- Migration ID: 20260803000004

-- 1. Memorization Item Table
CREATE TABLE IF NOT EXISTS memorization_item (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_slug TEXT NOT NULL,
  chapter INTEGER NOT NULL,
  verse_start INTEGER NOT NULL,
  verse_end INTEGER NOT NULL,
  text_snapshot TEXT NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Memorization Review Log Table (SM-2 Spaced Repetition Data)
CREATE TABLE IF NOT EXISTS memorization_review (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id UUID NOT NULL REFERENCES memorization_item(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ease_rating INTEGER NOT NULL CHECK (ease_rating >= 1 AND ease_rating <= 5), -- 1=Again, 3=Good, 5=Easy
  interval_days INTEGER NOT NULL DEFAULT 1,
  repetition_count INTEGER NOT NULL DEFAULT 0,
  next_review_at TIMESTAMPTZ NOT NULL DEFAULT now() + INTERVAL '1 day'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_memorization_user ON memorization_item(user_id);
CREATE INDEX IF NOT EXISTS idx_memorization_next_review ON memorization_review(user_id, next_review_at);

-- Enable RLS
ALTER TABLE memorization_item ENABLE ROW LEVEL SECURITY;
ALTER TABLE memorization_review ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Memorization Item
CREATE POLICY "Users can view own memorization items" ON memorization_item FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own memorization items" ON memorization_item FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own memorization items" ON memorization_item FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own memorization items" ON memorization_item FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Memorization Review Log
CREATE POLICY "Users can view own reviews" ON memorization_review FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own reviews" ON memorization_review FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON memorization_review FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON memorization_review FOR DELETE USING (auth.uid() = user_id);
