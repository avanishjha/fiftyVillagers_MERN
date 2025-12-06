const Joi = require('joi');
require('dotenv').config();

const envSchema = Joi.object({
    NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
    PORT: Joi.number().default(5000),
    BASE_URL: Joi.string().uri().required(),
    FRONTEND_ORIGIN: Joi.string().uri().required(),

    // Database
    DB_USER: Joi.string().required(),
    DB_PASSWORD: Joi.string().required(),
    DB_HOST: Joi.string().required(),
    DB_PORT: Joi.number().default(5432),
    DB_NAME: Joi.string().required(),

    // JWT
    JWT_SECRET: Joi.string().min(32).required(),

    // Storage
    STORAGE_DRIVER: Joi.string().valid('local', 's3').default('local'),
    UPLOAD_DIR: Joi.string().when('STORAGE_DRIVER', {
        is: 'local',
        then: Joi.required()
    }),
    S3_BUCKET: Joi.string().when('STORAGE_DRIVER', {
        is: 's3',
        then: Joi.required()
    }),
    AWS_REGION: Joi.string().when('STORAGE_DRIVER', {
        is: 's3',
        then: Joi.required()
    }),

    // Razorpay
    RAZORPAY_KEY_ID: Joi.string().required(),
    RAZORPAY_KEY_SECRET: Joi.string().required(),

    MAX_UPLOAD_MB: Joi.number().default(5),
}).unknown();

const { error, value: env } = envSchema.validate(process.env, {
    abortEarly: false,
    stripUnknown: true
});

if (error) {
    console.error('❌ Environment validation failed:');
    error.details.forEach(detail => {
        console.error(`  - ${detail.message}`);
    });
    process.exit(1);
}

console.log('✅ Environment variables validated successfully');
module.exports = env;