ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS exam_center_id INT REFERENCES exam_centers(id),
ADD COLUMN IF NOT EXISTS roll_number VARCHAR(100) UNIQUE;

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_applications_roll_number ON applications(roll_number);
