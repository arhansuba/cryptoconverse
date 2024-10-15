import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

function RiskManagement() {
  const [portfolio, setPortfolio] = useState(null);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [stopLoss, setStopLoss] = useState(10);
  const [takeProfit, setTakeProfit] = useState(20);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      const response = await apiService.getPortfolio();
      setPortfolio(response.data);
    } catch (error) {
      console.error('Error fetching portfolio:', error);
    }
  };

  const handleRiskLevelChange = async (level) => {
    setRiskLevel(level);
    try {
      await apiService.setRiskLevel(level);
      // You might want to update the portfolio or other state here
    } catch (error) {
      console.error('Error setting risk level:', error);
    }
  };

  const handleStopLossChange = async (value) => {
    setStopLoss(value);
    try {
      await apiService.setGlobalStopLoss(value);
    } catch (error) {
      console.error('Error setting stop loss:', error);
    }
  };

  const handleTakeProfitChange = async (value) => {
    setTakeProfit(value);
    try {
      await apiService.setGlobalTakeProfit(value);
    } catch (error) {
      console.error('Error setting take profit:', error);
    }
  };

  return (
    <div className="risk-management">
      <h3>Risk Management</h3>
      <div className="portfolio-summary">
        <h4>Portfolio Summary</h4>
        {portfolio && (
          <>
            <p>Total Value: ${portfolio.totalValue}</p>
            <p>Assets: {portfolio.assets.length}</p>
            {/* Render more portfolio details if necessary */}
          </>
        )}
        {!portfolio && <p>Loading portfolio...</p>}
      </div>

      <div className="risk-level">
        <h4>Risk Level</h4>
        <select
          value={riskLevel}
          onChange={(e) => handleRiskLevelChange(e.target.value)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="stop-loss">
        <h4>Stop Loss (%)</h4>
        <input
          type="number"
          value={stopLoss}
          onChange={(e) => handleStopLossChange(Number(e.target.value))}
        />
      </div>

      <div className="take-profit">
        <h4>Take Profit (%)</h4>
        <input
          type="number"
          value={takeProfit}
          onChange={(e) => handleTakeProfitChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

export default RiskManagement;
