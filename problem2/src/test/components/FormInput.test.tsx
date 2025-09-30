import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useForm } from 'react-hook-form'
import FormInput from '../../components/FormInput'

const TestForm = ({
  fieldName = 'testField',
  validation = {},
  readOnly = false,
  value = '',
  showUsdValue = false,
  usdValue = '',
}: any) => {
  const {
    register,
    formState: { errors },
  } = useForm()

  return (
    <FormInput
      register={register}
      errors={errors}
      fieldName={fieldName}
      placeholder="Test placeholder"
      value={value}
      readOnly={readOnly}
      validation={validation}
      showUsdValue={showUsdValue}
      usdValue={usdValue}
    />
  )
}

describe('FormInput', () => {
  it('renders input with placeholder', () => {
    render(<TestForm />)
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument()
  })

  it('applies correct styling', () => {
    render(<TestForm />)
    const input = screen.getByPlaceholderText('Test placeholder')

    expect(input).toHaveClass('w-full', 'rounded-xl', 'border', 'border-gray-300', 'px-4', 'py-3')
  })

  it('shows error message when field has error', () => {
    const TestFormWithError = () => {
      const { register } = useForm()
      const errors = { testField: { message: 'Test error message', type: 'required' } }

      return (
        <FormInput
          register={register}
          errors={errors}
          fieldName="testField"
          placeholder="Test placeholder"
        />
      )
    }

    render(<TestFormWithError />)
    expect(screen.getByText('Test error message')).toBeInTheDocument()
  })

  it('shows USD value when showUsdValue is true', () => {
    render(<TestForm showUsdValue={true} usdValue="≈ $100.00 USD" />)
    expect(screen.getByText('≈ $100.00 USD')).toBeInTheDocument()
  })

  it('applies readOnly styling when readOnly is true', () => {
    render(<TestForm readOnly={true} value="Read only value" />)
    const input = screen.getByDisplayValue('Read only value')

    expect(input).toHaveClass('cursor-not-allowed', 'bg-gray-50')
    expect(input).toHaveAttribute('readonly')
  })

  it('applies custom className', () => {
    const TestFormWithCustomClass = () => {
      const { register } = useForm()
      const errors = {}

      return (
        <FormInput
          register={register}
          errors={errors}
          fieldName="testField"
          placeholder="Test placeholder"
          className="custom-class"
        />
      )
    }

    render(<TestFormWithCustomClass />)
    const input = screen.getByPlaceholderText('Test placeholder')

    expect(input).toHaveClass('custom-class')
  })

  it('handles input changes correctly', () => {
    render(<TestForm />)
    const input = screen.getByPlaceholderText('Test placeholder')

    fireEvent.change(input, { target: { value: 'test value' } })
    expect(input).toHaveValue('test value')
  })
})
