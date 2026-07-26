/*
# Add upvotes table and topic column to questions

## Changes
1. Add `topic` column to `questions` table for topic-based filtering (Konaklama, Vize, Staj, Dersler, Genel).
2. Create `question_upvotes` table to track which users upvoted which questions (one upvote per user per question).

## New Tables
- `question_upvotes`
  - `id` (uuid, primary key)
  - `question_id` (uuid, references questions.id ON DELETE CASCADE)
  - `user_id` (uuid, references auth.users ON DELETE CASCADE, defaults to auth.uid())
  - Unique constraint on (question_id, user_id) to prevent double-voting

## Modified Tables
- `questions`: add `topic` text column (default 'Genel'), add `upvotes` integer column (default 0) for denormalized count

## Security
- RLS enabled on question_upvotes
- SELECT: anyone can read (to show counts/status)
- INSERT: authenticated users only, can only insert for themselves
- DELETE: authenticated users can remove their own upvote

## Important Notes
1. The upvotes integer on questions is a denormalized counter for fast reads.
2. The question_upvotes table enforces one-vote-per-user via unique constraint.
3. Topic column allows filtering questions by category.
*/

-- Add topic and upvotes columns to questions
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'topic') THEN
    ALTER TABLE questions ADD COLUMN topic text NOT NULL DEFAULT 'Genel';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'upvotes') THEN
    ALTER TABLE questions ADD COLUMN upvotes integer NOT NULL DEFAULT 0;
  END IF;
END $$;

-- Create upvotes tracking table
CREATE TABLE IF NOT EXISTS question_upvotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(question_id, user_id)
);

ALTER TABLE question_upvotes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_upvotes" ON question_upvotes;
CREATE POLICY "read_upvotes" ON question_upvotes FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_own_upvotes" ON question_upvotes;
CREATE POLICY "insert_own_upvotes" ON question_upvotes FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_upvotes" ON question_upvotes;
CREATE POLICY "delete_own_upvotes" ON question_upvotes FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_question_upvotes_question ON question_upvotes(question_id);
CREATE INDEX IF NOT EXISTS idx_question_upvotes_user ON question_upvotes(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_topic ON questions(topic);
