import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { useUser } from './contexts/UserContext';
import ChatInterface from './components/AIChat/ChatInterface';
import LessonModule from './components/Education/LessonModule';
import PriceChart from './components/MarketAnalysis/PriceChart';
import TradingStrategies from './components/Trading/TradingStrategies';
import MultiChainWallet from './components/Wallet/MultiChainWallet';
import Forum from './components/Community/Forum';
import Leaderboard from './components/Community/Leaderboard';

function App() {
  const { user, login, logout } = useUser();

  return (
    <Router>
      <div className="App">
        <header>
          <h1>CryptoConverse</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/learn">Learn</Link>
            <Link to="/market">Market</Link>
            <Link to="/trade">Trade</Link>
            <Link to="/wallet">Wallet</Link>
            <Link to="/community">Community</Link>
          </nav>
          {user ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <button onClick={() => login({ username: 'demo_user' })}>Login</button>
          )}
        </header>

        <main>
          <Switch>
            <Route exact path="/" component={ChatInterface} />
            <Route path="/learn" component={LessonModule} />
            <Route path="/market" component={PriceChart} />
            <Route path="/trade" component={TradingStrategies} />
            <Route path="/wallet" component={MultiChainWallet} />
            <Route path="/community" component={CommunityPage} />
          </Switch>
        </main>

        <footer>
          <p>&copy; 2024 CryptoConverse. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

function CommunityPage() {
  return (
    <div className="community-page">
      <Forum />
      <Leaderboard />
    </div>
  );
}

export default App;