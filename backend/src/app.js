const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const educationRoutes = require('./routes/educationRoutes');
const marketRoutes = require('./routes/marketRoutes');
const tradingRoutes = require('./routes/tradingRoutes');

const predictionService = require('./services/ai/predictionService');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

// Initialize AI model
predictionService.initializeModel()
  .then(() => console.log('AI model initialized'))
  .catch((err) => console.error('Error initializing AI model:', err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/education', educationRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/trading', tradingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;