const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  content: { type: String, required: true },
  difficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  category: { type: String, required: true },
  tags: [String],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  duration: { type: Number, required: true }, // in minutes
  quizzes: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['article', 'video', 'podcast', 'infographic'] }
  }],
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 }
});

module.exports = mongoose.model('Lesson', lessonSchema);