import React, { useState } from 'react';
import { useAI } from '../../hooks/useAI';
import { apiService } from '../../services/api';

function AIExplanation({ lessonContent }) {
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { generateResponse } = useAI();

  const handleExplanationRequest = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getAIExplanation(lessonContent);
      setExplanation(response.data.explanation);
    } catch (error) {
      console.error('Error getting AI explanation:', error);
      setExplanation('Sorry, I encountered an error while generating the explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-explanation">
      <button onClick={handleExplanationRequest} disabled={isLoading}>
        {isLoading ? 'Generating Explanation...' : 'Get AI Explanation'}
      </button>
      {explanation && (
        <div className="explanation-content">
          <h4>AI Explanation:</h4>
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}

export default AIExplanation;