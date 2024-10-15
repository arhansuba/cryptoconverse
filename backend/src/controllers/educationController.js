const Lesson = require('../models/Lesson');

exports.createLesson = async (req, res) => {
  try {
    const { title, description, content, difficulty, category, duration, quizzes, resources } = req.body;
    const lesson = new Lesson({
      title,
      description,
      content,
      difficulty,
      category,
      duration,
      quizzes,
      resources,
      creator: req.userId
    });
    await lesson.save();
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lesson' });
  }
};

exports.getLessons = async (req, res) => {
  try {
    const { difficulty, category } = req.query;
    const filter = {};
    if (difficulty) filter.difficulty = difficulty;
    if (category) filter.category = category;
    const lessons = await Lesson.find(filter).sort({ createdAt: -1 });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve lessons' });
  }
};

exports.getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }
    lesson.views += 1;
    await lesson.save();
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve lesson' });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const { title, description, content, difficulty, category, duration, quizzes, resources } = req.body;
    const lesson = await Lesson.findOneAndUpdate(
      { _id: req.params.id, creator: req.userId },
      { title, description, content, difficulty, category, duration, quizzes, resources, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found or you are not the creator' });
    }
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lesson' });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findOneAndDelete({ _id: req.params.id, creator: req.userId });
    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found or you are not the creator' });
    }
    res.json({ message: 'Lesson deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lesson' });
  }
};