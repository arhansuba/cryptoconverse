const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  preferences: {
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'USD' }
  }
});

module.exports = mongoose.model('User', userSchema);