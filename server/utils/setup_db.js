const { Client } = require('pg');
require('dotenv').config();

const setupDatabase = async () => {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: 'postgres', // Connect to default 'postgres' db first
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await client.connect();
        console.log('Connected to postgres database.');

        const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'fifty_villagers'");
        if (res.rows.length > 0) {
            console.log('Database fifty_villagers exists. Dropping it for clean reset...');
            // Terminate other connections first
            await client.query(`
                SELECT pg_terminate_backend(pg_stat_activity.pid)
                FROM pg_stat_activity
                WHERE pg_stat_activity.datname = 'fifty_villagers'
                AND pid <> pg_backend_pid();
            `);
            await client.query('DROP DATABASE fifty_villagers');
            console.log('Database dropped.');
        }

        console.log('Creating database fifty_villagers...');
        await client.query('CREATE DATABASE fifty_villagers');
        console.log('Database created successfully.');
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await client.end();
    }
};

setupDatabase();
