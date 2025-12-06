-- 1. Create Schema
CREATE SCHEMA IF NOT EXISTS app;

-- 2. Set Search Path
ALTER DATABASE fifty_villagers SET search_path TO app, public;
SET search_path TO app, public;

-- 3. Create Tables

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('student', 'admin')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Exam Centers Table (Replaces 'centers' from original schema)
CREATE TABLE IF NOT EXISTS exam_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    capacity INT NOT NULL,
    exam_date TIMESTAMP NOT NULL
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES users(id) ON DELETE CASCADE,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) CHECK (status IN ('pending', 'submitted', 'correction', 'approved', 'rejected')) DEFAULT 'pending',
    correction_notes TEXT,
    
    -- Personal Details
    father_name VARCHAR(255),
    father_occupation VARCHAR(255),
    family_members INTEGER,
    dob DATE,
    gender VARCHAR(50),
    
    -- Contact Details
    address TEXT,
    pincode VARCHAR(10),
    phone VARCHAR(20),
    mobile_secondary VARCHAR(20),
    
    -- Identity & Academic
    aadhar_number VARCHAR(20),
    school_name VARCHAR(255),
    exam_category VARCHAR(100), -- Class 9th/10th
    is_govt_school BOOLEAN DEFAULT FALSE,
    special_condition TEXT,
    
    -- Documents
    photo_url TEXT,
    signature_url TEXT,
    id_proof_url TEXT,
    
    -- Payment Details
    payment_id VARCHAR(255),
    order_id VARCHAR(255),
    payment_status VARCHAR(50) DEFAULT 'pending',
    amount DECIMAL(10, 2) DEFAULT 0.00,
    
    -- Exam/Admit Card Details
    exam_center_id INT REFERENCES exam_centers(id),
    roll_number VARCHAR(100) UNIQUE
);

-- Indexes for Applications
CREATE INDEX idx_applications_payment_status ON applications(payment_status);
CREATE INDEX idx_applications_roll_number ON applications(roll_number);

-- Admit Cards Table (Legacy/Optional - functionality moved to applications table but kept for schema compatibility)
CREATE TABLE IF NOT EXISTS admit_cards (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    center_id INT REFERENCES exam_centers(id),
    roll_number VARCHAR(100) UNIQUE,
    pdf_url TEXT,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Results Table
CREATE TABLE IF NOT EXISTS results (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    exam_score DECIMAL(5,2), -- Total Score
    
    -- Subject Marks with Constraints
    marks_science DECIMAL(5,2) CHECK (marks_science <= 40),
    marks_math DECIMAL(5,2) CHECK (marks_math <= 20),
    marks_english DECIMAL(5,2) CHECK (marks_english <= 20),
    marks_hindi DECIMAL(5,2) CHECK (marks_hindi <= 20),
    max_marks DECIMAL(5,2) DEFAULT 100.00,
    
    rank INT,
    passed BOOLEAN,
    scorecard_url TEXT,
    published_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Blog & Content Tables
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS blogs (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    hero_image TEXT,
    author_id INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_categories (
    blog_id INT REFERENCES blogs(id) ON DELETE CASCADE,
    category_id INT REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_id, category_id)
);

CREATE TABLE IF NOT EXISTS blog_tags (
    blog_id INT REFERENCES blogs(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (blog_id, tag_id)
);

CREATE TABLE IF NOT EXISTS blog_comments (
    id SERIAL PRIMARY KEY,
    blog_id INT REFERENCES blogs(id) ON DELETE CASCADE,
    commenter_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS blog_reactions (
    id SERIAL PRIMARY KEY,
    blog_id INT REFERENCES blogs(id) ON DELETE CASCADE,
    commenter_name VARCHAR(255) NOT NULL,
    reaction_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_sections (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS gallery_images (
    id SERIAL PRIMARY KEY,
    section_id INT REFERENCES gallery_sections(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    caption TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS correction_requests (
    id SERIAL PRIMARY KEY,
    application_id INT REFERENCES applications(id) ON DELETE CASCADE,
    admin_id INT REFERENCES users(id),
    note TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Seed Initial Data

-- Seed Admin User
INSERT INTO users (name, email, password_hash, role)
VALUES (
  'Super Admin', 
  'admin@fiftyvillagers.com', 
  '$2b$10$MBL2eDz/L2i6JJSu/JDEzehQC164OM8uFERXPpTpxnXKe/wJxh/hC',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

-- Seed Exam Center (Kalam Ashram)
INSERT INTO exam_centers (name, location, capacity, exam_date)
VALUES ('Kalam Ashram', 'Ahead of Dhapu Bai College', 1000, '2025-05-15 10:00:00')
ON CONFLICT DO NOTHING;
