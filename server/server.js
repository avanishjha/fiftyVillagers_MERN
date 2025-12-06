const env = require('./config/env');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();
const migrate = require('./utils/migrate');
const { pool } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const { logger, requestLogger, logError } = require('./config/logger');

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'http://localhost:3000';

// Basic middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging Middleware
app.use(requestLogger);

// CORS
app.use(cors({
    origin: FRONTEND_ORIGIN,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // limit each IP to 300 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

// Serve static uploads (only for local driver)
if (process.env.STORAGE_DRIVER !== 's3') {
    const uploadsDir = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
    app.use('/uploads', express.static(uploadsDir, { maxAge: '30d' }));
}

// Health endpoint
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', db: 'ok' });
    } catch (err) {
        res.status(500).json({ status: 'fail', db: 'error' });
    }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/blogs', require('./routes/blogs'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/payment', require('./routes/paymentRoutes'));
app.use('/api/exam', require('./routes/examRoutes'));
app.use('/api/student', require('./routes/studentRoutes'));

app.get('/', (req, res) => {
    res.send('Fifty Villagers API is running');
});

// Error Handler (Must be last)
app.use(errorHandler);

// Global Error Logging Middleware (Custom)
app.use((err, req, res, next) => {
    logError(err, req);
    if (res.headersSent) return next(err);
    next(err); // Pass to the final error handler (errorHandler.js) checks response.
});


// Start Server
const startServer = async () => {
    try {
        await migrate();
        app.listen(PORT, () => {
            logger.info(`Server started on port ${PORT}`);
        });
    } catch (err) {
        logger.error('Failed to start server', { error: err.message });
        process.exit(1);
    }
};

startServer();
// Server updated to fix image URLs and apply schema enhancements
