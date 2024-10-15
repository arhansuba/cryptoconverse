import sys
sys.path.append('..')  # Add parent directory to Python path

from models.chatbot import Chatbot
import argparse

def main(args):
    # Load the trained chatbot model
    chatbot = Chatbot.load_model(args.model_path)
    print(f"Loaded chatbot model from {args.model_path}")

    if args.interactive:
        print("Starting interactive mode. Type 'quit' to exit.")
        while True:
            user_input = input("You: ")
            if user_input.lower() == 'quit':
                break
            response = chatbot.generate_response(user_input, max_length=args.max_length)
            print(f"Chatbot: {response}")
    elif args.input:
        response = chatbot.generate_response(args.input, max_length=args.max_length)
        print(f"Chatbot: {response}")
    else:
        print("Please provide input text using --input or use --interactive for interactive mode.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run inference with the trained chatbot model")
    parser.add_argument("--model_path", type=str, required=True, help="Path to the trained model")
    parser.add_argument("--input", type=str, help="Input text for the chatbot")
    parser.add_argument("--interactive", action="store_true", help="Run in interactive mode")
    parser.add_argument("--max_length", type=int, default=100, help="Maximum length of generated response")

    args = parser.parse_args()
    main(args)