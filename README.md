# CryptoConverse: Multi-Chain Wallet and AI-Powered Crypto Education Platform

CryptoConverse is a comprehensive web application that combines blockchain technology, artificial intelligence, and educational components focused on cryptocurrency trading and analysis.

## Features

- Multi-chain wallet support
- AI-powered chat interface for crypto education
- Market analysis tools with price charts and trend analysis
- Token swapping functionality
- Educational modules with quizzes and AI explanations
- Community features including forums and leaderboards

## Tech Stack

- Frontend: React.js, TensorFlow.js, Web3.js, Chart.js
- Backend: Node.js, Express, MongoDB
- Blockchain: Solidity for smart contracts, Hardhat for development and deployment
- AI: Python with TensorFlow, PyTorch, and NLP libraries

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Python 3.8+
- Yarn package manager
- MetaMask or another Web3 wallet

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/cryptoconverse.git
   cd cryptoconverse
   ```

2. Run the setup script:
   ```
   ./scripts/setup.sh
   ```

3. Update the configuration files in the `config` directory with your specific settings.

4. Install frontend dependencies:
   ```
   cd frontend
   yarn install
   ```

5. Install backend dependencies:
   ```
   cd ../backend
   yarn install
   ```

6. Set up Python environment for AI components:
   ```
   cd ../ai
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the backend server:
   ```
   cd backend
   yarn start
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   yarn start
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Deployment

To deploy the smart contracts:

```
./scripts/deploy.sh <network> [production]
```

Replace `<network>` with the desired network (e.g., mainnet, goerli, polygon) and add `production` if deploying to a production environment.

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

- OpenZeppelin for secure smart contract libraries
- Infura for blockchain infrastructure
- Anthropic's Claude for AI assistance in development