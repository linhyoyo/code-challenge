import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'

// Mock MSW
vi.mock('../mocks/browser', () => ({
  worker: {
    start: vi.fn(),
  },
}))

vi.mock('../components/CurrencySwapForm', () => ({
  default: () => <div data-testid="currency-swap-form">Currency Swap Form</div>,
}))

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the main app container', () => {
    render(<App />)

    const container = screen.getByTestId('currency-swap-form').parentElement
    expect(container).toHaveClass('flex', 'min-h-screen', 'items-center', 'justify-center')
  })

  it('renders the CurrencySwapForm component', () => {
    render(<App />)

    expect(screen.getByTestId('currency-swap-form')).toBeInTheDocument()
  })

  it('applies correct background styling', () => {
    render(<App />)

    const container = screen.getByTestId('currency-swap-form').parentElement
    expect(container).toHaveClass('bg-gradient-to-br', 'from-blue-50', 'to-indigo-100', 'p-4')
  })
})
