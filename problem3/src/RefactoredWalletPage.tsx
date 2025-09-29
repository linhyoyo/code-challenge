import React, { useMemo, useCallback } from 'react';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  blockchain: string;
}

interface BoxProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface Props extends BoxProps {
  
}

const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20,
} as const;

const DEFAULT_PRIORITY = -99;

const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? DEFAULT_PRIORITY;
};

// Mock data for demo
const mockBalances: WalletBalance[] = [
  { currency: 'OSMO', amount: 150.25, blockchain: 'Osmosis' },
  { currency: 'ETH', amount: 2.5, blockchain: 'Ethereum' },
  { currency: 'ARB', amount: 1000, blockchain: 'Arbitrum' },
  { currency: 'ZIL', amount: 5000, blockchain: 'Zilliqa' },
  { currency: 'NEO', amount: 25.75, blockchain: 'Neo' },
  { currency: 'BTC', amount: 0.1, blockchain: 'Bitcoin' },
  { currency: 'USDC', amount: 0, blockchain: 'Ethereum' },
];

const mockPrices: Record<string, number> = {
  'OSMO': 0.5,
  'ETH': 2000,
  'ARB': 1.2,
  'ZIL': 0.02,
  'NEO': 15,
  'BTC': 45000,
  'USDC': 1,
};

const useWalletBalances = (): WalletBalance[] => {
  return mockBalances;
};

const usePrices = (): Record<string, number> => {
  return mockPrices;
};

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

const WalletPage: React.FC<Props> = ({ children, ...rest }) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const calculatePriority = useCallback((blockchain: string) => {
    return getPriority(blockchain);
  }, []);

  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = calculatePriority(balance.blockchain);
        return balancePriority > DEFAULT_PRIORITY && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = calculatePriority(lhs.blockchain);
        const rightPriority = calculatePriority(rhs.blockchain);
        
        return rightPriority - leftPriority;
      });
  }, [balances, calculatePriority]);

  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance): FormattedWalletBalance => ({
      ...balance,
      formatted: balance.amount.toFixed(2),
    }));
  }, [sortedBalances]);

  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow 
          key={`${balance.currency}-${balance.blockchain}`}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    });
  }, [formattedBalances, prices]);

  return (
    <div {...rest}>
      {children}
      {rows}
    </div>
  );
};

export default WalletPage;
