interface ExchangeRateProps {
  fromCurrency: string
  toCurrency: string
  exchangeRate: number
  show: boolean
}

const ExchangeRate = ({ fromCurrency, toCurrency, exchangeRate, show }: ExchangeRateProps) => {
  if (!show || exchangeRate <= 0) return null

  return (
    <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-600">Exchange Rate:</span>
        <span className="font-medium text-gray-900">
          1 {fromCurrency} = {exchangeRate.toFixed(6)} {toCurrency}
        </span>
      </div>
    </div>
  )
}

export default ExchangeRate
