-- Migration: AI History & Data-Driven Diagram Definitions with RLS
-- Migration ID: 20260803000006

CREATE TYPE diagram_type AS ENUM ('lineage', 'timeline', 'map', 'network');

-- 1. AI Conversation Table
CREATE TABLE IF NOT EXISTS ai_conversation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Study Session',
  context_book TEXT,
  context_chapter INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. AI Message Table
CREATE TABLE IF NOT EXISTS ai_message (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES ai_conversation(id) ON DELETE CASCADE,
  sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Diagram Definition Table (data-driven rows, not hardcoded React arrays)
CREATE TABLE IF NOT EXISTS diagram_definition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  type diagram_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL, -- Structured node/edge/timeline graph payload
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ai_conversation_user ON ai_conversation(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_message_conv ON ai_message(conversation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_diagram_type ON diagram_definition(type);

-- Enable RLS
ALTER TABLE ai_conversation ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_message ENABLE ROW LEVEL SECURITY;
ALTER TABLE diagram_definition ENABLE ROW LEVEL SECURITY;

-- RLS Policies for AI Conversations & Messages (Strict user ownership)
CREATE POLICY "Users can view own conversations" ON ai_conversation FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own conversations" ON ai_conversation FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own conversations" ON ai_conversation FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own conversations" ON ai_conversation FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view messages in own conversations" ON ai_message FOR SELECT USING (
  EXISTS (SELECT 1 FROM ai_conversation c WHERE c.id = ai_message.conversation_id AND c.user_id = auth.uid())
);
CREATE POLICY "Users can insert messages into own conversations" ON ai_message FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM ai_conversation c WHERE c.id = ai_message.conversation_id AND c.user_id = auth.uid())
);

-- RLS Policies for Diagram Definitions (Public read access)
CREATE POLICY "Allow public read access to diagrams" ON diagram_definition FOR SELECT USING (is_public OR auth.uid() = created_by);
CREATE POLICY "Authors can manage diagrams" ON diagram_definition FOR ALL USING (auth.uid() = created_by);
