-- Migration: SM-2 Spaced Repetition, Reading Plan Catch-Up & Note Tags/Exports
-- Migration ID: 20260803000012

-- 1. Expand memorization_item with SM-2 Spaced Repetition Parameters
ALTER TABLE memorization_item ADD COLUMN IF NOT EXISTS ease_factor REAL NOT NULL DEFAULT 2.5;
ALTER TABLE memorization_item ADD COLUMN IF NOT EXISTS interval_days INT NOT NULL DEFAULT 1;
ALTER TABLE memorization_item ADD COLUMN IF NOT EXISTS repetitions INT NOT NULL DEFAULT 0;
ALTER TABLE memorization_item ADD COLUMN IF NOT EXISTS next_review_at TIMESTAMPTZ NOT NULL DEFAULT now();

CREATE INDEX IF NOT EXISTS idx_memorization_due ON memorization_item(user_id, next_review_at);

-- 2. Expand user_note with Tags & Linked Verse References
ALTER TABLE user_note ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE user_note ADD COLUMN IF NOT EXISTS linked_references JSONB DEFAULT '[]'::jsonb;

-- 3. Reading Plan Notification Reminders Table
CREATE TABLE IF NOT EXISTS reading_plan_reminder (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES reading_plan(id) ON DELETE CASCADE,
  reminder_time TIME NOT NULL DEFAULT '08:00:00',
  is_enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE reading_plan_reminder ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users manage own reading reminders" ON reading_plan_reminder;
CREATE POLICY "Users manage own reading reminders" ON reading_plan_reminder
  FOR ALL USING (auth.uid() = user_id);
