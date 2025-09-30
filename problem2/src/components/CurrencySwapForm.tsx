import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import FormInput from './FormInput'
import FormDropdown from './FormDropdown'
import FormButton from './FormButton'
import ExchangeRate from './ExchangeRate'
import FormMessage from './FormMessage'
import FormLabel from './FormLabel'
import FormHint from './FormHint'
import FormHeader from './FormHeader'
import FormFooter from './FormFooter'
import { CURRENCIES, TOKEN_ICON_MAP, API_ENDPOINTS, FORM_DEFAULTS } from '../constants/currencies'

interface Token {
  currency: string
  price: number
  icon?: string
}

interface SwapFormData {
  fromCurrency: string
  toCurrency: string
  fromAmount: string
}

const CurrencySwapForm = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [toAmount, setToAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [swapSuccess, setSwapSuccess] = useState(false)
  const [apiError, setApiError] = useState('')
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SwapFormData>({
    defaultValues: {
      fromCurrency: FORM_DEFAULTS.FROM_CURRENCY,
      toCurrency: FORM_DEFAULTS.TO_CURRENCY,
      fromAmount: FORM_DEFAULTS.FROM_AMOUNT,
    },
  })

  const fromCurrency = watch('fromCurrency')
  const toCurrency = watch('toCurrency')
  const fromAmount = watch('fromAmount')

  const priceMap = tokens.reduce(
    (acc, token) => {
      acc[token.currency] = token.price
      return acc
    },
    {} as Record<string, number>
  )

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(API_ENDPOINTS.PRICES)
        const data = await response.json()
        setTokens(data)
      } catch (error) {
        console.error('Failed to fetch prices:', error)
      }
    }
    fetchPrices()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.dropdown-container')) {
        setShowFromDropdown(false)
        setShowToDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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

  const onSubmit = async (data: SwapFormData) => {
    setApiError('')
    setSwapSuccess(false)

    if (!data.fromAmount || parseFloat(data.fromAmount) <= 0) {
      setApiError('Please enter a valid amount greater than 0')
      setToAmount('')
      return
    }

    if (!data.fromCurrency || !data.toCurrency) {
      setApiError('Please select both source and target currencies')
      setToAmount('')
      return
    }

    if (data.fromCurrency === data.toCurrency) {
      setApiError('Source and target currencies must be different')
      setToAmount('')
      return
    }

    const fromPrice = priceMap[data.fromCurrency]
    const toPrice = priceMap[data.toCurrency]

    if (!fromPrice || !toPrice) {
      setApiError('Price data not available for selected currencies')
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
      setApiError('Swap failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getTokenIcon = (currency: string) => {
    const iconName = TOKEN_ICON_MAP[currency] || currency
    return `${API_ENDPOINTS.TOKEN_ICONS}/${iconName}.svg`
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
                onToggle={() => {
                  setShowFromDropdown(!showFromDropdown)
                  setShowToDropdown(false)
                }}
                onClose={() => setShowFromDropdown(false)}
                selectedCurrency={fromCurrency}
                currencies={CURRENCIES}
                onSelect={(currency) => setValue('fromCurrency', currency)}
                getTokenIcon={getTokenIcon}
              />
            </div>
          </div>

          <div className="my-4 flex justify-center">
            <FormButton type="button" onClick={handleSwap} variant="swap">
              Swap
            </FormButton>
          </div>

          <div className="mb-6">
            <FormLabel>{toAmount ? 'To (received)' : 'To (will receive)'}</FormLabel>
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
                onToggle={() => {
                  setShowToDropdown(!showToDropdown)
                  setShowFromDropdown(false)
                }}
                onClose={() => setShowToDropdown(false)}
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

          <FormButton
            type="submit"
            disabled={isLoading || !fromAmount || !!errors.fromAmount}
            isLoading={isLoading}
            loadingText="Processing Swap..."
          >
            CONFIRM SWAP
          </FormButton>

          <FormHint isLoading={isLoading} />
        </form>
      </div>

      <FormFooter />
    </div>
  )
}

export default CurrencySwapForm
