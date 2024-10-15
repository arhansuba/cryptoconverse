const express = require('express');
const router = express.Router();
const educationController = require('../controllers/educationController');
const auth = require('../middleware/auth');

// Public routes
router.get('/lessons', educationController.getLessons);
router.get('/lessons/:id', educationController.getLessonById);

// Protected routes
router.post('/lessons', auth, educationController.createLesson);
router.put('/lessons/:id', auth, educationController.updateLesson);
router.delete('/lessons/:id', auth, educationController.deleteLesson);

module.exports = router;