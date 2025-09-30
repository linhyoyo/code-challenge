import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import FormButton from '../../components/FormButton'

describe('FormButton', () => {
  it('renders children correctly', () => {
    render(<FormButton type="button">Test Button</FormButton>)
    expect(screen.getByText('Test Button')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()
    render(
      <FormButton type="button" onClick={handleClick}>
        Test Button
      </FormButton>
    )

    fireEvent.click(screen.getByText('Test Button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies primary variant by default', () => {
    render(<FormButton type="button">Test Button</FormButton>)
    const button = screen.getByText('Test Button')

    expect(button).toHaveClass('bg-gradient-to-r', 'from-blue-600', 'to-purple-600')
  })

  it('applies secondary variant correctly', () => {
    render(
      <FormButton type="button" variant="secondary">
        Test Button
      </FormButton>
    )
    const button = screen.getByText('Test Button')

    expect(button).toHaveClass('border-2', 'border-gray-300', 'bg-white', 'text-gray-700')
  })

  it('applies swap variant correctly', () => {
    render(
      <FormButton type="button" variant="swap">
        Test Button
      </FormButton>
    )
    const button = screen.getByRole('button')

    expect(button).toHaveClass('rounded-full', 'bg-gradient-to-r', 'from-blue-500', 'to-purple-500')
  })

  it('shows loading state when isLoading is true', () => {
    render(
      <FormButton type="button" isLoading={true} loadingText="Loading...">
        Test Button
      </FormButton>
    )

    expect(screen.getByText('Loading...')).toBeInTheDocument()
    expect(screen.queryByText('Test Button')).not.toBeInTheDocument()
  })

  it('is disabled when disabled prop is true', () => {
    render(
      <FormButton type="button" disabled={true}>
        Test Button
      </FormButton>
    )
    const button = screen.getByText('Test Button')

    expect(button).toBeDisabled()
  })

  it('is disabled when isLoading is true', () => {
    render(
      <FormButton type="button" isLoading={true}>
        Test Button
      </FormButton>
    )
    const button = screen.getByRole('button')

    expect(button).toBeDisabled()
  })

  it('applies custom className', () => {
    render(
      <FormButton type="button" className="custom-class">
        Test Button
      </FormButton>
    )
    const button = screen.getByText('Test Button')

    expect(button).toHaveClass('custom-class')
  })
})
