const Web3 = require('web3');

const chains = {
  ethereum: new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_NODE_URL)),
  binance: new Web3(new Web3.providers.HttpProvider(process.env.BINANCE_NODE_URL)),
  // Add more chains as needed
};

exports.getBalance = async (chain, address) => {
  if (!chains[chain]) {
    throw new Error(`Unsupported chain: ${chain}`);
  }
  
  try {
    const balance = await chains[chain].eth.getBalance(address);
    return chains[chain].utils.fromWei(balance, 'ether');
  } catch (error) {
    console.error(`Error fetching balance on ${chain}:`, error);
    throw error;
  }
};

exports.sendTransaction = async (chain, from, to, amount, privateKey) => {
  if (!chains[chain]) {
    throw new Error(`Unsupported chain: ${chain}`);
  }
  
  try {
    const web3 = chains[chain];
    const nonce = await web3.eth.getTransactionCount(from, 'latest');
    const gasPrice = await web3.eth.getGasPrice();
    const value = web3.utils.toWei(amount.toString(), 'ether');
    
    const transaction = {
      from,
      to,
      value,
      gasPrice,
      nonce,
      gas: 21000 // standard gas limit for simple transfers
    };
    
    const signedTx = await web3.eth.accounts.signTransaction(transaction, privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    return receipt;
  } catch (error) {
    console.error(`Error sending transaction on ${chain}:`, error);
    throw error;
  }
};