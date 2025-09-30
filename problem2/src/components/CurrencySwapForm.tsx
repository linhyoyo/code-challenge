import React from 'react'
import FormInput from './FormInput'
import FormDropdown from './FormDropdown'
import FormButton from './FormButton'
import ExchangeRate from './ExchangeRate'
import FormMessage from './FormMessage'
import FormLabel from './FormLabel'
import FormHeader from './FormHeader'
import FormHint from './FormHint'
import FormFooter from './FormFooter'
import { CURRENCIES } from '../constants/currencies'
import { ERROR_MESSAGES } from '../constants/errors'
import { FORM_DEFAULTS } from '../constants/form'
import { useTokenPrices } from '../hooks/useTokenPrices'
import { useDropdownState } from '../hooks/useDropdownState'
import { useSwapForm } from '../hooks/useSwapForm'
import { useSwapLogic } from '../hooks/useSwapLogic'

const CurrencySwapForm: React.FC = () => {
  const { priceMap } = useTokenPrices()
  const {
    showFromDropdown,
    showToDropdown,
    toggleFromDropdown,
    toggleToDropdown,
    closeFromDropdown,
    closeToDropdown,
  } = useDropdownState()

  const {
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
  } = useSwapForm()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = form

  const { getTokenIcon } = useSwapLogic()

  const exchangeRate =
    fromCurrency && toCurrency && priceMap[fromCurrency] && priceMap[toCurrency]
      ? priceMap[fromCurrency] / priceMap[toCurrency]
      : 0

  const handleSwap = () => {
    const tempFromCurrency = fromCurrency
    const tempFromAmount = fromAmount

    setValue('fromCurrency', toCurrency)
    setValue('toCurrency', tempFromCurrency)
    setValue('fromAmount', toAmount)
    setToAmount(tempFromAmount)
  }

  const handleReset = () => {
    setValue('fromCurrency', FORM_DEFAULTS.FROM_CURRENCY)
    setValue('toCurrency', FORM_DEFAULTS.TO_CURRENCY)
    setValue('fromAmount', FORM_DEFAULTS.FROM_AMOUNT)
    setToAmount('')
    setApiError('')
    setSwapSuccess(false)
  }

  const onSubmit = async (data: {
    fromCurrency: string
    toCurrency: string
    fromAmount: string
  }) => {
    setApiError('')
    setSwapSuccess(false)

    if (!data.fromAmount || parseFloat(data.fromAmount) <= 0) {
      setApiError(ERROR_MESSAGES.INVALID_AMOUNT)
      setToAmount('')
      return
    }

    if (!data.fromCurrency || !data.toCurrency) {
      setApiError(ERROR_MESSAGES.MISSING_CURRENCIES)
      setToAmount('')
      return
    }

    if (data.fromCurrency === data.toCurrency) {
      setApiError(ERROR_MESSAGES.SAME_CURRENCIES)
      setToAmount('')
      return
    }

    const fromPrice = priceMap[data.fromCurrency]
    const toPrice = priceMap[data.toCurrency]

    if (!fromPrice || !toPrice) {
      setApiError(ERROR_MESSAGES.PRICE_DATA_UNAVAILABLE)
      setToAmount('')
      return
    }

    const amount = parseFloat(data.fromAmount)

    setIsLoading(true)

    try {
      const result = (amount * fromPrice) / toPrice
      const calculatedAmount = result.toFixed(6)

      await new Promise((resolve) => setTimeout(resolve, 2000))

      setToAmount(calculatedAmount)
      setSwapSuccess(true)
    } catch (error) {
      console.error('Swap failed:', error)
      setApiError(ERROR_MESSAGES.SWAP_FAILED)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-lg">
      <FormHeader title="Currency Swap" subtitle="Convert currencies with ease" />

      <div className="rounded-2xl bg-white p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <FormLabel>From</FormLabel>
            <div className="flex items-start gap-3">
              <FormInput
                register={register}
                errors={errors}
                fieldName="fromAmount"
                placeholder="0.00"
                validation={{
                  required: 'Amount is required',
                  pattern: {
                    value: /^\d*\.?\d*$/,
                    message: 'Please enter a valid number',
                  },
                  validate: (value: string) =>
                    parseFloat(value) > 0 || 'Amount must be greater than 0',
                }}
                showUsdValue={!!(fromAmount && !errors.fromAmount && priceMap[fromCurrency])}
                usdValue={`≈ $${(parseFloat(fromAmount) * priceMap[fromCurrency]).toFixed(2)} USD`}
              />
              <FormDropdown
                isOpen={showFromDropdown}
                onToggle={toggleFromDropdown}
                onClose={closeFromDropdown}
                selectedCurrency={fromCurrency}
                currencies={CURRENCIES}
                onSelect={(currency) => setValue('fromCurrency', currency)}
                getTokenIcon={getTokenIcon}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-center">
            <FormButton type="button" onClick={handleSwap} variant="swap">
              Swap
            </FormButton>
          </div>

          <div className="mb-6">
            <FormLabel>To</FormLabel>
            <div className="flex items-start gap-3">
              <FormInput
                register={register}
                errors={errors}
                fieldName="toAmount"
                placeholder={toAmount ? toAmount : '0.00'}
                value={toAmount}
                readOnly={true}
                showUsdValue={!!(toAmount && priceMap[toCurrency])}
                usdValue={`≈ $${(parseFloat(toAmount) * priceMap[toCurrency]).toFixed(2)} USD`}
              />
              <FormDropdown
                isOpen={showToDropdown}
                onToggle={toggleToDropdown}
                onClose={closeToDropdown}
                selectedCurrency={toCurrency}
                currencies={CURRENCIES}
                onSelect={(currency) => setValue('toCurrency', currency)}
                getTokenIcon={getTokenIcon}
              />
            </div>
          </div>

          <ExchangeRate
            fromCurrency={fromCurrency}
            toCurrency={toCurrency}
            exchangeRate={exchangeRate}
            show={!!(fromAmount && exchangeRate > 0)}
          />

          <FormMessage type="error" message={apiError} show={!!apiError} />

          <FormMessage type="success" message="Swap completed successfully!" show={swapSuccess} />

          <div className="mt-8 flex gap-3">
            <FormButton
              type="button"
              onClick={handleReset}
              variant="secondary"
              disabled={isLoading}
            >
              RESET
            </FormButton>
            <FormButton
              type="submit"
              disabled={isLoading || !fromAmount || !!errors.fromAmount}
              isLoading={isLoading}
              loadingText="Processing Swap..."
            >
              CONFIRM SWAP
            </FormButton>
          </div>

          <FormHint isLoading={isLoading} />
        </form>
      </div>

      <FormFooter />
    </div>
  )
}

export default CurrencySwapForm
