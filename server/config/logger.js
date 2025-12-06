// server/config/logger.js
const winston = require('winston');
const path = require('path');

// Custom format for console
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
        }
        return msg;
    })
);

// JSON format for file/cloud logging
const jsonFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
);

// Create logger instance
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    defaultMeta: {
        service: 'fifty-villagers-api',
        environment: process.env.NODE_ENV
    },
    transports: []
});

// Console transport for development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: consoleFormat
    }));
}

// File transports for production
if (process.env.NODE_ENV === 'production') {
    // Error logs
    logger.add(new winston.transports.File({
        filename: path.join(__dirname, '../logs/error.log'),
        level: 'error',
        format: jsonFormat,
        maxsize: 10485760, // 10MB
        maxFiles: 5
    }));

    // Combined logs
    logger.add(new winston.transports.File({
        filename: path.join(__dirname, '../logs/combined.log'),
        format: jsonFormat,
        maxsize: 10485760,
        maxFiles: 10
    }));

    // Console with JSON format
    logger.add(new winston.transports.Console({
        format: jsonFormat
    }));
}

// Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const logData = {
            method: req.method,
            url: req.originalUrl,
            status: res.statusCode,
            duration: `${duration}ms`,
            ip: req.ip,
            userAgent: req.get('user-agent')
        };

        if (res.statusCode >= 400) {
            logger.warn('Request completed with error', logData);
        } else {
            logger.info('Request completed', logData);
        }
    });

    next();
};

// Error logging
const logError = (err, req = null) => {
    const errorLog = {
        message: err.message,
        stack: err.stack,
        ...(req && {
            method: req.method,
            url: req.originalUrl,
            ip: req.ip
        })
    };

    logger.error('Application error', errorLog);
};

module.exports = {
    logger,
    requestLogger,
    logError
};