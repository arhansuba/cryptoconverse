import tensorflow as tf
from transformers import TFAutoModelForCausalLM, AutoTokenizer

class Chatbot:
    def __init__(self, model_name="gpt2"):
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.model = TFAutoModelForCausalLM.from_pretrained(model_name)

    def generate_response(self, input_text, max_length=100):
        input_ids = self.tokenizer.encode(input_text, return_tensors="tf")
        
        output = self.model.generate(
            input_ids,
            max_length=max_length,
            num_return_sequences=1,
            no_repeat_ngram_size=2,
            top_k=50,
            top_p=0.95,
            temperature=0.7
        )
        
        response = self.tokenizer.decode(output[0], skip_special_tokens=True)
        return response

    def fine_tune(self, dataset, epochs=3, batch_size=4):
        # Assuming dataset is a list of dictionaries with 'input' and 'output' keys
        input_texts = [item['input'] for item in dataset]
        output_texts = [item['output'] for item in dataset]

        inputs = self.tokenizer(input_texts, padding=True, truncation=True, return_tensors="tf")
        outputs = self.tokenizer(output_texts, padding=True, truncation=True, return_tensors="tf")

        dataset = tf.data.Dataset.from_tensor_slices((inputs, outputs['input_ids']))
        dataset = dataset.shuffle(1000).batch(batch_size)

        optimizer = tf.keras.optimizers.Adam(learning_rate=3e-5)
        loss = tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True)

        self.model.compile(optimizer=optimizer, loss=[loss])
        self.model.fit(dataset, epochs=epochs)

    def save_model(self, path):
        self.model.save_pretrained(path)
        self.tokenizer.save_pretrained(path)

    @classmethod
    def load_model(cls, path):
        instance = cls.__new__(cls)
        instance.tokenizer = AutoTokenizer.from_pretrained(path)
        instance.model = TFAutoModelForCausalLM.from_pretrained(path)
        return instance