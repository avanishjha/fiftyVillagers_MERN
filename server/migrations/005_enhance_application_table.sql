-- Add new columns to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS father_occupation VARCHAR(255),
ADD COLUMN IF NOT EXISTS family_members INTEGER,
ADD COLUMN IF NOT EXISTS school_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS passing_year_10th INTEGER,
ADD COLUMN IF NOT EXISTS pincode VARCHAR(10),
ADD COLUMN IF NOT EXISTS aadhar_number VARCHAR(20),
ADD COLUMN IF NOT EXISTS mobile_secondary VARCHAR(20),
ADD COLUMN IF NOT EXISTS special_condition TEXT; -- Stored as JSON string or comma-separated values
