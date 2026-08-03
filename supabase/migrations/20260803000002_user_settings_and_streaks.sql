-- Migration: User Settings & Reading Streaks with RLS
-- Migration ID: 20260803000002

-- 1. User Settings Table
CREATE TABLE IF NOT EXISTS user_settings (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tradition TEXT NOT NULL DEFAULT 'protestant',
  theme TEXT NOT NULL DEFAULT 'light',
  font_size TEXT NOT NULL DEFAULT 'medium',
  font_family TEXT NOT NULL DEFAULT 'Inter',
  tts_rate NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
  notification_prefs JSONB NOT NULL DEFAULT '{"daily_reminder": true, "reminder_time": "08:00"}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Reading Streak Table
CREATE TABLE IF NOT EXISTS reading_streak (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_streak ENABLE ROW LEVEL SECURITY;

-- RLS Policies for User Settings
CREATE POLICY "Users can view own settings" ON user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own settings" ON user_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own settings" ON user_settings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own settings" ON user_settings FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for Reading Streak
CREATE POLICY "Users can view own streak" ON reading_streak FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own streak" ON reading_streak FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streak" ON reading_streak FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own streak" ON reading_streak FOR DELETE USING (auth.uid() = user_id);

-- Function & Trigger to automatically create default settings for new users
CREATE OR REPLACE FUNCTION public.handle_new_user_settings()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_settings (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.reading_streak (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created_settings ON auth.users;
CREATE TRIGGER on_auth_user_created_settings
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_settings();
