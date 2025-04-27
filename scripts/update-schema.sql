-- SQL script to update the existing tables schema in Supabase
-- Run this in the Supabase SQL Editor if you need to modify the existing tables

-- Example: Add a new column to contact_submissions
-- ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS preferred_time TEXT;

-- Example: Add a new column with a default value
-- ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS subscribed BOOLEAN DEFAULT TRUE;

-- Example: Create a new index
-- CREATE INDEX IF NOT EXISTS contact_submissions_name_idx ON contact_submissions(name);

-- Note: Keep this file updated with any schema changes made to the database
-- so it serves as documentation of the evolution of the database schema.