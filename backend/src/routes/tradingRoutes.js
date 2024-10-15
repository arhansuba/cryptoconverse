const express = require('express');
const router = express.Router();
const tradingController = require('../controllers/tradingController');
const auth = require('../middleware/auth');

// All trading routes are protected
router.use(auth);

router.post('/trades', tradingController.createTrade);
router.get('/trades', tradingController.getUserTrades);
router.get('/trades/:id', tradingController.getTradeById);
router.patch('/trades/:id/status', tradingController.updateTradeStatus);
router.post('/trades/:id/execute', tradingController.executeTrade);

module.exports = router;