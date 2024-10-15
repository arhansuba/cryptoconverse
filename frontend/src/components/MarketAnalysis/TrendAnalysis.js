import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

function TrendAnalysis({ symbol }) {
  const [trendData, setTrendData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTrendData();
  }, [symbol]);

  const fetchTrendData = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getTrendAnalysis(symbol);
      setTrendData(response.data);
    } catch (error) {
      console.error('Error fetching trend data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading trend analysis...</div>;

  return (
    <div className="trend-analysis">
      <h3>{symbol} Trend Analysis</h3>
      {trendData && (
        <>
          <div className="trend-indicator">
            <strong>Current Trend:</strong> {trendData.currentTrend}
          </div>
          <div className="support-resistance">
            <div><strong>Support:</strong> {trendData.support}</div>
            <div><strong>Resistance:</strong> {trendData.resistance}</div>
          </div>
          <div className="moving-averages">
            <div><strong>50 Day MA:</strong> {trendData.ma50}</div>
            <div><strong>200 Day MA:</strong> {trendData.ma200}</div>
          </div>
          <div className="trend-strength">
            <strong>Trend Strength:</strong> {trendData.trendStrength}
          </div>
          <div className="prediction">
            <strong>Short-term Prediction:</strong> {trendData.shortTermPrediction}
          </div>
        </>
      )}
    </div>
  );
}

export default TrendAnalysis;