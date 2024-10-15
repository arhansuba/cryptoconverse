import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';
import Quiz from './Quiz';
import AIExplanation from './AIExplanation';

function LessonModule() {
  const [lessons, setLessons] = useState([]);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await apiService.getLessons();
      setLessons(response.data);
    } catch (error) {
      console.error('Error fetching lessons:', error);
    }
  };

  const handleLessonSelect = async (lessonId) => {
    try {
      const response = await apiService.getLesson(lessonId);
      setCurrentLesson(response.data);
      setShowQuiz(false);
    } catch (error) {
      console.error('Error fetching lesson:', error);
    }
  };

  const handleQuizComplete = () => {
    setShowQuiz(false);
    // You might want to update user progress here
  };

  return (
    <div className="lesson-module">
      <div className="lesson-list">
        <h2>Lessons</h2>
        {lessons.map((lesson) => (
          <button key={lesson.id} onClick={() => handleLessonSelect(lesson.id)}>
            {lesson.title}
          </button>
        ))}
      </div>
      {currentLesson && (
        <div className="lesson-content">
          <h2>{currentLesson.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: currentLesson.content }} />
          <AIExplanation lessonContent={currentLesson.content} />
          <button onClick={() => setShowQuiz(true)}>Take Quiz</button>
        </div>
      )}
      {showQuiz && <Quiz lessonId={currentLesson.id} onComplete={handleQuizComplete} />}
    </div>
  );
}

export default LessonModule;