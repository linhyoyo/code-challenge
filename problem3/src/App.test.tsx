import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

jest.mock('./RefactoredWalletPage', () => {
  return function MockWalletPage({ children }: { children?: React.ReactNode }) {
    return (
      <div data-testid="wallet-page">
        {children}
        <div data-testid="wallet-rows">
          <div>Mock Wallet Row 1</div>
          <div>Mock Wallet Row 2</div>
        </div>
      </div>
    );
  };
});

describe('App Component', () => {
  test('renders wallet page demo', () => {
    render(<App />);
    
    expect(screen.getByText('Wallet Page Demo')).toBeInTheDocument();
    expect(screen.getByText('Demonstrating the refactored WalletPage component')).toBeInTheDocument();
  });

  test('renders wallet page with header content', () => {
    render(<App />);
    
    expect(screen.getByText('Your Wallet Balances')).toBeInTheDocument();
    expect(screen.getByText('Sorted by blockchain priority (Osmosis → Ethereum → Arbitrum → Zilliqa → Neo)')).toBeInTheDocument();
  });

  test('renders wallet page component', () => {
    render(<App />);
    
    expect(screen.getByTestId('wallet-page')).toBeInTheDocument();
  });

  test('applies correct styling classes', () => {
    const { container } = render(<App />);
    
    expect(container.querySelector('.App')).toBeInTheDocument();
    expect(container.querySelector('.App-header')).toBeInTheDocument();
    expect(container.querySelector('.App-main')).toBeInTheDocument();
  });
});
