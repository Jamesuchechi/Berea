-- Migration: Phase 8 Streaks & Web Push Notification Infrastructure
-- Migration ID: 20260803000013

-- Add dyslexic_font column to user_settings if not existing
ALTER TABLE public.user_settings ADD COLUMN IF NOT EXISTS dyslexic_font BOOLEAN NOT NULL DEFAULT false;

-- 1. Web Push Subscriptions Table
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  reminder_time TIME NOT NULL DEFAULT '07:00:00',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own push subscriptions" ON public.push_subscriptions FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can insert own push subscriptions" ON public.push_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can update own push subscriptions" ON public.push_subscriptions FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Users can delete own push subscriptions" ON public.push_subscriptions FOR DELETE USING (auth.uid() = user_id OR user_id IS NULL);

-- 2. Timezone-Aware Reading Streak Recorder Function
CREATE OR REPLACE FUNCTION public.record_daily_reading_activity(p_user_id UUID, p_user_tz TEXT DEFAULT 'UTC')
RETURNS JSONB AS $$
DECLARE
  v_today DATE;
  v_last_active DATE;
  v_current_streak INT;
  v_longest_streak INT;
  v_result JSONB;
BEGIN
  -- Calculate today's date in user's timezone
  BEGIN
    v_today := (now() AT TIME ZONE p_user_tz)::DATE;
  EXCEPTION WHEN OTHERS THEN
    v_today := CURRENT_DATE;
  END;

  -- Fetch existing streak record
  SELECT current_streak, longest_streak, last_active_date
  INTO v_current_streak, v_longest_streak, v_last_active
  FROM public.reading_streak
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO public.reading_streak (user_id, current_streak, longest_streak, last_active_date, timezone)
    VALUES (p_user_id, 1, 1, v_today, p_user_tz);

    RETURN jsonb_build_object(
      'currentStreak', 1,
      'longestStreak', 1,
      'lastActiveDate', v_today,
      'incremented', true
    );
  END IF;

  -- Already recorded today
  IF v_last_active = v_today THEN
    RETURN jsonb_build_object(
      'currentStreak', v_current_streak,
      'longestStreak', v_longest_streak,
      'lastActiveDate', v_last_active,
      'incremented', false
    );
  END IF;

  -- Consecutive day (yesterday)
  IF v_last_active = (v_today - INTERVAL '1 day')::DATE THEN
    v_current_streak := v_current_streak + 1;
    IF v_current_streak > v_longest_streak THEN
      v_longest_streak := v_current_streak;
    END IF;
  ELSE
    -- Missed one or more days, reset streak to 1
    v_current_streak := 1;
  END IF;

  UPDATE public.reading_streak
  SET current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_active_date = v_today,
      timezone = p_user_tz,
      updated_at = now()
  WHERE user_id = p_user_id;

  RETURN jsonb_build_object(
    'currentStreak', v_current_streak,
    'longestStreak', v_longest_streak,
    'lastActiveDate', v_today,
    'incremented', true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
