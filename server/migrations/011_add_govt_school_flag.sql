-- Add is_govt_school column
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS is_govt_school BOOLEAN DEFAULT FALSE;
