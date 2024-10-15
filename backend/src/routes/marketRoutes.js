const express = require('express');
const router = express.Router();
const marketController = require('../controllers/marketController');
const auth = require('../middleware/auth');

// Public routes
router.get('/data/:symbol', marketController.getMarketData);
router.get('/trending', marketController.getTrendingCoins);

// Protected routes
router.get('/sentiment/:symbol', auth, marketController.getMarketSentiment);

module.exports = router;