export const ERROR_MESSAGES = {
  INVALID_AMOUNT: 'Please enter a valid amount greater than 0',
  MISSING_CURRENCIES: 'Please select both source and target currencies',
  SAME_CURRENCIES: 'Source and target currencies must be different',
  PRICE_DATA_UNAVAILABLE: 'Price data not available for selected currencies',
  SWAP_FAILED: 'Swap failed. Please try again.',
} as const
