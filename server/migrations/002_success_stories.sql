-- 1. Create Success Stories Table
CREATE TABLE IF NOT EXISTS success_stories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    batch VARCHAR(100), -- e.g. "2023-24"
    image_url TEXT,
    excerpt TEXT,
    content TEXT, -- Rich text HTML
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
