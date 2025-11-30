const fs = require('fs');
const path = require('path');
const { pool } = require('../config/db');

const migrate = async () => {
    const client = await pool.connect();
    try {
        console.log('Starting database migrations...');

        // 1. Create migrations table if it doesn't exist
        await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

        // 2. Read migration files
        const migrationsDir = path.join(__dirname, '../migrations');
        if (!fs.existsSync(migrationsDir)) {
            console.log('No migrations directory found.');
            return;
        }

        const files = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.sql'))
            .sort(); // Ensure they run in order

        // 3. Execute new migrations
        for (const file of files) {
            const { rows } = await client.query('SELECT id FROM migrations WHERE name = $1', [file]);

            if (rows.length === 0) {
                console.log(`Executing migration: ${file}`);
                const filePath = path.join(migrationsDir, file);
                const sql = fs.readFileSync(filePath, 'utf8');

                try {
                    await client.query('BEGIN');
                    await client.query(sql);
                    await client.query('INSERT INTO migrations (name) VALUES ($1)', [file]);
                    await client.query('COMMIT');
                    console.log(`Migration ${file} completed successfully.`);
                } catch (err) {
                    await client.query('ROLLBACK');
                    console.error(`Error executing migration ${file}:`, err);
                    throw err; // Stop migration process on error
                }
            } else {
                // console.log(`Skipping already executed migration: ${file}`);
            }
        }

        console.log('All migrations are up to date.');
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    } finally {
        client.release();
    }
};

module.exports = migrate;
