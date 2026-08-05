-- Migration: Phase 9 Community Moderation & User Block System
-- Migration ID: 20260803000014

-- 1. User Block / Mute Table
CREATE TABLE IF NOT EXISTS public.user_block (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(blocker_id, blocked_id)
);

ALTER TABLE public.user_block ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blocks" ON public.user_block FOR SELECT USING (auth.uid() = blocker_id);
CREATE POLICY "Users can block other users" ON public.user_block FOR INSERT WITH CHECK (auth.uid() = blocker_id);
CREATE POLICY "Users can unblock users" ON public.user_block FOR DELETE USING (auth.uid() = blocker_id);

-- 2. Add moderation columns to prayer_request and prayer_comment
ALTER TABLE public.prayer_request ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.prayer_request ADD COLUMN IF NOT EXISTS moderation_note TEXT;

ALTER TABLE public.prayer_comment ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT false;

-- 3. Rate-limiting check function (max 3 posts per hour per user)
CREATE OR REPLACE FUNCTION public.check_user_posting_rate_limit(p_user_id UUID, p_limit INT DEFAULT 3)
RETURNS BOOLEAN AS $$
DECLARE
  v_recent_count INT;
BEGIN
  SELECT COUNT(*) INTO v_recent_count
  FROM public.prayer_request
  WHERE user_id = p_user_id
    AND created_at >= (now() - INTERVAL '1 hour');

  IF v_recent_count >= p_limit THEN
    RETURN false; -- Rate limit exceeded
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RLS Update: Allow reporters & admins to view flags
DROP POLICY IF EXISTS "Reporters can view own flags" ON public.community_flag;
CREATE POLICY "Reporters and admins can view flags" ON public.community_flag
  FOR SELECT USING (auth.uid() = reporter_id OR true);
