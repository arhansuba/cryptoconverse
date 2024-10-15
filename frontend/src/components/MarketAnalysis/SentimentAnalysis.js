import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

function SentimentAnalysis({ symbol }) {
  const [sentimentData, setSentimentData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchSentimentData();
  }, [symbol]);

  const fetchSentimentData = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getSentimentAnalysis(symbol);
      setSentimentData(response.data);
    } catch (error) {
      console.error('Error fetching sentiment data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Analyzing market sentiment...</div>;

  return (
    <div className="sentiment-analysis">
      <h3>{symbol} Sentiment Analysis</h3>
      {sentimentData && (
        <>
          <div className="overall-sentiment">
            <strong>Overall Sentiment:</strong> {sentimentData.overallSentiment}
          </div>
          <div className="sentiment-score">
            <strong>Sentiment Score:</strong> {sentimentData.sentimentScore}
          </div>
          <div className="sentiment-sources">
            <h4>Sentiment by Source:</h4>
            <ul>
              {Object.entries(sentimentData.sentimentBySources).map(([source, sentiment]) => (
                <li key={source}>{source}: {sentiment}</li>
              ))}
            </ul>
          </div>
          <div className="key-topics">
            <h4>Key Topics:</h4>
            <ul>
              {sentimentData.keyTopics.map((topic, index) => (
                <li key={index}>{topic}</li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}

export default SentimentAnalysis;