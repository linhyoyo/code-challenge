import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FormLabel from '../../components/FormLabel'

describe('FormLabel', () => {
  it('renders children correctly', () => {
    render(<FormLabel>Test Label</FormLabel>)
    expect(screen.getByText('Test Label')).toBeInTheDocument()
  })

  it('applies default className', () => {
    render(<FormLabel>Test Label</FormLabel>)
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('mb-2', 'block', 'text-sm', 'font-medium', 'text-gray-700')
  })

  it('applies custom className', () => {
    render(<FormLabel className="custom-class">Test Label</FormLabel>)
    const label = screen.getByText('Test Label')
    expect(label).toHaveClass('custom-class')
  })

  it('renders as label element', () => {
    render(<FormLabel>Test Label</FormLabel>)
    const label = screen.getByText('Test Label')
    expect(label.tagName).toBe('LABEL')
  })
})
