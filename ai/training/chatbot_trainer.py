import sys
sys.path.append('..')  # Add parent directory to Python path

from models.chatbot import Chatbot
import json
import argparse

def load_dataset(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

def main(args):
    # Initialize the chatbot
    chatbot = Chatbot(model_name=args.model_name)

    # Load the dataset
    dataset = load_dataset(args.data_path)

    print(f"Loaded {len(dataset)} conversation pairs for training.")

    # Fine-tune the model
    print("Starting fine-tuning...")
    chatbot.fine_tune(dataset, epochs=args.epochs, batch_size=args.batch_size)

    # Save the fine-tuned model
    chatbot.save_model(args.output_path)
    print(f"Fine-tuned model saved to {args.output_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fine-tune the chatbot model")
    parser.add_argument("--model_name", type=str, default="gpt2", help="Base model to use")
    parser.add_argument("--data_path", type=str, required=True, help="Path to the training data JSON file")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=4, help="Batch size for training")
    parser.add_argument("--output_path", type=str, required=True, help="Path to save the fine-tuned model")

    args = parser.parse_args()
    main(args)