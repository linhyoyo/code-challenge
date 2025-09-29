# React Code Optimization

## Original Code Issues and Anti-patterns

### 1. **Type Safety Issues**
- **Problem**: `getPriority` function uses `any` type for blockchain parameter
- **Impact**: Loss of type safety, potential runtime errors
- **Solution**: Use proper string type and create a const assertion for blockchain priorities

**Before:**
```typescript
const getPriority = (blockchain: any): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100
    case 'Ethereum':
      return 50
    // ...
  }
}
```

**After:**
```typescript
const BLOCKCHAIN_PRIORITIES: Record<string, number> = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20,
} as const;

const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? DEFAULT_PRIORITY;
};
```

### 2. **Logic Errors**
- **Problem**: Variable name mismatch (`lhsPriority` instead of `balancePriority`)
- **Problem**: Incorrect filtering logic (should filter `> 0` amounts, not `<= 0`)
- **Impact**: Incorrect filtering results, showing negative or zero balances
- **Solution**: Fix variable names and correct the filtering condition

**Before:**
```typescript
const sortedBalances = useMemo(() => {
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    if (lhsPriority > -99) {  // Wrong variable name
      if (balance.amount <= 0) {  // Wrong logic - should be > 0
        return true;
      }
    }
    return false
  })
}, [balances, prices]);
```

**After:**
```typescript
const sortedBalances = useMemo(() => {
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    return balancePriority > DEFAULT_PRIORITY && balance.amount > 0;  // Fixed logic
  })
}, [balances, calculatePriority]);
```

### 3. **Performance Issues**

#### a. **Function Recreation on Every Render**
- **Problem**: `getPriority` function is defined inside the component
- **Impact**: New function created on every render, breaking memoization
- **Solution**: Move function outside component or use `useCallback`

**Before:**
```typescript
const WalletPage: React.FC<Props> = (props: Props) => {
  // ... other code
  
  const getPriority = (blockchain: any): number => {  // Recreated every render
    switch (blockchain) {
      case 'Osmosis':
        return 100
      // ...
    }
  }
  
  const sortedBalances = useMemo(() => {
    // ... uses getPriority
  }, [balances, prices]);
}
```

**After:**
```typescript
// Moved outside component
const getPriority = (blockchain: string): number => {
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? DEFAULT_PRIORITY;
};

const WalletPage: React.FC<Props> = (props: Props) => {
  const calculatePriority = useCallback((blockchain: string) => {
    return getPriority(blockchain);
  }, []);
  
  const sortedBalances = useMemo(() => {
    // ... uses calculatePriority
  }, [balances, calculatePriority]);
}
```

#### b. **Unnecessary Dependencies in useMemo**
- **Problem**: `prices` dependency in `sortedBalances` useMemo but not used
- **Impact**: Unnecessary recalculations when prices change
- **Solution**: Remove unused dependencies

**Before:**
```typescript
const sortedBalances = useMemo(() => {
  return balances.filter(/* ... */).sort(/* ... */);
}, [balances, prices]);  // prices not used in this calculation
```

**After:**
```typescript
const sortedBalances = useMemo(() => {
  return balances.filter(/* ... */).sort(/* ... */);
}, [balances, calculatePriority]);  // Only include used dependencies
```

#### c. **Missing Memoization**
- **Problem**: `formattedBalances` and `rows` are recalculated on every render
- **Impact**: Unnecessary computations and potential child re-renders
- **Solution**: Wrap in `useMemo` hooks

**Before:**
```typescript
const WalletPage: React.FC<Props> = (props: Props) => {
  // ... other code
  
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {  // ❌ No memoization
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {  // ❌ No memoization
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      <WalletRow 
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    )
  })
}
```

**After:**
```typescript
const WalletPage: React.FC<Props> = (props: Props) => {
  // ... other code
  
  const formattedBalances = useMemo(() => {  // Memoized
    return sortedBalances.map((balance: WalletBalance): FormattedWalletBalance => ({
      ...balance,
      formatted: balance.amount.toFixed(2),
    }));
  }, [sortedBalances]);

  const rows = useMemo(() => {  // Memoized
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
}
```

### 4. **Key Prop Anti-pattern**
- **Problem**: Using array index as React key
- **Impact**: Poor performance during list updates, potential rendering bugs
- **Solution**: Use unique, stable identifiers as keys

**Before:**
```typescript
const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
  return (
    <WalletRow 
      key={index}  // Using array index
      amount={balance.amount}
      usdValue={usdValue}
      formattedAmount={balance.formatted}
    />
  )
})
```

**After:**
```typescript
const rows = useMemo(() => {
  return formattedBalances.map((balance: FormattedWalletBalance) => {
    return (
      <WalletRow 
        key={`${balance.currency}-${balance.blockchain}`}  // Unique, stable key
        amount={balance.amount}
        usdValue={usdValue}
        formattedAmount={balance.formatted}
      />
    );
  });
}, [formattedBalances, prices]);
```

### 5. **Code Organization Issues**
- **Problem**: Magic numbers scattered throughout code
- **Impact**: Hard to maintain, unclear intent
- **Solution**: Extract to named constants

**Before:**
```typescript
const getPriority = (blockchain: any): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100  // Magic number
    case 'Ethereum':
      return 50   // Magic number
    case 'Arbitrum':
      return 30   // Magic number
    case 'Zilliqa':
      return 20   // Magic number
    case 'Neo':
      return 20   // Magic number
    default:
      return -99  // Magic number
  }
}

// Later in code...
if (balancePriority > -99) {  // Magic number again
  // ...
}
```

**After:**
```typescript
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

// Later in code...
if (balancePriority > DEFAULT_PRIORITY) {  // Named constant
  // ...
}
```

### 6. **Missing Properties**
- **Problem**: `WalletBalance` interface missing `blockchain` property
- **Impact**: TypeScript errors, runtime issues
- **Solution**: Add missing properties to interfaces

**Before:**
```typescript
interface WalletBalance {
  currency: string;
  amount: number;
  // Missing blockchain property
}

// Later in code...
const balancePriority = getPriority(balance.blockchain);  // TypeScript error
```

**After:**
```typescript
interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;  // Added missing property
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  blockchain: string;  // Added missing property
}
```

### 7. **Inconsistent Formatting**
- **Problem**: `toFixed()` without decimal places
- **Impact**: Poor user experience for currency display
- **Solution**: Use appropriate decimal places (e.g., `toFixed(2)`)

**Before:**
```typescript
const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
  return {
    ...balance,
    formatted: balance.amount.toFixed()  // No decimal places
  }
})
```

**After:**
```typescript
const formattedBalances = useMemo(() => {
  return sortedBalances.map((balance: WalletBalance): FormattedWalletBalance => ({
    ...balance,
    formatted: balance.amount.toFixed(2),  // 2 decimal places for currency
  }));
}, [sortedBalances]);
```