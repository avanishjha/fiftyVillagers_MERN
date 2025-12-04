ALTER TABLE applications 
ADD COLUMN payment_id VARCHAR(255),
ADD COLUMN order_id VARCHAR(255),
ADD COLUMN payment_status VARCHAR(50) DEFAULT 'pending',
ADD COLUMN amount DECIMAL(10, 2) DEFAULT 0.00;

-- Index for faster lookups
CREATE INDEX idx_applications_payment_status ON applications(payment_status);
