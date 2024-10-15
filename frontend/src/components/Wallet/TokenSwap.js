import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { apiService } from '../../services/api';

function TokenSwap() {
  const { account, isConnected } = useWeb3();
  const [fromToken, setFromToken] = useState('');
  const [toToken, setToToken] = useState('');
  const [amount, setAmount] = useState('');
  const [estimatedOutput, setEstimatedOutput] = useState('');
  const [availableTokens, setAvailableTokens] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isConnected) {
      fetchAvailableTokens();
    }
  }, [isConnected]);

  const fetchAvailableTokens = async () => {
    try {
      const response = await apiService.getAvailableTokens();
      setAvailableTokens(response.data);
    } catch (error) {
      console.error('Error fetching available tokens:', error);
    }
  };

  const handleEstimateSwap = async () => {
    if (!fromToken || !toToken || !amount) return;

    setIsLoading(true);
    try {
      const response = await apiService.estimateSwap(fromToken, toToken, amount);
      setEstimatedOutput(response.data.estimatedOutput);
    } catch (error) {
      console.error('Error estimating swap:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwap = async () => {
    if (!fromToken || !toToken || !amount) return;

    setIsLoading(true);
    try {
      const response = await apiService.executeSwap(account, fromToken, toToken, amount);
      // Handle successful swap (e.g., show success message, update balances)
      console.log('Swap executed:', response.data);
    } catch (error) {
      console.error('Error executing swap:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="token-swap">
      <h2>Token Swap</h2>
      <div className="swap-form">
        <div className="form-group">
          <label>From</label>
          <select value={fromToken} onChange={(e) => setFromToken(e.target.value)}>
            <option value="">Select token</option>
            {availableTokens.map((token) => (
              <option key={token.symbol} value={token.symbol}>{token.name} ({token.symbol})</option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
          />
        </div>
        <div className="form-group">
          <label>To</label>
          <select value={toToken} onChange={(e) => setToToken(e.target.value)}>
            <option value="">Select token</option>
            {availableTokens.map((token) => (
              <option key={token.symbol} value={token.symbol}>{token.name} ({token.symbol})</option>
            ))}
          </select>
          <input
            type="text"
            value={estimatedOutput}
            readOnly
            placeholder="Estimated output"
          />
        </div>
        <button onClick={handleEstimateSwap} disabled={!fromToken || !toToken || !amount || isLoading}>
          Get Estimate
        </button>
        <button onClick={handleSwap} disabled={!fromToken || !toToken || !amount || !estimatedOutput || isLoading}>
          Swap
        </button>
      </div>
      {isLoading && <p>Processing...</p>}
    </div>
  );
}

export default TokenSwap;