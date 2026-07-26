/*
# Create roadmap_progress table

1. New Tables
- `roadmap_progress`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to authenticated user, references auth.users)
  - `steps` (jsonb, not null, defaults '{}') — maps step IDs to boolean completed state
  - `updated_at` (timestamptz, default now())
2. Security
- Enable RLS on `roadmap_progress`.
- Owner-scoped CRUD: each authenticated user can only access their own row.
3. Notes
- One row per user (unique on user_id) so upserts keep a single progress record.
- `user_id` defaults to `auth.uid()` so inserts that omit it still satisfy the INSERT policy.
*/

CREATE TABLE IF NOT EXISTS roadmap_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  steps jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_roadmap" ON roadmap_progress;
CREATE POLICY "select_own_roadmap"
ON roadmap_progress FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_roadmap" ON roadmap_progress;
CREATE POLICY "insert_own_roadmap"
ON roadmap_progress FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_roadmap" ON roadmap_progress;
CREATE POLICY "update_own_roadmap"
ON roadmap_progress FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_roadmap" ON roadmap_progress;
CREATE POLICY "delete_own_roadmap"
ON roadmap_progress FOR DELETE
TO authenticated USING (auth.uid() = user_id);
