const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  cryptoCurrency: { type: String, required: true },
  amount: { type: String, required: true }, // Store as String for encrypted data
  price: { type: String, required: true },  // Store as String for encrypted data
  totalValue: { type: String, required: true }, // Store as String for encrypted data
}, { timestamps: true });

const Trade = mongoose.model('Trade', tradeSchema);
module.exports = Trade;