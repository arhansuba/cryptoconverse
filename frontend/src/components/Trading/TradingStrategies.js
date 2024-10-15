import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

function ExchangeConnector() {
  const [exchanges, setExchanges] = useState([]);
  const [selectedExchange, setSelectedExchange] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchSupportedExchanges();
  }, []);

  const fetchSupportedExchanges = async () => {
    try {
      const response = await apiService.getSupportedExchanges();
      setExchanges(response.data);
    } catch (error) {
      console.error('Error fetching supported exchanges:', error);
    }
  };

  const handleConnect = async () => {
    try {
      const response = await apiService.connectExchange(selectedExchange, apiKey, apiSecret);
      if (response.data.success) {
        setIsConnected(true);
        // You might want to store the connection status in a global state or context
      }
    } catch (error) {
      console.error('Error connecting to exchange:', error);
    }
  };

  return (
    <div className="exchange-connector">
      <h3>Connect to Exchange</h3>
      <select value={selectedExchange} onChange={(e) => setSelectedExchange(e.target.value)}>
        <option value="">Select an exchange</option>
        {exchanges.map((exchange) => (
          <option key={exchange.id} value={exchange.id}>{exchange.name}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
      />
      <input
        type="password"
        placeholder="API Secret"
        value={apiSecret}
        onChange={(e) => setApiSecret(e.target.value)}
      />
      <button onClick={handleConnect} disabled={!selectedExchange || !apiKey || !apiSecret}>
        Connect
      </button>
      {isConnected && <div className="success-message">Successfully connected to {selectedExchange}!</div>}
    </div>
  );
}

export default ExchangeConnector;