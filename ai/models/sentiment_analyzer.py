import tensorflow as tf
from transformers import TFAutoModelForSequenceClassification, AutoTokenizer
import numpy as np

class SentimentAnalyzer:
    def __init__(self, model_name="distilbert-base-uncased-finetuned-sst-2-english"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = TFAutoModelForSequenceClassification.from_pretrained(model_name)

    def analyze(self, text):
        inputs = self.tokenizer(text, return_tensors="tf", truncation=True, padding=True)
        outputs = self.model(inputs)
        probabilities = tf.nn.softmax(outputs.logits, axis=-1)
        sentiment_score = tf.reduce_sum(probabilities * tf.constant([[0, 1]], dtype=tf.float32))
        return sentiment_score.numpy()[0]

    def batch_analyze(self, texts):
        inputs = self.tokenizer(texts, return_tensors="tf", truncation=True, padding=True)
        outputs = self.model(inputs)
        probabilities = tf.nn.softmax(outputs.logits, axis=-1)
        sentiment_scores = tf.reduce_sum(probabilities * tf.constant([[0, 1]], dtype=tf.float32), axis=-1)
        return sentiment_scores.numpy()

    def fine_tune(self, dataset, epochs=3, batch_size=16):
        # Assuming dataset is a list of dictionaries with 'text' and 'label' keys
        train_texts = [item['text'] for item in dataset]
        train_labels = [item['label'] for item in dataset]

        train_encodings = self.tokenizer(train_texts, truncation=True, padding=True)
        train_dataset = tf.data.Dataset.from_tensor_slices((
            dict(train_encodings),
            train_labels
        )).shuffle(1000).batch(batch_size)

        optimizer = tf.keras.optimizers.Adam(learning_rate=5e-5)
        loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)
        metrics = [tf.keras.metrics.SparseCategoricalAccuracy('accuracy')]

        self.model.compile(optimizer=optimizer, loss=loss, metrics=metrics)
        self.model.fit(train_dataset, epochs=epochs)

    def save_model(self, path):
        self.model.save_pretrained(path)
        self.tokenizer.save_pretrained(path)

    @classmethod
    def load_model(cls, path):
        instance = cls.__new__(cls)
        instance.tokenizer = AutoTokenizer.from_pretrained(path)
        instance.model = TFAutoModelForSequenceClassification.from_pretrained(path)
        return instance