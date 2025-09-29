import React from 'react';
import WalletPage from './RefactoredWalletPage';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Wallet Page Demo</h1>
        <p>Demonstrating the refactored WalletPage component</p>
      </header>
      <main className="App-main">
        <WalletPage>
          <div className="wallet-header">
            <h2>Your Wallet Balances</h2>
            <p>Sorted by blockchain priority (Osmosis → Ethereum → Arbitrum → Zilliqa → Neo)</p>
          </div>
        </WalletPage>
      </main>
    </div>
  );
}

export default App;
