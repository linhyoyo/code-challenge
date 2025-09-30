import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FormHeader from '../../components/FormHeader'

describe('FormHeader', () => {
  it('renders title and subtitle correctly', () => {
    render(<FormHeader title="Test Title" subtitle="Test Subtitle" />)

    expect(screen.getByText('Test Title')).toBeInTheDocument()
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument()
  })

  it('applies gradient styling to title', () => {
    render(<FormHeader title="Test Title" subtitle="Test Subtitle" />)
    const title = screen.getByText('Test Title')

    expect(title).toHaveClass(
      'bg-gradient-to-r',
      'from-blue-600',
      'to-purple-600',
      'bg-clip-text',
      'text-transparent'
    )
  })

  it('applies correct styling to subtitle', () => {
    render(<FormHeader title="Test Title" subtitle="Test Subtitle" />)
    const subtitle = screen.getByText('Test Subtitle')

    expect(subtitle).toHaveClass('text-gray-600')
  })

  it('applies custom className', () => {
    render(<FormHeader title="Test Title" subtitle="Test Subtitle" className="custom-class" />)
    const container = screen.getByText('Test Title').parentElement

    expect(container).toHaveClass('custom-class')
  })
})
