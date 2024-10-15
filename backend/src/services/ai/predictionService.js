const tf = require('@tensorflow/tfjs-node');

let model;

exports.initializeModel = async () => {
  // This is a simple example. In a real-world scenario, you'd load a pre-trained model
  model = tf.sequential();
  model.add(tf.layers.dense({units: 1, inputShape: [10]}));
  model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
  console.log('Prediction model initialized');
};

exports.trainModel = async (data, labels) => {
  const xs = tf.tensor2d(data);
  const ys = tf.tensor2d(labels);
  
  await model.fit(xs, ys, {epochs: 10});
  console.log('Model training completed');
};

exports.predictPrice = async (inputData) => {
  if (!model) {
    throw new Error('Model not initialized. Call initializeModel first.');
  }
  
  const input = tf.tensor2d([inputData]);
  const prediction = model.predict(input);
  return prediction.dataSync()[0];
};