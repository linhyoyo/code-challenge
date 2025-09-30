import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FormFooter from '../../components/FormFooter'

describe('FormFooter', () => {
  it('renders footer text correctly', () => {
    render(<FormFooter />)
    expect(screen.getByText('Secure • Fast • Reliable')).toBeInTheDocument()
  })

  it('applies correct styling', () => {
    render(<FormFooter />)
    const footer = screen.getByText('Secure • Fast • Reliable')

    expect(footer).toHaveClass('mt-6', 'text-center', 'text-sm', 'text-gray-500')
  })

  it('renders as paragraph element', () => {
    render(<FormFooter />)
    const footer = screen.getByText('Secure • Fast • Reliable')
    expect(footer.tagName).toBe('P')
  })
})
