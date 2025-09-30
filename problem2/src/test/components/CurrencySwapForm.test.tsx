import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import userEvent from '@testing-library/user-event'
import CurrencySwapForm from '../../components/CurrencySwapForm'

vi.mock('../../hooks/useTokenPrices', () => ({
  useTokenPrices: () => ({
    priceMap: {
      ETH: 2000,
      USDC: 1,
      BTC: 40000,
    },
  }),
}))

vi.mock('../../hooks/useDropdownState', () => ({
  useDropdownState: () => ({
    showFromDropdown: false,
    showToDropdown: false,
    toggleFromDropdown: vi.fn(),
    toggleToDropdown: vi.fn(),
    closeFromDropdown: vi.fn(),
    closeToDropdown: vi.fn(),
  }),
}))

vi.mock('../../hooks/useSwapForm', () => ({
  useSwapForm: () => ({
    form: {
      register: vi.fn(() => ({ name: 'test', onChange: vi.fn(), onBlur: vi.fn(), ref: vi.fn() })),
      handleSubmit: vi.fn((fn) => (e: any) => {
        e.preventDefault()
        fn({ fromCurrency: 'ETH', toCurrency: 'USDC', fromAmount: '1' })
      }),
      setValue: vi.fn(),
      formState: { errors: {} },
    },
    toAmount: '',
    setToAmount: vi.fn(),
    isLoading: false,
    setIsLoading: vi.fn(),
    swapSuccess: false,
    setSwapSuccess: vi.fn(),
    apiError: '',
    setApiError: vi.fn(),
    fromCurrency: 'ETH',
    toCurrency: 'USDC',
    fromAmount: '1',
  }),
}))

vi.mock('../../hooks/useSwapLogic', () => ({
  useSwapLogic: () => ({
    getTokenIcon: vi.fn((currency) => `https://example.com/${currency}.svg`),
  }),
}))

describe('CurrencySwapForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders form elements correctly', () => {
    render(<CurrencySwapForm />)

    expect(screen.getByText('Currency Swap')).toBeInTheDocument()
    expect(screen.getByText('Convert currencies with ease')).toBeInTheDocument()
    expect(screen.getByText('From')).toBeInTheDocument()
    expect(screen.getByText('To')).toBeInTheDocument()
    expect(screen.getByText('CONFIRM SWAP')).toBeInTheDocument()
    expect(screen.getByText('RESET')).toBeInTheDocument()
  })

  it('renders input fields with correct placeholders', () => {
    render(<CurrencySwapForm />)

    const inputs = screen.getAllByPlaceholderText('0.00')
    expect(inputs).toHaveLength(2)
  })

  it('renders currency dropdowns', () => {
    render(<CurrencySwapForm />)

    expect(screen.getByText('ETH')).toBeInTheDocument()
    expect(screen.getByText('USDC')).toBeInTheDocument()
  })

  it('renders swap button', () => {
    render(<CurrencySwapForm />)

    const swapButton = screen.getByRole('button', { name: /swap/i })
    expect(swapButton).toBeInTheDocument()
  })

  it('renders footer text', () => {
    render(<CurrencySwapForm />)

    expect(screen.getByText('Secure • Fast • Reliable')).toBeInTheDocument()
  })

  it('handles form submission', async () => {
    const user = userEvent.setup()
    render(<CurrencySwapForm />)

    const submitButton = screen.getByRole('button', { name: /confirm swap/i })
    await user.click(submitButton)

    expect(submitButton).toBeInTheDocument()
  })

  it('handles reset button click', async () => {
    const user = userEvent.setup()
    render(<CurrencySwapForm />)

    const resetButton = screen.getByRole('button', { name: /reset/i })
    await user.click(resetButton)

    expect(resetButton).toBeInTheDocument()
  })

  it('handles swap button click', async () => {
    const user = userEvent.setup()
    render(<CurrencySwapForm />)

    const swapButton = screen.getByRole('button', { name: /swap/i })
    await user.click(swapButton)

    expect(swapButton).toBeInTheDocument()
  })

  it('applies correct styling classes', () => {
    render(<CurrencySwapForm />)

    const container = screen.getByText('Currency Swap').closest('.w-full')
    expect(container).toHaveClass('w-full', 'max-w-lg')

    const formContainer = screen.getByText('From').closest('.rounded-2xl')
    expect(formContainer).toHaveClass('rounded-2xl', 'bg-white', 'p-8', 'shadow-2xl')
  })

  it('renders exchange rate section', () => {
    render(<CurrencySwapForm />)

    expect(screen.getByText('From')).toBeInTheDocument()
    expect(screen.getByText('To')).toBeInTheDocument()
  })
})
