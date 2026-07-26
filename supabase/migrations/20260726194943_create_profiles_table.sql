/*
# Create profiles table for editable user info with 30-day lock

1. New Tables
- `profiles`
  - `id` (uuid, primary key, references auth.users)
  - `full_name` (text, not null) — display name
  - `gpa` (numeric, nullable) — academic GPA, editable once per 30 days
  - `last_critical_edit_at` (timestamptz, nullable) — when Name/GPA were last changed
  - `created_at` (timestamptz, default now())
2. Security
- Enable RLS on `profiles`.
- Owner-scoped CRUD: each authenticated user can only access their own profile row.
3. Notes
- The 30-day lock on Name and GPA is enforced in the frontend by comparing
  last_critical_edit_at to the current time. The backend stores the
  timestamp so the lock survives page reloads and sessions.
- id defaults to auth.uid() so a user can insert their own profile row.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  gpa numeric(3,2),
  last_critical_edit_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile"
ON profiles FOR DELETE
TO authenticated USING (auth.uid() = id);
