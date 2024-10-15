const tf = require('@tensorflow/tfjs-node');

exports.preprocessData = (data) => {
  // Normalize data to range [0, 1]
  const min = Math.min(...data);
  const max = Math.max(...data);
  return data.map(value => (value - min) / (max - min));
};

exports.createSequences = (data, sequenceLength) => {
  const sequences = [];
  const targets = [];

  for (let i = sequenceLength; i < data.length; i++) {
    sequences.push(data.slice(i - sequenceLength, i));
    targets.push(data[i]);
  }

  return [tf.tensor2d(sequences), tf.tensor1d(targets)];
};

exports.evaluateModel = (model, testData, testLabels) => {
  const evaluation = model.evaluate(testData, testLabels);
  return {
    loss: evaluation[0].dataSync()[0],
    accuracy: evaluation[1].dataSync()[0]
  };
};