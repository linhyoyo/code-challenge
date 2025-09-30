import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDropdownState } from '../../hooks/useDropdownState'

describe('useDropdownState', () => {
  beforeEach(() => {
    vi.spyOn(document, 'addEventListener')
    vi.spyOn(document, 'removeEventListener')
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('initializes with both dropdowns closed', () => {
    const { result } = renderHook(() => useDropdownState())

    expect(result.current.showFromDropdown).toBe(false)
    expect(result.current.showToDropdown).toBe(false)
  })

  it('toggles from dropdown correctly', () => {
    const { result } = renderHook(() => useDropdownState())

    act(() => {
      result.current.toggleFromDropdown()
    })

    expect(result.current.showFromDropdown).toBe(true)
    expect(result.current.showToDropdown).toBe(false)
  })

  it('toggles to dropdown correctly', () => {
    const { result } = renderHook(() => useDropdownState())

    act(() => {
      result.current.toggleToDropdown()
    })

    expect(result.current.showFromDropdown).toBe(false)
    expect(result.current.showToDropdown).toBe(true)
  })

  it('closes to dropdown when from dropdown is opened', () => {
    const { result } = renderHook(() => useDropdownState())

    act(() => {
      result.current.toggleToDropdown()
    })

    expect(result.current.showToDropdown).toBe(true)

    act(() => {
      result.current.toggleFromDropdown()
    })

    expect(result.current.showFromDropdown).toBe(true)
    expect(result.current.showToDropdown).toBe(false)
  })

  it('closes from dropdown when to dropdown is opened', () => {
    const { result } = renderHook(() => useDropdownState())

    act(() => {
      result.current.toggleFromDropdown()
    })

    expect(result.current.showFromDropdown).toBe(true)

    act(() => {
      result.current.toggleToDropdown()
    })

    expect(result.current.showFromDropdown).toBe(false)
    expect(result.current.showToDropdown).toBe(true)
  })

  it('closes from dropdown correctly', () => {
    const { result } = renderHook(() => useDropdownState())

    act(() => {
      result.current.toggleFromDropdown()
    })

    expect(result.current.showFromDropdown).toBe(true)

    act(() => {
      result.current.closeFromDropdown()
    })

    expect(result.current.showFromDropdown).toBe(false)
  })

  it('closes to dropdown correctly', () => {
    const { result } = renderHook(() => useDropdownState())

    act(() => {
      result.current.toggleToDropdown()
    })

    expect(result.current.showToDropdown).toBe(true)

    act(() => {
      result.current.closeToDropdown()
    })

    expect(result.current.showToDropdown).toBe(false)
  })

  it('adds and removes event listeners', () => {
    const { unmount } = renderHook(() => useDropdownState())

    expect(document.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function))

    unmount()

    expect(document.removeEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function))
  })
})
