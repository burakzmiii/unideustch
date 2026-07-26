/*
# Create decisions table for social proof counter

1. New Tables
- `decisions`
  - `id` (uuid, primary key)
  - `user_id` (uuid, nullable, references auth.users — nullable so anonymous users can also decide)
  - `city` (text, not null) — the German city the student chose
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `decisions`.
- SELECT: public (anon + authenticated) so the counter is visible to everyone.
- INSERT: public (anon + authenticated) so anyone can submit a decision.
- UPDATE/DELETE: disabled — decisions are immutable once submitted.
3. Notes
- One row per decision submission. The global counter is COUNT(*) and the
  city distribution is COUNT(*) GROUP BY city.
- user_id is nullable so logged-out visitors can still participate; we
  track per-user "already decided" state in the frontend via localStorage
  for anonymous users and via the user_id for logged-in users.
*/

CREATE TABLE IF NOT EXISTS decisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  city text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE decisions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_decisions" ON decisions;
CREATE POLICY "read_decisions"
ON decisions FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "insert_decisions" ON decisions;
CREATE POLICY "insert_decisions"
ON decisions FOR INSERT
TO anon, authenticated WITH CHECK (true);
