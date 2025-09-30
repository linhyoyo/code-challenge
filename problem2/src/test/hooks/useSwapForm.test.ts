import { renderHook, act } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useSwapForm } from '../../hooks/useSwapForm'

describe('useSwapForm', () => {
  it('initializes with default values', () => {
    const { result } = renderHook(() => useSwapForm())

    expect(result.current.fromCurrency).toBe('ETH')
    expect(result.current.toCurrency).toBe('USDC')
    expect(result.current.fromAmount).toBe('')
    expect(result.current.toAmount).toBe('')
    expect(result.current.isLoading).toBe(false)
    expect(result.current.swapSuccess).toBe(false)
    expect(result.current.apiError).toBe('')
  })

  it('updates toAmount correctly', () => {
    const { result } = renderHook(() => useSwapForm())

    act(() => {
      result.current.setToAmount('100.50')
    })

    expect(result.current.toAmount).toBe('100.50')
  })

  it('updates isLoading correctly', () => {
    const { result } = renderHook(() => useSwapForm())

    act(() => {
      result.current.setIsLoading(true)
    })

    expect(result.current.isLoading).toBe(true)

    act(() => {
      result.current.setIsLoading(false)
    })

    expect(result.current.isLoading).toBe(false)
  })

  it('updates swapSuccess correctly', () => {
    const { result } = renderHook(() => useSwapForm())

    act(() => {
      result.current.setSwapSuccess(true)
    })

    expect(result.current.swapSuccess).toBe(true)
  })

  it('updates apiError correctly', () => {
    const { result } = renderHook(() => useSwapForm())

    act(() => {
      result.current.setApiError('Test error')
    })

    expect(result.current.apiError).toBe('Test error')
  })

  it('clears error correctly', () => {
    const { result } = renderHook(() => useSwapForm())

    act(() => {
      result.current.setApiError('Test error')
    })

    expect(result.current.apiError).toBe('Test error')

    act(() => {
      result.current.clearError()
    })

    expect(result.current.apiError).toBe('')
  })

  it('clears success correctly', () => {
    const { result } = renderHook(() => useSwapForm())

    act(() => {
      result.current.setSwapSuccess(true)
    })

    expect(result.current.swapSuccess).toBe(true)

    act(() => {
      result.current.clearSuccess()
    })

    expect(result.current.swapSuccess).toBe(false)
  })

  it('clears toAmount correctly', () => {
    const { result } = renderHook(() => useSwapForm())

    act(() => {
      result.current.setToAmount('100.50')
    })

    expect(result.current.toAmount).toBe('100.50')

    act(() => {
      result.current.clearToAmount()
    })

    expect(result.current.toAmount).toBe('')
  })

  it('resets form correctly', () => {
    const { result } = renderHook(() => useSwapForm())

    act(() => {
      result.current.setToAmount('100.50')
      result.current.setApiError('Test error')
      result.current.setSwapSuccess(true)
    })

    expect(result.current.toAmount).toBe('100.50')
    expect(result.current.apiError).toBe('Test error')
    expect(result.current.swapSuccess).toBe(true)

    act(() => {
      result.current.resetForm()
    })

    expect(result.current.toAmount).toBe('')
    expect(result.current.apiError).toBe('')
    expect(result.current.swapSuccess).toBe(false)
  })

  it('provides form methods', () => {
    const { result } = renderHook(() => useSwapForm())

    expect(result.current.form).toBeDefined()
    expect(typeof result.current.form.register).toBe('function')
    expect(typeof result.current.form.handleSubmit).toBe('function')
    expect(typeof result.current.form.setValue).toBe('function')
    expect(result.current.form.formState).toBeDefined()
  })
})
