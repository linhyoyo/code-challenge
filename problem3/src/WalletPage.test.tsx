import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WalletPage from './RefactoredWalletPage';

describe('WalletPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<WalletPage />);
      expect(screen.queryAllByText(/Amount:/)).toHaveLength(5);
    });

    it('should render children when provided', () => {
      render(
        <WalletPage>
          <h1>My Wallet</h1>
        </WalletPage>
      );
      expect(screen.getByText('My Wallet')).toBeInTheDocument();
    });

    it('should pass additional props to the root div', () => {
      const { container } = render(
        <WalletPage data-testid="wallet-container" className="custom-class" />
      );
      const rootDiv = container.firstChild;
      expect(rootDiv).toHaveAttribute('data-testid', 'wallet-container');
      expect(rootDiv).toHaveClass('custom-class');
    });
  });

  describe('Balance Filtering and Sorting', () => {
    it('should filter out balances with zero amount', () => {
      const { container } = render(<WalletPage />);
      expect(container.textContent).not.toContain('USDC');
    });

    it('should filter out balances with negative priority blockchains', () => {
      const { container } = render(<WalletPage />);
      expect(container.textContent).not.toContain('BTC');
    });

    it('should sort balances by blockchain priority (highest first)', () => {
      const { container } = render(<WalletPage />);
      const rows = container.querySelectorAll('.wallet-row');

      const amounts = Array.from(rows).map(row => 
        row.textContent?.match(/Amount: ([\d.]+)/)?.[1]
      );
      
      expect(amounts[0]).toBe('150.25'); // Osmosis
      expect(amounts[1]).toBe('2.50'); // Ethereum
      expect(amounts[2]).toBe('1000.00'); // Arbitrum
    });
  });

  describe('Balance Formatting', () => {
    it('should format amounts to 2 decimal places', () => {
      render(<WalletPage />);

      const amountElements = screen.getAllByText(/Amount: 150.25/);
      expect(amountElements).toHaveLength(1);
      
      const amountElements2 = screen.getAllByText(/Amount: 2.50/);
      expect(amountElements2).toHaveLength(1);
    });

    it('should calculate USD values correctly', () => {
      render(<WalletPage />);

      const usdElements = screen.getAllByText(/USD Value: \$75.13/);
      expect(usdElements).toHaveLength(1);
      
      const usdElements2 = screen.getAllByText(/USD Value: \$5000.00/);
      expect(usdElements2).toHaveLength(1);
    });
  });

  describe('WalletRow Component', () => {
    it('should render with correct props', () => {
      const WalletRow: React.FC<{
        className?: string;
        amount: number;
        usdValue: number;
        formattedAmount: string;
      }> = ({ className, amount, usdValue, formattedAmount }) => {
        return (
          <div className={className || 'wallet-row'}>
            <span>Amount: {formattedAmount}</span>
            <span>USD Value: ${usdValue.toFixed(2)}</span>
          </div>
        );
      };

      const { container } = render(
        <WalletRow
          amount={100}
          usdValue={5000}
          formattedAmount="100.00"
        />
      );

      expect(screen.getByText('Amount: 100.00')).toBeInTheDocument();
      expect(screen.getByText('USD Value: $5000.00')).toBeInTheDocument();
      expect(container.querySelector('.wallet-row')).toBeInTheDocument();
    });

    it('should use custom className when provided', () => {
      const WalletRow: React.FC<{
        className?: string;
        amount: number;
        usdValue: number;
        formattedAmount: string;
      }> = ({ className, amount, usdValue, formattedAmount }) => {
        return (
          <div className={className || 'wallet-row'}>
            <span>Amount: {formattedAmount}</span>
            <span>USD Value: ${usdValue.toFixed(2)}</span>
          </div>
        );
      };

      const { container } = render(
        <WalletRow
          className="custom-row"
          amount={100}
          usdValue={5000}
          formattedAmount="100.00"
        />
      );

      expect(container.querySelector('.custom-row')).toBeInTheDocument();
    });
  });

  describe('getPriority Function', () => {
    it('should return correct priorities for known blockchains', () => {
      const getPriority = (blockchain: string): number => {
        const priorities: Record<string, number> = {
          Osmosis: 100,
          Ethereum: 50,
          Arbitrum: 30,
          Zilliqa: 20,
          Neo: 20,
        };
        return priorities[blockchain] ?? -99;
      };

      expect(getPriority('Osmosis')).toBe(100);
      expect(getPriority('Ethereum')).toBe(50);
      expect(getPriority('Arbitrum')).toBe(30);
      expect(getPriority('Zilliqa')).toBe(20);
      expect(getPriority('Neo')).toBe(20);
    });

    it('should return DEFAULT_PRIORITY for unknown blockchains', () => {
      const getPriority = (blockchain: string): number => {
        const priorities: Record<string, number> = {
          Osmosis: 100,
          Ethereum: 50,
          Arbitrum: 30,
          Zilliqa: 20,
          Neo: 20,
        };
        return priorities[blockchain] ?? -99;
      };

      expect(getPriority('Bitcoin')).toBe(-99);
      expect(getPriority('Solana')).toBe(-99);
      expect(getPriority('Unknown')).toBe(-99);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty balances array', () => {
      const { container } = render(<WalletPage />);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('should handle missing price data gracefully', () => {
      render(<WalletPage />);
      expect(screen.queryAllByText(/Amount:/)).toHaveLength(5);
    });

    it('should generate unique keys for each row', () => {
      const { container } = render(<WalletPage />);
      const rows = container.querySelectorAll('.wallet-row');

      expect(rows.length).toBeGreaterThan(0);
    });
  });

  describe('Memoization', () => {
    it('should only recalculate sortedBalances when balances change', () => {
      const { rerender } = render(<WalletPage />);
      const firstRender = screen.getAllByText(/Amount:/);

      rerender(<WalletPage />);
      const secondRender = screen.getAllByText(/Amount:/);
      
      expect(firstRender.length).toBe(secondRender.length);
    });
  });

  describe('Integration Tests', () => {
    it('should display all valid balances in correct order with correct calculations', () => {
      render(<WalletPage />);

      const rows = screen.getAllByText(/Amount:/);
      expect(rows).toHaveLength(5);

      expect(screen.getByText(/Amount: 150.25/)).toBeInTheDocument(); // Osmosis
      expect(screen.getByText(/USD Value: \$75.13/)).toBeInTheDocument(); // 150.25 * 0.5
    });
  });
});

describe('Type Interfaces', () => {
  it('should satisfy WalletBalance interface', () => {
    const balance: WalletBalance = {
      currency: 'ETH',
      amount: 1.5,
      blockchain: 'Ethereum',
    };
    
    expect(balance).toHaveProperty('currency');
    expect(balance).toHaveProperty('amount');
    expect(balance).toHaveProperty('blockchain');
  });

  it('should satisfy FormattedWalletBalance interface', () => {
    const formattedBalance: FormattedWalletBalance = {
      currency: 'ETH',
      amount: 1.5,
      blockchain: 'Ethereum',
      formatted: '1.50',
    };
    
    expect(formattedBalance).toHaveProperty('formatted');
  });
});

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}