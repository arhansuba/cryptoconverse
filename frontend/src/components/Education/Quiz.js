import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

function Quiz({ lessonId, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuizQuestions();
  }, [lessonId]);

  const fetchQuizQuestions = async () => {
    try {
      const response = await apiService.getQuizQuestions(lessonId);
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
    }
  };

  const handleAnswer = (questionId, answerId) => {
    setAnswers({ ...answers, [questionId]: answerId });
  };

  const handleSubmit = async () => {
    try {
      const response = await apiService.submitQuiz(lessonId, answers);
      setScore(response.data.score);
      setShowResults(true);
      onComplete();
    } catch (error) {
      console.error('Error submitting quiz:', error);
    }
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="quiz">
      {!showResults ? (
        <>
          <h3>Question {currentQuestion + 1}</h3>
          <p>{currentQuestionData?.text}</p>
          {currentQuestionData?.options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleAnswer(currentQuestionData.id, option.id)}
              className={answers[currentQuestionData.id] === option.id ? 'selected' : ''}
            >
              {option.text}
            </button>
          ))}
          {currentQuestion < questions.length - 1 ? (
            <button onClick={() => setCurrentQuestion(currentQuestion + 1)}>Next</button>
          ) : (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </>
      ) : (
        <div className="quiz-results">
          <h3>Quiz Results</h3>
          <p>Your score: {score}%</p>
          <button onClick={onComplete}>Back to Lesson</button>
        </div>
      )}
    </div>
  );
}

export default Quiz;