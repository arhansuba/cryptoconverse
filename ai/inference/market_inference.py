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
    # Load the trained market predictor model
    predictor = MarketPredictor.load_model(args.model_path)
    print(f"Loaded market predictor model from {args.model_path}")

    # Load the input data
    data = load_data(args.input_data)
    print(f"Loaded {len(data)} data points for prediction.")

    # Make predictions
    prediction = predictor.predict(data[-predictor.sequence_length:])
    print(f"Prediction for next data point: {prediction[0][0]}")

    if args.forecast_steps > 1:
        forecasts = [prediction[0][0]]
        current_sequence = data[-predictor.sequence_length:].tolist()
        
        for _ in range(args.forecast_steps - 1):
            current_sequence = current_sequence[1:] + [forecasts[-1]]
            next_prediction = predictor.predict(np.array(current_sequence))
            forecasts.append(next_prediction[0][0])
        
        print("Forecasts for the next {} steps:".format(args.forecast_steps))
        for i, forecast in enumerate(forecasts, 1):
            print(f"Step {i}: {forecast}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run inference with the trained market prediction model")
    parser.add_argument("--model_path", type=str, required=True, help="Path to the trained model")
    parser.add_argument("--input_data", type=str, required=True, help="Path to the input data CSV file")
    parser.add_argument("--forecast_steps", type=int, default=1, help="Number of steps to forecast into the future")

    args = parser.parse_args()
    main(args)