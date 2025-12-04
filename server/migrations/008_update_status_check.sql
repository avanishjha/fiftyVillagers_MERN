-- Drop the existing constraint
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_status_check;

-- Add the new constraint including 'submitted'
ALTER TABLE applications ADD CONSTRAINT applications_status_check 
CHECK (status IN ('pending', 'submitted', 'correction', 'approved', 'rejected'));
