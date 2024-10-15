import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [timeframe, setTimeframe] = useState('weekly');
  const [category, setCategory] = useState('trading');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchLeaderboardData();
  }, [timeframe, category]);

  const fetchLeaderboardData = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getLeaderboard(timeframe, category);
      setLeaderboardData(response.data);
    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderLeaderboardTable = () => (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>User</th>
          <th>Score</th>
          <th>Achievements</th>
        </tr>
      </thead>
      <tbody>
        {leaderboardData.map((entry, index) => (
          <tr key={entry.userId}>
            <td>{index + 1}</td>
            <td>{entry.username}</td>
            <td>{entry.score}</td>
            <td>{entry.achievements.join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="leaderboard">
      <h2>Community Leaderboard</h2>
      <div className="leaderboard-controls">
        <div className="timeframe-selector">
          <label>Timeframe:</label>
          <select value={timeframe} onChange={(e) => setTimeframe(e.target.value)}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="allTime">All Time</option>
          </select>
        </div>
        <div className="category-selector">
          <label>Category:</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="trading">Trading</option>
            <option value="learning">Learning</option>
            <option value="social">Social Engagement</option>
          </select>
        </div>
      </div>
      {isLoading ? (
        <p>Loading leaderboard data...</p>
      ) : (
        renderLeaderboardTable()
      )}
    </div>
  );
}

export default Leaderboard;