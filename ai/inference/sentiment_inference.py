import sys
sys.path.append('..')  # Add parent directory to Python path

from models.sentiment_analyzer import SentimentAnalyzer
import argparse
import json

def load_texts(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

def main(args):
    # Load the trained sentiment analyzer model
    analyzer = SentimentAnalyzer.load_model(args.model_path)
    print(f"Loaded sentiment analyzer model from {args.model_path}")

    if args.interactive:
        print("Starting interactive mode. Type 'quit' to exit.")
        while True:
            user_input = input("Enter text: ")
            if user_input.lower() == 'quit':
                break
            sentiment_score = analyzer.analyze(user_input)
            print(f"Sentiment score: {sentiment_score}")
    elif args.input:
        sentiment_score = analyzer.analyze(args.input)
        print(f"Sentiment score for '{args.input}': {sentiment_score}")
    elif args.input_file:
        texts = load_texts(args.input_file)
        print(f"Loaded {len(texts)} texts for analysis.")
        sentiment_scores = analyzer.batch_analyze(texts)
        for text, score in zip(texts, sentiment_scores):
            print(f"Text: '{text}'\nSentiment score: {score}\n")
    else:
        print("Please provide input text using --input, --input_file, or use --interactive for interactive mode.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run inference with the trained sentiment analysis model")
    parser.add_argument("--model_path", type=str, required=True, help="Path to the trained model")
    parser.add_argument("--input", type=str, help="Input text for sentiment analysis")
    parser.add_argument("--input_file", type=str, help="Path to JSON file containing texts for batch analysis")
    parser.add_argument("--interactive", action="store_true", help="Run in interactive mode")

    args = parser.parse_args()
    main(args)