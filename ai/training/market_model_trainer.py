import sys
sys.path.append('..')  # Add parent directory to Python path

from models.market_predictor import MarketPredictor
import numpy as np
import pandas as pd
import argparse

def load_data(file_path):
    df = pd.read_csv(file_path)
    return df['close'].values  # Assuming 'close' is the column with price data

def main(args):
    # Load the data
    data = load_data(args.data_path)
    print(f"Loaded {len(data)} data points for training.")

    # Initialize the market predictor
    predictor = MarketPredictor(sequence_length=args.sequence_length)

    # Train the model
    print("Starting training...")
    predictor.train(data, epochs=args.epochs, batch_size=args.batch_size)

    # Save the trained model
    predictor.save_model(args.output_path)
    print(f"Trained model saved to {args.output_path}")

    # Optional: Make a test prediction
    if args.test_prediction:
        last_sequence = data[-predictor.sequence_length:]
        prediction = predictor.predict(last_sequence)
        print(f"Prediction for next data point: {prediction[0][0]}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train the market prediction model")
    parser.add_argument("--data_path", type=str, required=True, help="Path to the training data CSV file")
    parser.add_argument("--sequence_length", type=int, default=60, help="Sequence length for LSTM input")
    parser.add_argument("--epochs", type=int, default=50, help="Number of training epochs")
    parser.add_argument("--batch_size", type=int, default=32, help="Batch size for training")
    parser.add_argument("--output_path", type=str, required=True, help="Path to save the trained model")
    parser.add_argument("--test_prediction", action="store_true", help="Make a test prediction after training")

    args = parser.parse_args()
    main(args)