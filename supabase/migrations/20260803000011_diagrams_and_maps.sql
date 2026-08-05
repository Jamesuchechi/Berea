-- Migration: Interactive Diagrams, Maps & Cross-Reference Network Schema
-- Migration ID: 20260803000011

CREATE TABLE IF NOT EXISTS diagram_definition (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('lineage', 'timeline', 'map', 'network')),
  title TEXT NOT NULL,
  description TEXT,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for fast lookup by type or slug
CREATE INDEX IF NOT EXISTS idx_diagram_type_slug ON diagram_definition(type, slug);

-- Enable RLS
ALTER TABLE diagram_definition ENABLE ROW LEVEL SECURITY;

-- Public read policy for interactive diagrams
DROP POLICY IF EXISTS "Public read diagram definitions" ON diagram_definition;
CREATE POLICY "Public read diagram definitions" ON diagram_definition
  FOR SELECT USING (is_public = true);
