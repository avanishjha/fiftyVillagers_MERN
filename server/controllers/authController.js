const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
require('dotenv').config();

// Register User
exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if user exists
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert user
        // Always default to 'student'. Admin creation is disabled via API.
        const userRole = 'student';

        const newUser = await pool.query(
            'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
            [name, email, passwordHash, userRole]
        );

        // Create JWT Payload
        const payload = {
            user: {
                id: newUser.rows[0].id,
                role: newUser.rows[0].role,
            },
        };

        // Sign Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' }, // Token expires in 5 days
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: newUser.rows[0] });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Login User
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if user exists
        const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (user.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Create JWT Payload
        const payload = {
            user: {
                id: user.rows[0].id,
                role: user.rows[0].role,
            },
        };

        // Sign Token
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5d' },
            (err, token) => {
                if (err) throw err;
                res.json({ token, user: { id: user.rows[0].id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role } });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get User (Protected Route Example)
exports.getUser = async (req, res) => {
    try {
        const user = await pool.query('SELECT id, name, email, role, created_at FROM users WHERE id = $1', [req.user.id]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
