const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['buy', 'sell'], required: true },
  asset: { type: String, required: true },
  amount: { type: Number, required: true },
  price: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' },
  exchange: { type: String, required: true },
  fee: { type: Number, default: 0 },
  notes: String,
  transactionHash: String, // for blockchain transactions
  strategy: { type: String, enum: ['manual', 'bot', 'copy-trading'] },
  profitLoss: { type: Number, default: 0 }, // calculated field
  relatedTrade: { type: mongoose.Schema.Types.ObjectId, ref: 'Trade' } // for linking buy and sell trades
});

// Calculate profit/loss before saving
tradeSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed') {
    // Simple P/L calculation, you might want to make this more sophisticated
    if (this.type === 'sell' && this.relatedTrade) {
      this.profitLoss = (this.amount * this.price) - (this.amount * this.relatedTrade.price) - this.fee;
    }
  }
  next();
});

module.exports = mongoose.model('Trade', tradeSchema);