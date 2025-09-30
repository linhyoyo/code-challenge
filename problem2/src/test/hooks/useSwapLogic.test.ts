import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useSwapLogic } from '../../hooks/useSwapLogic'

describe('useSwapLogic', () => {
  it('returns getTokenIcon function', () => {
    const { result } = renderHook(() => useSwapLogic())

    expect(typeof result.current.getTokenIcon).toBe('function')
  })

  it('generates correct icon URL for regular currency', () => {
    const { result } = renderHook(() => useSwapLogic())

    const iconUrl = result.current.getTokenIcon('ETH')
    expect(iconUrl).toBe(
      'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/ETH.svg'
    )
  })

  it('generates correct icon URL for mapped currency', () => {
    const { result } = renderHook(() => useSwapLogic())

    const iconUrl = result.current.getTokenIcon('STATOM')
    expect(iconUrl).toBe(
      'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/stATOM.svg'
    )
  })

  it('handles all mapped currencies correctly', () => {
    const { result } = renderHook(() => useSwapLogic())

    const testCases = [
      { input: 'STATOM', expected: 'stATOM' },
      { input: 'RATOM', expected: 'rATOM' },
      { input: 'STEVMOS', expected: 'stEVMOS' },
      { input: 'STLUNA', expected: 'stLUNA' },
      { input: 'STOSMO', expected: 'stOSMO' },
    ]

    testCases.forEach(({ input, expected }) => {
      const iconUrl = result.current.getTokenIcon(input)
      expect(iconUrl).toBe(
        `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${expected}.svg`
      )
    })
  })

  it('uses original currency name for unmapped currencies', () => {
    const { result } = renderHook(() => useSwapLogic())

    const iconUrl = result.current.getTokenIcon('UNKNOWN')
    expect(iconUrl).toBe(
      'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/UNKNOWN.svg'
    )
  })

  it('handles empty string input', () => {
    const { result } = renderHook(() => useSwapLogic())

    const iconUrl = result.current.getTokenIcon('')
    expect(iconUrl).toBe('https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/.svg')
  })
})
