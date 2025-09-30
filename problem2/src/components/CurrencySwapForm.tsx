import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ChevronDownIcon, ArrowsUpDownIcon } from '@heroicons/react/24/outline'
import { AlertTriangle, CheckCircle } from 'lucide-react'

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

const CURRENCIES = [
  'ampLUNA',
  'ATOM',
  'axlUSDC',
  'BLUR',
  'BUSD',
  'EVMOS',
  'ETH',
  'GMX',
  'IBCX',
  'IRIS',
  'KUJI',
  'LSI',
  'LUNA',
  'OKB',
  'OKT',
  'OSMO',
  'RATOM',
  'STATOM',
  'STEVMOS',
  'STLUNA',
  'STOSMO',
  'STRD',
  'SWTH',
  'rSWTH',
  'USC',
  'USD',
  'USDC',
  'WBTC',
  'wstETH',
  'YieldUSD',
  'ZIL',
]

const CurrencySwapForm: React.FC = () => {
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
      fromCurrency: 'ETH',
      toCurrency: 'USDC',
      fromAmount: '',
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
        const response = await fetch('https://interview.switcheo.com/prices.json')
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
    const iconMap: Record<string, string> = {
      STATOM: 'stATOM',
      RATOM: 'rATOM',
      STEVMOS: 'stEVMOS',
      STLUNA: 'stLUNA',
      STOSMO: 'stOSMO',
    }

    const iconName = iconMap[currency] || currency
    return `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${iconName}.svg`
  }

  return (
    <div className="w-full max-w-lg">
      <div className="mb-8 text-center">
        <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
          Currency Swap
        </h1>
        <p className="text-gray-600">Exchange your assets instantly</p>
      </div>

      <div className="rounded-2xl bg-white p-8 shadow-2xl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">From</label>
            <div className="flex gap-3">
              <input
                {...register('fromAmount', {
                  required: 'Amount is required',
                  pattern: {
                    value: /^\d*\.?\d*$/,
                    message: 'Please enter a valid number',
                  },
                  validate: (value) => parseFloat(value) > 0 || 'Amount must be greater than 0',
                })}
                placeholder="0.00"
                className="flex-1 rounded-xl border border-gray-300 px-4 py-3 text-lg outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500"
              />
              <div className="dropdown-container relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowFromDropdown(!showFromDropdown)
                    setShowToDropdown(false)
                  }}
                  className="flex w-40 items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-4 text-sm outline-none hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={getTokenIcon(fromCurrency)}
                      alt={fromCurrency}
                      className="h-5 w-5"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPgo8L3N2Zz4KPC9zdmc+'
                      }}
                    />
                    <span className="font-medium">{fromCurrency}</span>
                  </div>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                {showFromDropdown && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-300 bg-white shadow-lg">
                    {CURRENCIES.map((currency) => (
                      <button
                        key={currency}
                        type="button"
                        onClick={() => {
                          setValue('fromCurrency', currency)
                          setShowFromDropdown(false)
                        }}
                        className="flex w-full items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50"
                      >
                        <img
                          src={getTokenIcon(currency)}
                          alt={currency}
                          className="h-5 w-5"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPgo8L3N2Zz4KPC9zdmc+'
                          }}
                        />
                        <span className="font-medium">{currency}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {errors.fromAmount && (
              <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
                <AlertTriangle className="h-4 w-4" />
                {errors.fromAmount.message}
              </p>
            )}
            {fromAmount && !errors.fromAmount && priceMap[fromCurrency] && (
              <p className="mt-1 text-sm text-gray-500">
                ≈ ${(parseFloat(fromAmount) * priceMap[fromCurrency]).toFixed(2)} USD
              </p>
            )}
          </div>

          <div className="my-4 flex justify-center">
            <button
              type="button"
              onClick={handleSwap}
              className="transform rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3 shadow-lg transition-all hover:scale-110 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl"
            >
              <ArrowsUpDownIcon className="h-5 w-5 text-white" />
            </button>
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              {toAmount ? 'To (received)' : 'To (will receive)'}
            </label>
            <div className="flex gap-3">
              <input
                value={toAmount}
                readOnly
                placeholder={toAmount ? toAmount : '0.00'}
                className="flex-1 cursor-not-allowed rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-lg outline-none"
              />
              <div className="dropdown-container relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowToDropdown(!showToDropdown)
                    setShowFromDropdown(false)
                  }}
                  className="flex w-40 items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-4 text-sm outline-none hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={getTokenIcon(toCurrency)}
                      alt={toCurrency}
                      className="h-5 w-5"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src =
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPgo8L3N2Zz4KPC9zdmc+'
                      }}
                    />
                    <span className="font-medium">{toCurrency}</span>
                  </div>
                  <ChevronDownIcon className="h-4 w-4" />
                </button>
                {showToDropdown && (
                  <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-300 bg-white shadow-lg">
                    {CURRENCIES.map((currency) => (
                      <button
                        key={currency}
                        type="button"
                        onClick={() => {
                          setValue('toCurrency', currency)
                          setShowToDropdown(false)
                        }}
                        className="flex w-full items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50"
                      >
                        <img
                          src={getTokenIcon(currency)}
                          alt={currency}
                          className="h-5 w-5"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src =
                              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPgo8L3N2Zz4KPC9zdmc+'
                          }}
                        />
                        <span className="font-medium">{currency}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            {toAmount && priceMap[toCurrency] && (
              <p className="mt-1 text-sm text-gray-500">
                ≈ ${(parseFloat(toAmount) * priceMap[toCurrency]).toFixed(2)} USD
              </p>
            )}
          </div>

          {fromAmount && exchangeRate > 0 && (
            <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Exchange Rate:</span>
                <span className="font-medium text-gray-900">
                  1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
                </span>
              </div>
            </div>
          )}

          {apiError && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 p-3 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm">{apiError}</span>
            </div>
          )}

          {swapSuccess && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 p-3 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">Swap completed successfully!</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !fromAmount || !!errors.fromAmount}
            className="flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 font-semibold text-white shadow-lg transition-all hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400"
          >
            {isLoading ? (
              <>
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                Processing Swap...
              </>
            ) : (
              'CONFIRM SWAP'
            )}
          </button>

          <p className="mt-3 text-center text-xs text-gray-500">
            {isLoading
              ? 'Please wait while we process your transaction...'
              : 'Click to execute the swap transaction'}
          </p>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-gray-500">Secure • Fast • Reliable</p>
    </div>
  )
}

export default CurrencySwapForm
