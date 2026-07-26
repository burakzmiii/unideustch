/* Add university_id column to decisions table for per-university tracking */
ALTER TABLE decisions ADD COLUMN IF NOT EXISTS university_id text;
