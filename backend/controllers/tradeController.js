const Trade = require('../models/Trade');
const User = require('../models/User');
const { emitTradeUpdate } = require('../services/socketService');
const { encryptData, decryptData, validateRequest } = require('../services/securityService');

// @desc    Create a new trade
// @route   POST /api/trades
// @access  Private
const createTrade = async (req, res) => {
  try {
    const { type, cryptoCurrency, amount, price } = req.body;

    // Convert amount and price to numbers
    const numericAmount = Number(amount);
    const numericPrice = Number(price);

    // Check if conversion was successful
    if (isNaN(numericAmount) || isNaN(numericPrice)) {
      return res.status(400).json({ message: 'Invalid amount or price' });
    }

    const totalValue = numericAmount * numericPrice;

    // Encrypt sensitive trade data
    const encryptedAmount = encryptData(numericAmount.toString());
    const encryptedPrice = encryptData(numericPrice.toString());
    const encryptedTotalValue = encryptData(totalValue.toString());

    const trade = await Trade.create({
      user: req.user._id,
      type,
      cryptoCurrency,
      amount: encryptedAmount,
      price: encryptedPrice,
      totalValue: encryptedTotalValue,
    });

    // Emit real-time update
    emitTradeUpdate(trade);

    res.status(201).json(trade);
  } catch (error) {
    console.log('error >>>>', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's trades
// @route   GET /api/trades
// @access  Private
const getUserTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.user._id }).sort({ createdAt: -1 });

    // Decrypt sensitive data before sending
    const decryptedTrades = trades.map(trade => {
      try {
        return {
          ...trade.toObject(),
          amount: decryptData(trade.amount),
          price: decryptData(trade.price),
          totalValue: decryptData(trade.totalValue)
        };
      } catch (error) {
        console.error('Decryption error for trade:', trade, error);
        return {
          ...trade.toObject(),
          amount: null, // or some default value
          price: null,  // or some default value
          totalValue: null // or some default value
        };
      }
    });

    res.json(decryptedTrades);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trade by ID
// @route   GET /api/trades/:id
// @access  Private
const getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findById(req.params.id);
    
    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    if (trade.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Decrypt sensitive data before sending
    const decryptedTrade = {
      ...trade.toObject(),
      amount: decryptData(trade.amount),
      price: decryptData(trade.price),
      totalValue: decryptData(trade.totalValue)
    };

    res.json(decryptedTrade);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTrade,
  getUserTrades,
  getTradeById,
}; 