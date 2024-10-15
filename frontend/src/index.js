import React from 'react';
import ReactDOM from 'react-dom';
import { UserProvider } from './contexts/UserContext';
import { Web3Provider } from './contexts/Web3Context';
import App from './App';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      <Web3Provider>
        <App />
      </Web3Provider>
    </UserProvider>
  </React.StrictMode>,
  document.getElementById('root')
);