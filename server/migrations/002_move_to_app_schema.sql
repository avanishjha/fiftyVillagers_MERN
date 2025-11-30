-- Create the new schema
CREATE SCHEMA IF NOT EXISTS app;

-- Move existing tables to the new schema
ALTER TABLE IF EXISTS users SET SCHEMA app;
ALTER TABLE IF EXISTS centers SET SCHEMA app;
ALTER TABLE IF EXISTS applications SET SCHEMA app;
ALTER TABLE IF EXISTS admit_cards SET SCHEMA app;
ALTER TABLE IF EXISTS results SET SCHEMA app;
ALTER TABLE IF EXISTS categories SET SCHEMA app;
ALTER TABLE IF EXISTS tags SET SCHEMA app;
ALTER TABLE IF EXISTS blogs SET SCHEMA app;
ALTER TABLE IF EXISTS blog_categories SET SCHEMA app;
ALTER TABLE IF EXISTS blog_tags SET SCHEMA app;
ALTER TABLE IF EXISTS blog_comments SET SCHEMA app;
ALTER TABLE IF EXISTS blog_reactions SET SCHEMA app;
ALTER TABLE IF EXISTS gallery_sections SET SCHEMA app;
ALTER TABLE IF EXISTS gallery_images SET SCHEMA app;
ALTER TABLE IF EXISTS correction_requests SET SCHEMA app;

-- Move the migrations table itself so we track it in the new schema
ALTER TABLE IF EXISTS migrations SET SCHEMA app;

-- Set the search path for the database so future connections look in 'app' first
ALTER DATABASE fifty_villagers SET search_path TO app, public;

-- Set search path for the current transaction so the migration script can finish successfully
SET search_path TO app, public;
