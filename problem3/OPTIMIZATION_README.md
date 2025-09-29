# React Code Optimization

## Overview

This document outlines the critical issues found in the original React wallet component code and demonstrates how they were systematically addressed through refactoring. The optimizations cover runtime errors, type safety, performance, React best practices, and code quality improvements.

## Original Code Issues and Anti-patterns

### 1. **Critical Runtime Errors**

#### a. **Undefined Variable Reference**
- **Problem**: `lhsPriority` is used in filter but never defined
- **Impact**: Runtime error, application crashes
- **Solution**: Use correct variable name `balancePriority`

**Before:**
```typescript
const sortedBalances = useMemo(() => {
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    if (lhsPriority > -99) {  // lhsPriority is undefined
      // ...
    }
  })
}, [balances, prices]);
```

**After:**
```typescript
const sortedBalances = useMemo(() => {
  return balances.filter((balance: WalletBalance) => {
    const balancePriority = getPriority(balance.blockchain);
    return balancePriority > DEFAULT_PRIORITY && balance.amount > 0;
  })
}, [balances]);
```

#### b. **Incorrect Filter Logic**
- **Problem**: Filter returns `true` when `balance.amount <= 0`, keeping zero/negative balances
- **Impact**: Shows unwanted zero/negative balances to users
- **Solution**: Fix logic to properly filter out zero/negative amounts

**Before:**
```typescript
if (balancePriority > -99) {
  if (balance.amount <= 0) {  // Wrong logic - keeps zero/negative
    return true;
  }
}
return false;
```

**After:**
```typescript
return balancePriority > DEFAULT_PRIORITY && balance.amount > 0;  // Correct logic
```

#### c. **Missing Return Value in Sort**
- **Problem**: Sort function doesn't return 0 when priorities are equal
- **Impact**: Unpredictable sorting behavior
- **Solution**: Use subtraction which returns -1, 0, or 1

**Before:**
```typescript
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  
  if (leftPriority > rightPriority) return -1;
  if (leftPriority < rightPriority) return 1;
  // Missing return 0 for equal priorities
})
```

**After:**
```typescript
.sort((lhs: WalletBalance, rhs: WalletBalance) => {
  const leftPriority = getPriority(lhs.blockchain);
  const rightPriority = getPriority(rhs.blockchain);
  
  return rightPriority - leftPriority;  // Returns -1, 0, or 1
})
```

### 2. **Type Safety Issues**

#### a. **Missing Interface Properties**
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

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}
```

#### b. **Type Mismatch in Mapping**
- **Problem**: `rows` maps over `sortedBalances` typed as `WalletBalance`, but parameter is typed as `FormattedWalletBalance`
- **Impact**: TypeScript errors, potential runtime issues
- **Solution**: Map over `formattedBalances` instead

**Before:**
```typescript
const rows = sortedBalances.map((balance: FormattedWalletBalance) => {  // Type mismatch
  // sortedBalances is WalletBalance[], not FormattedWalletBalance[]
})
```

**After:**
```typescript
const rows = useMemo(() => {
  return formattedBalances.map((balance: FormattedWalletBalance) => {  // Correct type
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
```

#### c. **Weak Typing**
- **Problem**: `getPriority` uses `any` type for blockchain parameter
- **Impact**: Loss of type safety, potential runtime errors
- **Solution**: Use proper string type and create a const assertion

**Before:**
```typescript
const getPriority = (blockchain: any): number => {  // Weak typing
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

const getPriority = (blockchain: string): number => {  // Strong typing
  return BLOCKCHAIN_PRIORITIES[blockchain] ?? DEFAULT_PRIORITY;
};
```

### 3. **Performance Issues**

#### a. **Function Recreation on Every Render**
- **Problem**: `getPriority` function is defined inside the component
- **Impact**: New function created on every render, breaking memoization
- **Solution**: Move function outside component

**Before:**
```typescript
const WalletPage: React.FC<Props> = (props: Props) => {
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

const WalletPage: React.FC<BoxProps> = ({ children, ...rest }) => {
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        return balancePriority > DEFAULT_PRIORITY && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority;
      });
  }, [balances]);
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
}, [balances]);  // Only include used dependencies
```

#### c. **Missing Memoization**
- **Problem**: `formattedBalances` and `rows` are recalculated on every render
- **Impact**: Unnecessary computations and potential child re-renders
- **Solution**: Wrap in `useMemo` hooks

**Before:**
```typescript
const WalletPage: React.FC<Props> = (props: Props) => {
  // ... other code
  
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {  // No memoization
    return {
      ...balance,
      formatted: balance.amount.toFixed()
    }
  })

  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {  // No memoization
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
const WalletPage: React.FC<BoxProps> = ({ children, ...rest }) => {
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

### 4. **React Anti-patterns**

#### a. **Array Index as Key**
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

### 5. **Code Quality Issues**

#### a. **Empty Props Interface**
- **Problem**: `interface Props extends BoxProps {}` is redundant
- **Impact**: Unnecessary code complexity, unclear intent
- **Solution**: Use the base interface directly

**Before:**
```typescript
interface BoxProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface Props extends BoxProps {
  // Empty interface - redundant
}

const WalletPage: React.FC<Props> = (props: Props) => {
  // ...
}
```

**After:**
```typescript
interface BoxProps {
  children?: React.ReactNode;
  [key: string]: any;
}

const WalletPage: React.FC<BoxProps> = ({ children, ...rest }) => {  // Direct usage
  // ...
}
```

#### b. **Redundant Type Annotations**
- **Problem**: `(props: Props)` is redundant when using `React.FC<Props>`
- **Impact**: Verbose code, unnecessary type repetition
- **Solution**: Let TypeScript infer types from React.FC generic

**Before:**
```typescript
const WalletPage: React.FC<Props> = (props: Props) => {  // Redundant type annotation
  const { children, ...rest } = props;
  // ...
}
```

**After:**
```typescript
const WalletPage: React.FC<BoxProps> = ({ children, ...rest }) => {  // Clean destructuring
  // ...
}
```

#### c. **Magic Numbers**
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

#### d. **Inconsistent Formatting**
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