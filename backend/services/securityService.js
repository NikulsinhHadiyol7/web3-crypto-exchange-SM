const CryptoJS = require('crypto-js');
const { validationResult } = require('express-validator');

// Encryption key from environment variable
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'your-secure-encryption-key';

// Encrypt sensitive data
const encryptData = (data) => {
    try {
        return CryptoJS.AES.encrypt(JSON.stringify(data), ENCRYPTION_KEY).toString();
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Encryption failed');
    }
};

// Decrypt sensitive data
const decryptData = (encryptedData) => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Decryption failed');
    }
};

// Validate request data
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Rate limiting configuration
const rateLimiterConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000000, // Limit each IP to 100 requests per windowMs 100 to 10000
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
};

// Trade-specific rate limiter
const tradeRateLimiterConfig = {
    windowMs: 60 * 1000, // 1 minute
    max: 10000000, // Limit each IP to 10 trade requests per minute 10 to 1000
    message: 'Too many trade requests, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
};

module.exports = {
    encryptData,
    decryptData,
    validateRequest,
    rateLimiterConfig,
    tradeRateLimiterConfig
}; 