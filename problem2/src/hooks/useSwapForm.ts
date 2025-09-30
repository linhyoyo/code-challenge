import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FORM_DEFAULTS } from '../constants/form'

interface SwapFormData {
  fromCurrency: string
  toCurrency: string
  fromAmount: string
}

export const useSwapForm = () => {
  const [toAmount, setToAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [swapSuccess, setSwapSuccess] = useState(false)
  const [apiError, setApiError] = useState('')

  const form = useForm<SwapFormData>({
    defaultValues: {
      fromCurrency: FORM_DEFAULTS.FROM_CURRENCY,
      toCurrency: FORM_DEFAULTS.TO_CURRENCY,
      fromAmount: FORM_DEFAULTS.FROM_AMOUNT,
    },
  })

  const fromCurrency = form.watch('fromCurrency')
  const toCurrency = form.watch('toCurrency')
  const fromAmount = form.watch('fromAmount')

  const clearError = () => setApiError('')
  const clearSuccess = () => setSwapSuccess(false)
  const clearToAmount = () => setToAmount('')

  const resetForm = () => {
    clearError()
    clearSuccess()
    clearToAmount()
  }

  return {
    form,
    toAmount,
    setToAmount,
    isLoading,
    setIsLoading,
    swapSuccess,
    setSwapSuccess,
    apiError,
    setApiError,
    fromCurrency,
    toCurrency,
    fromAmount,
    clearError,
    clearSuccess,
    clearToAmount,
    resetForm,
  }
}
