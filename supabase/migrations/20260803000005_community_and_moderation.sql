-- Migration: Community Prayers & Moderation Queue with RLS
-- Migration ID: 20260803000005

CREATE TYPE prayer_status AS ENUM ('active', 'answered', 'archived');
CREATE TYPE flag_status AS ENUM ('pending', 'reviewed', 'dismissed', 'actioned');

-- 1. Prayer Request Table
CREATE TABLE IF NOT EXISTS prayer_request (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- nullable if truly guest/anonymous
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  category TEXT NOT NULL DEFAULT 'general',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  status prayer_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Prayer Comment Table
CREATE TABLE IF NOT EXISTS prayer_comment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES prayer_request(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Prayer "Prayed For" Counter Log Table (Taps)
CREATE TABLE IF NOT EXISTS prayer_prayed_for (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES prayer_request(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(request_id, user_id)
);

-- 4. Community Flag / Moderation Table (built BEFORE UI needs it)
CREATE TABLE IF NOT EXISTS community_flag (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- 'prayer_request' | 'prayer_comment'
  content_id UUID NOT NULL,
  reason TEXT NOT NULL,
  status flag_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_prayer_status ON prayer_request(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prayer_comment_request ON prayer_comment(request_id);
CREATE INDEX IF NOT EXISTS idx_prayer_prayed_for_req ON prayer_prayed_for(request_id);

-- Enable RLS
ALTER TABLE prayer_request ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_comment ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayer_prayed_for ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_flag ENABLE ROW LEVEL SECURITY;

-- RLS Policies for Prayer Request
CREATE POLICY "Allow public read access to active prayer requests" ON prayer_request FOR SELECT USING (status != 'archived');
CREATE POLICY "Authenticated users can create prayer requests" ON prayer_request FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authors can update own prayer requests" ON prayer_request FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Authors can delete own prayer requests" ON prayer_request FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Prayer Comments
CREATE POLICY "Allow public read access to prayer comments" ON prayer_comment FOR SELECT USING (true);
CREATE POLICY "Authenticated users can comment" ON prayer_comment FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Authors can delete own comments" ON prayer_comment FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Prayed For Taps
CREATE POLICY "Allow public read access to prayed for counts" ON prayer_prayed_for FOR SELECT USING (true);
CREATE POLICY "Authenticated users can tap prayed for" ON prayer_prayed_for FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own prayed for tap" ON prayer_prayed_for FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Community Flag
CREATE POLICY "Reporters can view own flags" ON community_flag FOR SELECT USING (auth.uid() = reporter_id);
CREATE POLICY "Authenticated users can submit flags" ON community_flag FOR INSERT WITH CHECK (auth.uid() = reporter_id);
