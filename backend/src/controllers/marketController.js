const axios = require('axios');
const nlpService = require('../services/ai/nlpService');

exports.getMarketData = async (req, res) => {
  try {
    const { symbol } = req.params;
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${symbol}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
};

exports.getTrendingCoins = async (req, res) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/search/trending');
    res.json(response.data.coins);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending coins' });
  }
};

exports.getMarketSentiment = async (req, res) => {
  try {
    const { symbol } = req.params;
    // This is a placeholder. In a real-world scenario, you'd fetch news or social media posts about the coin
    const newsArticles = await fetchNewsArticles(symbol);
    const sentiments = newsArticles.map(article => nlpService.analyzeText(article.title + ' ' + article.description));
    const overallSentiment = sentiments.reduce((sum, s) => sum + s.sentiment, 0) / sentiments.length;
    res.json({ symbol, overallSentiment, articles: newsArticles });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze market sentiment' });
  }
};

// Placeholder function to fetch news articles
async function fetchNewsArticles(symbol) {
  // In a real application, you would integrate with a news API
  return [
    { title: `${symbol} price surges`, description: `The price of ${symbol} has increased by 10% in the last 24 hours.` },
    { title: `New partnership announced for ${symbol}`, description: `A major company has partnered with ${symbol} for blockchain integration.` }
  ];
}