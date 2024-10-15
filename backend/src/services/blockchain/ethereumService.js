const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.ETHEREUM_NODE_URL));

exports.getBalance = async (address) => {
  try {
    const balance = await web3.eth.getBalance(address);
    return web3.utils.fromWei(balance, 'ether');
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
};

exports.sendTransaction = async (from, to, amount, privateKey) => {
  try {
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
    console.error('Error sending transaction:', error);
    throw error;
  }
};

exports.generateDummyTransactionHash = () => {
  return '0x' + Array(64).fill(0).map(() => Math.random().toString(16)[2]).join('');
};