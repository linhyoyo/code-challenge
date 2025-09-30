import { renderHook, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useTokenPrices } from '../../hooks/useTokenPrices'

// Mock fetch
globalThis.fetch = vi.fn()

const mockTokenData = [
  { currency: 'ETH', price: 2000 },
  { currency: 'USDC', price: 1 },
  { currency: 'BTC', price: 40000 },
]

describe('useTokenPrices', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('fetches token prices on mount', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenData,
    })

    const { result } = renderHook(() => useTokenPrices())

    await waitFor(() => {
      expect(result.current.tokens).toEqual(mockTokenData)
    })

    expect(fetch).toHaveBeenCalledWith('https://interview.switcheo.com/prices.json')
  })

  it('creates price map correctly', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenData,
    })

    const { result } = renderHook(() => useTokenPrices())

    await waitFor(() => {
      expect(result.current.priceMap).toEqual({
        ETH: 2000,
        USDC: 1,
        BTC: 40000,
      })
    })
  })

  it('handles fetch error', async () => {
    ;(fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const { result } = renderHook(() => useTokenPrices())

    await waitFor(() => {
      expect(result.current.error).toBe('Network error')
    })

    expect(result.current.tokens).toEqual([])
  })

  it('handles non-ok response', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    })

    const { result } = renderHook(() => useTokenPrices())

    await waitFor(() => {
      expect(result.current.error).toBe('Failed to fetch prices')
    })
  })

  it('sets loading state correctly', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockTokenData,
    })

    const { result } = renderHook(() => useTokenPrices())

    expect(result.current.isLoading).toBe(true)

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })
  })
})
