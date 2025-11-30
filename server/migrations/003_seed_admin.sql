-- Insert an Admin User
-- Password is 'admin123'
INSERT INTO app.users (name, email, password_hash, role)
VALUES (
  'Super Admin', 
  'admin@fiftyvillagers.com', 
  '$2b$10$1neaDfHSx0b1hPrEdq/zFO56J9uYCc4sj88j8yYee4eAuJEB5cpA3m', -- Password: FifyAdmin@2025#Secure
  'admin'
)
ON CONFLICT (email) DO NOTHING;
