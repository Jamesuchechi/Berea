-- Migration: Reading Plans & Progress with RLS
-- Migration ID: 20260803000003

CREATE TYPE plan_kind AS ENUM ('fixed', 'ai_generated', 'group');

-- 1. Reading Plan Table
CREATE TABLE IF NOT EXISTS reading_plan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  kind plan_kind NOT NULL DEFAULT 'fixed',
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Reading Plan Day Table
CREATE TABLE IF NOT EXISTS reading_plan_day (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES reading_plan(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  reading_refs JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of {book: "John", chapter: 1, verses: "1-18"}
  UNIQUE(plan_id, day_number)
);

-- 3. User Plan Progress Table
CREATE TABLE IF NOT EXISTS user_plan_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES reading_plan(id) ON DELETE CASCADE,
  current_day INTEGER NOT NULL DEFAULT 1,
  completed_days JSONB NOT NULL DEFAULT '[]'::jsonb,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_completed_at TIMESTAMPTZ,
  streak_count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, plan_id)
);

-- 4. Group Plan Member Table
CREATE TABLE IF NOT EXISTS group_plan_member (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES reading_plan(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(plan_id, user_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_plan_slug ON reading_plan(slug);
CREATE INDEX IF NOT EXISTS idx_plan_day_number ON reading_plan_day(plan_id, day_number);
CREATE INDEX IF NOT EXISTS idx_user_plan_progress ON user_plan_progress(user_id);

-- Enable RLS
ALTER TABLE reading_plan ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_plan_day ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_plan_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_plan_member ENABLE ROW LEVEL SECURITY;

-- RLS for reading_plan & reading_plan_day (Public read access for public plans, author access for custom/group plans)
CREATE POLICY "Allow public read access to public reading plans" ON reading_plan FOR SELECT USING (is_public OR auth.uid() = created_by);
CREATE POLICY "Authors can insert own reading plans" ON reading_plan FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Authors can update own reading plans" ON reading_plan FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Authors can delete own reading plans" ON reading_plan FOR DELETE USING (auth.uid() = created_by);

CREATE POLICY "Allow public read access to plan days" ON reading_plan_day FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM reading_plan p WHERE p.id = reading_plan_day.plan_id AND (p.is_public OR p.created_by = auth.uid())
  )
);
CREATE POLICY "Authors can manage plan days" ON reading_plan_day FOR ALL USING (
  EXISTS (
    SELECT 1 FROM reading_plan p WHERE p.id = reading_plan_day.plan_id AND p.created_by = auth.uid()
  )
);

-- RLS for user_plan_progress (Strictly user-scoped)
CREATE POLICY "Users can view own plan progress" ON user_plan_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own plan progress" ON user_plan_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own plan progress" ON user_plan_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own plan progress" ON user_plan_progress FOR DELETE USING (auth.uid() = user_id);

-- RLS for group_plan_member
CREATE POLICY "Members can view group members" ON group_plan_member FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM group_plan_member gpm WHERE gpm.plan_id = group_plan_member.plan_id AND gpm.user_id = auth.uid()
  )
);
CREATE POLICY "Users can join group plans" ON group_plan_member FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave group plans" ON group_plan_member FOR DELETE USING (auth.uid() = user_id);
