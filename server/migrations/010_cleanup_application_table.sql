-- Remove unused column passing_year_10th
ALTER TABLE applications 
DROP COLUMN IF EXISTS passing_year_10th;
