import sys
sys.path.append('..')  # Add parent directory to Python path

from models.sentiment_analyzer import SentimentAnalyzer
import json
import argparse

def load_dataset(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

def main(args):
    # Initialize the sentiment analyzer
    analyzer = SentimentAnalyzer(model_name=args.model_name)

    # Load the dataset
    dataset = load_dataset(args.data_path)

    print(f"Loaded {len(dataset)} samples for training.")

    # Fine-tune the model
    print("Starting fine-tuning...")
    analyzer.fine_tune(dataset, epochs=args.epochs, batch_size=args.batch_size)

    # Save the fine-tuned model
    analyzer.save_model(args.output_path)
    print(f"Fine-tuned model saved to {args.output_path}")

    # Optional: Test the model on a sample text
    if args.test_text:
        sentiment_score = analyzer.analyze(args.test_text)
        print(f"Sentiment score for '{args.test_text}': {sentiment_score}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Fine-tune the sentiment analysis model")
    parser.add_argument("--model_name", type=str, default="distilbert-base-uncased-finetuned-sst-2-english", help="Base model to use")
    parser.add_argument("--data_path", type=str, required=True, help="Path to the training data JSON file")
    parser.add_argument("--epochs", type=int, default=3, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=16, help="Batch size for training")
    parser.add_argument("--output_path", type=str, required=True, help="Path to save the fine-tuned model")
    parser.add_argument("--test_text", type=str, help="Optional text to test the model after training")

    args = parser.parse_args()
    main(args)