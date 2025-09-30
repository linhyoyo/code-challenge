import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FormHint from '../../components/FormHint'

describe('FormHint', () => {
  it('renders loading message when isLoading is true', () => {
    render(<FormHint isLoading={true} />)
    expect(screen.getByText('Please wait while we process your transaction...')).toBeInTheDocument()
  })

  it('renders default message when isLoading is false', () => {
    render(<FormHint isLoading={false} />)
    expect(screen.getByText('Click to execute the swap transaction')).toBeInTheDocument()
  })

  it('applies correct styling', () => {
    render(<FormHint isLoading={false} />)
    const hint = screen.getByText('Click to execute the swap transaction')

    expect(hint).toHaveClass('mt-4', 'text-center', 'text-xs', 'text-gray-500')
  })

  it('applies custom className', () => {
    render(<FormHint isLoading={false} className="custom-class" />)
    const hint = screen.getByText('Click to execute the swap transaction')

    expect(hint).toHaveClass('custom-class')
  })
})
