import { useState, useCallback } from 'react';
import Web3 from 'web3';

export function useBlockchain() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  const connectWallet = useCallback(async () => {
    setError(null);
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        setIsConnected(true);
      } catch (err) {
        console.error('Failed to connect wallet:', err);
        setError('Failed to connect wallet');
      }
    } else {
      setError('Please install MetaMask');
    }
  }, []);

  const getBalance = useCallback(async () => {
    if (!web3 || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      const balance = await web3.eth.getBalance(account);
      return web3.utils.fromWei(balance, 'ether');
    } catch (err) {
      console.error('Failed to get balance:', err);
      throw new Error('Failed to get balance');
    }
  }, [web3, account]);

  const sendTransaction = useCallback(async (to, amount) => {
    if (!web3 || !account) {
      throw new Error('Wallet not connected');
    }

    try {
      const tx = await web3.eth.sendTransaction({
        from: account,
        to,
        value: web3.utils.toWei(amount, 'ether')
      });
      return tx;
    } catch (err) {
      console.error('Failed to send transaction:', err);
      throw new Error('Failed to send transaction');
    }
  }, [web3, account]);

  return { connectWallet, getBalance, sendTransaction, account, isConnected, error };
}