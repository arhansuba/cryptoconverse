import React, { useState, useEffect } from 'react';
import { useWeb3 } from '../../contexts/Web3Context';
import { apiService } from '../../services/api';

function MultiChainWallet() {
  const { account, isConnected, connectWallet } = useWeb3();
  const [balances, setBalances] = useState({});
  const [selectedChain, setSelectedChain] = useState('ethereum');
  const [isLoading, setIsLoading] = useState(false);

  const supportedChains = ['ethereum', 'binance', 'polygon', 'avalanche'];

  useEffect(() => {
    if (isConnected) {
      fetchBalances();
    }
  }, [isConnected, selectedChain]);

  const fetchBalances = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.getWalletBalances(account, selectedChain);
      setBalances(response.data);
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChainChange = (chain) => {
    setSelectedChain(chain);
  };

  return (
    <div className="multi-chain-wallet">
      <h2>Multi-Chain Wallet</h2>
      {!isConnected ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <>
          <p>Connected Account: {account}</p>
          <div className="chain-selector">
            {supportedChains.map((chain) => (
              <button
                key={chain}
                onClick={() => handleChainChange(chain)}
                className={selectedChain === chain ? 'active' : ''}
              >
                {chain.charAt(0).toUpperCase() + chain.slice(1)}
              </button>
            ))}
          </div>
          {isLoading ? (
            <p>Loading balances...</p>
          ) : (
            <div className="balances">
              <h3>{selectedChain.charAt(0).toUpperCase() + selectedChain.slice(1)} Balances</h3>
              {Object.entries(balances).map(([token, balance]) => (
                <div key={token} className="balance-item">
                  <span>{token}:</span>
                  <span>{balance}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MultiChainWallet;