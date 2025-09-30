# Test Suite

This directory contains comprehensive unit tests for the Currency Swap application.

## Test Structure

```
src/test/
├── components/          # Component tests
├── hooks/              # Custom hook tests
├── constants/          # Constants tests
├── utils/              # Test utilities
├── setup.ts            # Test setup
└── index.ts            # Test exports
```

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests once
npm run test:run

# Run tests with UI
npm run test:ui
```

## Test Coverage

- **Components**: All UI components are tested
- **Hooks**: All custom hooks are tested
- **Constants**: All constant files are tested
- **Integration**: Basic integration tests included

## Test Files

### Components

- `FormLabel.test.tsx` - Label component tests
- `FormHeader.test.tsx` - Header component tests
- `FormFooter.test.tsx` - Footer component tests
- `FormHint.test.tsx` - Hint component tests
- `FormMessage.test.tsx` - Message component tests
- `FormButton.test.tsx` - Button component tests
- `FormInput.test.tsx` - Input component tests
- `FormDropdown.test.tsx` - Dropdown component tests
- `ExchangeRate.test.tsx` - Exchange rate component tests
- `CurrencySwapForm.test.tsx` - Main form component tests

### Hooks

- `useTokenPrices.test.ts` - Token prices hook tests
- `useDropdownState.test.ts` - Dropdown state hook tests
- `useSwapForm.test.ts` - Swap form hook tests
- `useSwapLogic.test.ts` - Swap logic hook tests

### Constants

- `currencies.test.ts` - Currency constants tests
- `errors.test.ts` - Error message constants tests
- `api.test.ts` - API endpoint constants tests
- `form.test.ts` - Form default constants tests

## Test Utilities

- `test-utils.tsx` - Custom render function with providers
- `setup.ts` - Test environment setup