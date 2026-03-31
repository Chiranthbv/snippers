-- Fix the language column type from bytea to varchar if needed
-- This is needed because older schema had the wrong column type
ALTER TABLE snippets ALTER COLUMN language TYPE VARCHAR(50) USING language::VARCHAR(50);
