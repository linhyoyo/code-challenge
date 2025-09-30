# Currency Swap Form

A modern, responsive currency swap form built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 🎨 **Modern UI/UX**: Clean, intuitive design with smooth animations
- 🔄 **Real-time Exchange Rates**: Live price data from the Switcheo API
- 🪙 **Token Icons**: Beautiful token icons from the Switcheo token-icons repository
- ✅ **Form Validation**: Comprehensive input validation with React Hook Form
- 🔄 **Currency Swapping**: Easy currency selection with dropdown menus
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development
- 🎭 **Backend Mocking**: MSW for realistic API simulation

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Hook Form** - Form management
- **MSW** - API mocking
- **Heroicons** - Icons

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## How to Use

1. Select the currency you want to send from the dropdown
2. Enter the amount you want to swap
3. Select the currency you want to receive
4. The form will automatically calculate the exchange rate and amount to receive
5. Click "CONFIRM SWAP" to process the transaction

## API Integration

The form integrates with:

- **Price API**: `https://interview.switcheo.com/prices.json` for real-time token prices
- **Token Icons**: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/{CURRENCY}.svg`

## Development

- **Linting**: `npm run lint`
- **Formatting**: `npm run format`
- **Build**: `npm run build`
- **Preview**: `npm run preview`
