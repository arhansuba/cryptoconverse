import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { apiService } from '../../services/api';

function PriceChart({ symbol }) {
  const [chartData, setChartData] = useState(null);
  const [timeframe, setTimeframe] = useState('1d'); // Default to 1 day

  useEffect(() => {
    fetchPriceData();
  }, [symbol, timeframe]);

  const fetchPriceData = async () => {
    try {
      const response = await apiService.getMarketData(symbol, timeframe);
      const data = response.data;
      setChartData({
        labels: data.map(item => new Date(item.timestamp).toLocaleString()),
        datasets: [{
          label: `${symbol} Price`,
          data: data.map(item => item.price),
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      });
    } catch (error) {
      console.error('Error fetching price data:', error);
    }
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${symbol} Price Chart`,
      },
    },
  };

  return (
    <div className="price-chart">
      <div className="timeframe-selector">
        <button onClick={() => setTimeframe('1d')}>1D</button>
        <button onClick={() => setTimeframe('1w')}>1W</button>
        <button onClick={() => setTimeframe('1m')}>1M</button>
        <button onClick={() => setTimeframe('1y')}>1Y</button>
      </div>
      {chartData && <Line data={chartData} options={options} />}
    </div>
  );
}

export default PriceChart;