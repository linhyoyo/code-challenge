import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FormMessage from '../../components/FormMessage'

describe('FormMessage', () => {
  it('renders error message when type is error and show is true', () => {
    render(<FormMessage type="error" message="Test error" show={true} />)

    expect(screen.getByText('Test error')).toBeInTheDocument()
    const container = screen.getByText('Test error').closest('div')
    expect(container).toHaveClass('text-red-600')
  })

  it('renders success message when type is success and show is true', () => {
    render(<FormMessage type="success" message="Test success" show={true} />)

    expect(screen.getByText('Test success')).toBeInTheDocument()
    const container = screen.getByText('Test success').closest('div')
    expect(container).toHaveClass('text-green-600')
  })

  it('does not render when show is false', () => {
    render(<FormMessage type="error" message="Test error" show={false} />)

    expect(screen.queryByText('Test error')).not.toBeInTheDocument()
  })

  it('applies correct error styling', () => {
    render(<FormMessage type="error" message="Test error" show={true} />)
    const container = screen.getByText('Test error').closest('div')

    expect(container).toHaveClass(
      'text-red-600',
      'flex',
      'items-center',
      'gap-2',
      'border-red-100',
      'bg-red-50'
    )
  })

  it('applies correct success styling', () => {
    render(<FormMessage type="success" message="Test success" show={true} />)
    const container = screen.getByText('Test success').closest('div')

    expect(container).toHaveClass(
      'text-green-600',
      'flex',
      'items-center',
      'gap-2',
      'border-green-100',
      'bg-green-50'
    )
  })
})
