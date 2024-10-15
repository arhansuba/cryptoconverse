const Web3 = require('web3');

exports.validateAddress = (address) => {
  return Web3.utils.isAddress(address);
};

exports.convertWeiToEther = (weiAmount) => {
  return Web3.utils.fromWei(weiAmount, 'ether');
};

exports.convertEtherToWei = (etherAmount) => {
  return Web3.utils.toWei(etherAmount.toString(), 'ether');
};

exports.estimateGas = async (web3, transaction) => {
  try {
    const gasEstimate = await web3.eth.estimateGas(transaction);
    return gasEstimate;
  } catch (error) {
    console.error('Error estimating gas:', error);
    throw error;
  }
};

exports.getGasPrice = async (web3) => {
  try {
    const gasPrice = await web3.eth.getGasPrice();
    return gasPrice;
  } catch (error) {
    console.error('Error getting gas price:', error);
    throw error;
  }
};