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
        if (res.rows.length === 0) {
            console.log('Creating database fifty_villagers...');
            await client.query('CREATE DATABASE fifty_villagers');
            console.log('Database created successfully.');
        } else {
            console.log('Database fifty_villagers already exists.');
        }
    } catch (err) {
        console.error('Error creating database:', err);
    } finally {
        await client.end();
    }
};

setupDatabase();
