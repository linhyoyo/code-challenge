import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import FormDropdown from '../../components/FormDropdown'

const mockGetTokenIcon = vi.fn((currency) => `https://example.com/${currency}.svg`)

const defaultProps = {
  isOpen: false,
  onToggle: vi.fn(),
  onClose: vi.fn(),
  selectedCurrency: 'ETH',
  currencies: ['ETH', 'USDC', 'BTC'],
  onSelect: vi.fn(),
  getTokenIcon: mockGetTokenIcon,
}

describe('FormDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders selected currency correctly', () => {
    render(<FormDropdown {...defaultProps} />)

    expect(screen.getByText('ETH')).toBeInTheDocument()
  })

  it('calls onToggle when button is clicked', () => {
    render(<FormDropdown {...defaultProps} />)

    fireEvent.click(screen.getByRole('button'))
    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1)
  })

  it('shows dropdown when isOpen is true', () => {
    render(<FormDropdown {...defaultProps} isOpen={true} />)

    expect(screen.getByText('USDC')).toBeInTheDocument()
    expect(screen.getByText('BTC')).toBeInTheDocument()
  })

  it('does not show dropdown when isOpen is false', () => {
    render(<FormDropdown {...defaultProps} isOpen={false} />)

    expect(screen.queryByText('USDC')).not.toBeInTheDocument()
    expect(screen.queryByText('BTC')).not.toBeInTheDocument()
  })

  it('calls onSelect and onClose when currency is selected', () => {
    render(<FormDropdown {...defaultProps} isOpen={true} />)

    fireEvent.click(screen.getByText('USDC'))
    expect(defaultProps.onSelect).toHaveBeenCalledWith('USDC')
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1)
  })

  it('renders currency icons', () => {
    render(<FormDropdown {...defaultProps} isOpen={true} />)

    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(4)
  })

  it('applies correct styling to dropdown button', () => {
    render(<FormDropdown {...defaultProps} />)
    const button = screen.getByRole('button')

    expect(button).toHaveClass('flex', 'w-40', 'items-center', 'justify-between', 'rounded-xl')
  })

  it('applies correct styling to dropdown list', () => {
    render(<FormDropdown {...defaultProps} isOpen={true} />)
    const dropdown = screen.getByText('USDC').closest('div')

    expect(dropdown).toHaveClass('absolute', 'z-10', 'mt-1', 'max-h-60', 'w-full')
  })

  it('applies custom className', () => {
    render(<FormDropdown {...defaultProps} className="custom-class" />)
    const container = screen.getByText('ETH').closest('.dropdown-container')

    expect(container).toHaveClass('custom-class')
  })

  it('handles empty currencies array', () => {
    render(<FormDropdown {...defaultProps} currencies={[]} isOpen={true} />)

    expect(screen.queryByText('USDC')).not.toBeInTheDocument()
  })
})
