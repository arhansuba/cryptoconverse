const Trade = require('../models/Trade');
const User = require('../models/User');
const ethereumService = require('../services/blockchain/ethereumService');

exports.createTrade = async (req, res) => {
  try {
    const { type, asset, amount, price, exchange } = req.body;
    const trade = new Trade({
      user: req.userId,
      type,
      asset,
      amount,
      price,
      exchange
    });
    await trade.save();
    res.status(201).json(trade);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trade' });
  }
};

exports.getUserTrades = async (req, res) => {
  try {
    const trades = await Trade.find({ user: req.userId }).sort({ timestamp: -1 });
    res.json(trades);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trades' });
  }
};

exports.getTradeById = async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, user: req.userId });
    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    res.json(trade);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve trade' });
  }
};

exports.updateTradeStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const trade = await Trade.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!trade) {
      return res.status(404).json({ error: 'Trade not found' });
    }
    res.json(trade);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trade status' });
  }
};

exports.executeTrade = async (req, res) => {
  try {
    const trade = await Trade.findOne({ _id: req.params.id, user: req.userId, status: 'pending' });
    if (!trade) {
      return res.status(404).json({ error: 'Trade not found or already executed' });
    }
    
    // Here you would integrate with your chosen exchange's API to execute the trade
    // This is a placeholder for demonstration purposes
    const executionResult = await simulateTradeExecution(trade);
    
    if (executionResult.success) {
      trade.status = 'completed';
      trade.transactionHash = executionResult.transactionHash;
      await trade.save();
      res.json({ message: 'Trade executed successfully', trade });
    } else {
      res.status(400).json({ error: 'Trade execution failed', details: executionResult.error });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to execute trade' });
  }
};

// Placeholder function to simulate trade execution
async function simulateTradeExecution(trade) {
  // In a real application, you would integrate with an exchange API here
  return {
    success: true,
    transactionHash: ethereumService.generateDummyTransactionHash()
  };
}