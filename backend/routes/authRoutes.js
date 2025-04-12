const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const { authLimiter } = require('../security/rateLimiter');

router.post('/register', registerUser);
router.post('/login', authLimiter, loginUser);

module.exports = router; 