/*
# Create process_checklist table

1. New Tables
- `process_checklist`
  - `id` (uuid, primary key)
  - `user_id` (uuid, not null, defaults to authenticated user, references auth.users)
  - `items` (jsonb, not null, defaults '{}') — maps item IDs to boolean completed state
  - `updated_at` (timestamptz, default now())
2. Security
- Enable RLS on `process_checklist`.
- Owner-scoped CRUD: each authenticated user can only access their own row.
3. Notes
- One row per user (unique on user_id) so upserts keep a single record.
- `user_id` defaults to `auth.uid()` so inserts that omit it still satisfy the INSERT policy.
*/

CREATE TABLE IF NOT EXISTS process_checklist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  items jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE process_checklist ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_process_checklist" ON process_checklist;
CREATE POLICY "select_own_process_checklist"
ON process_checklist FOR SELECT
TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_process_checklist" ON process_checklist;
CREATE POLICY "insert_own_process_checklist"
ON process_checklist FOR INSERT
TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_process_checklist" ON process_checklist;
CREATE POLICY "update_own_process_checklist"
ON process_checklist FOR UPDATE
TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_process_checklist" ON process_checklist;
CREATE POLICY "delete_own_process_checklist"
ON process_checklist FOR DELETE
TO authenticated USING (auth.uid() = user_id);
