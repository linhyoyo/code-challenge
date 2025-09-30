import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import ExchangeRate from '../../components/ExchangeRate'

describe('ExchangeRate', () => {
  it('renders exchange rate when show is true', () => {
    render(<ExchangeRate fromCurrency="ETH" toCurrency="USDC" exchangeRate={0.5} show={true} />)

    expect(screen.getByText('1 ETH = 0.500000 USDC')).toBeInTheDocument()
  })

  it('does not render when show is false', () => {
    render(<ExchangeRate fromCurrency="ETH" toCurrency="USDC" exchangeRate={0.5} show={false} />)

    expect(screen.queryByText('1 ETH = 0.500000 USDC')).not.toBeInTheDocument()
  })

  it('formats exchange rate to 6 decimal places', () => {
    render(
      <ExchangeRate fromCurrency="ETH" toCurrency="USDC" exchangeRate={0.123456789} show={true} />
    )

    expect(screen.getByText('1 ETH = 0.123457 USDC')).toBeInTheDocument()
  })

  it('applies correct styling', () => {
    render(<ExchangeRate fromCurrency="ETH" toCurrency="USDC" exchangeRate={0.5} show={true} />)

    const rate = screen.getByText('1 ETH = 0.500000 USDC')
    expect(rate).toHaveClass('font-medium', 'text-gray-900')
  })

  it('applies correct container styling', () => {
    render(<ExchangeRate fromCurrency="ETH" toCurrency="USDC" exchangeRate={0.5} show={true} />)

    const container = screen.getByText('1 ETH = 0.500000 USDC').closest('.mb-6')
    expect(container).toHaveClass(
      'mb-6',
      'rounded-xl',
      'border',
      'border-blue-100',
      'bg-blue-50',
      'p-4'
    )
  })

  it('handles different currency pairs', () => {
    render(<ExchangeRate fromCurrency="BTC" toCurrency="ETH" exchangeRate={15.5} show={true} />)

    expect(screen.getByText('1 BTC = 15.500000 ETH')).toBeInTheDocument()
  })
})
