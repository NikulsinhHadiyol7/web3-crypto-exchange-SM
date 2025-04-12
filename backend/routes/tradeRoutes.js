const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { limiter } = require('../security/rateLimiter');
const {
  createTrade,
  getUserTrades,
  getTradeById,
} = require('../controllers/tradeController');

router.use(protect);
router.use(limiter);

router.route('/')
  .post(createTrade)
  .get(getUserTrades);

router.route('/:id')
  .get(getTradeById);

module.exports = router; 