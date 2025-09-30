import { useState, useEffect } from 'react'
import { API_ENDPOINTS } from '../constants/api'

interface Token {
  currency: string
  price: number
  icon?: string
}

export const useTokenPrices = () => {
  const [tokens, setTokens] = useState<Token[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(API_ENDPOINTS.PRICES)
        if (!response.ok) {
          throw new Error('Failed to fetch prices')
        }
        const data = await response.json()
        setTokens(data)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch prices'
        setError(errorMessage)
        console.error('Failed to fetch prices:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrices()
  }, [])

  const priceMap = tokens.reduce(
    (acc, token) => {
      acc[token.currency] = token.price
      return acc
    },
    {} as Record<string, number>
  )

  return {
    tokens,
    priceMap,
    isLoading: isLoading,
    error,
  }
}
