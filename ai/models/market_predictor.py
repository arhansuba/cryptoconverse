import tensorflow as tf
import numpy as np
from sklearn.preprocessing import MinMaxScaler

class MarketPredictor:
    def __init__(self, sequence_length=60):
        self.sequence_length = sequence_length
        self.model = self._build_model()
        self.scaler = MinMaxScaler(feature_range=(0, 1))

    def _build_model(self):
        model = tf.keras.Sequential([
            tf.keras.layers.LSTM(50, return_sequences=True, input_shape=(self.sequence_length, 1)),
            tf.keras.layers.LSTM(50, return_sequences=False),
            tf.keras.layers.Dense(25),
            tf.keras.layers.Dense(1)
        ])
        model.compile(optimizer='adam', loss='mean_squared_error')
        return model

    def preprocess_data(self, data):
        scaled_data = self.scaler.fit_transform(data.reshape(-1, 1))
        x, y = [], []
        for i in range(self.sequence_length, len(scaled_data)):
            x.append(scaled_data[i-self.sequence_length:i, 0])
            y.append(scaled_data[i, 0])
        return np.array(x), np.array(y)

    def train(self, data, epochs=50, batch_size=32):
        x, y = self.preprocess_data(data)
        self.model.fit(x, y, epochs=epochs, batch_size=batch_size)

    def predict(self, data):
        x, _ = self.preprocess_data(data)
        predictions = self.model.predict(x)
        return self.scaler.inverse_transform(predictions)

    def save_model(self, path):
        self.model.save(path)

    @classmethod
    def load_model(cls, path):
        instance = cls.__new__(cls)
        instance.model = tf.keras.models.load_model(path)
        instance.scaler = MinMaxScaler(feature_range=(0, 1))
        return instance