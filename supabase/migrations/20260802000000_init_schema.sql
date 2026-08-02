-- Initial Canon-Status Data Model & RLS setup based on ARCHITECTURE.md

-- Enum Types
CREATE TYPE book_category AS ENUM ('canonical', 'deuterocanon', 'pseudepigrapha', 'early_church_writing', 'gnostic');
CREATE TYPE tradition_type AS ENUM ('protestant', 'catholic', 'orthodox', 'ethiopian');
CREATE TYPE license_type AS ENUM ('public_domain', 'licensed_api');

-- Book table
CREATE TABLE book (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  category book_category NOT NULL,
  origin_period TEXT,
  origin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Canon Membership table
CREATE TABLE canon_membership (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES book(id) ON DELETE CASCADE,
  tradition tradition_type NOT NULL,
  accepted_as_scripture BOOLEAN NOT NULL DEFAULT true,
  canonical_order INTEGER,
  UNIQUE(book_id, tradition)
);

-- Translation table
CREATE TABLE translation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id UUID NOT NULL REFERENCES book(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  license license_type NOT NULL DEFAULT 'public_domain',
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Verse table
CREATE TABLE verse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  translation_id UUID NOT NULL REFERENCES translation(id) ON DELETE CASCADE,
  chapter INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  text TEXT NOT NULL
);

-- User Note table
CREATE TABLE user_note (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES book(id) ON DELETE CASCADE,
  chapter INTEGER NOT NULL,
  verse_number INTEGER NOT NULL,
  content TEXT NOT NULL,
  highlight_color TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Row Level Security (RLS) Policies
ALTER TABLE book ENABLE ROW LEVEL SECURITY;
ALTER TABLE canon_membership ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation ENABLE ROW LEVEL SECURITY;
ALTER TABLE verse ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_note ENABLE ROW LEVEL SECURITY;

-- Public read access for static texts & metadata
CREATE POLICY "Allow public read access to books" ON book FOR SELECT USING (true);
CREATE POLICY "Allow public read access to canon membership" ON canon_membership FOR SELECT USING (true);
CREATE POLICY "Allow public read access to translations" ON translation FOR SELECT USING (true);
CREATE POLICY "Allow public read access to verses" ON verse FOR SELECT USING (true);

-- Scoped access for user_note (users can only access their own notes)
CREATE POLICY "Users can view own notes" ON user_note FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own notes" ON user_note FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own notes" ON user_note FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own notes" ON user_note FOR DELETE USING (auth.uid() = user_id);
