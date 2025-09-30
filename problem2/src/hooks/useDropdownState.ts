import { useState, useEffect } from 'react'

export const useDropdownState = () => {
  const [showFromDropdown, setShowFromDropdown] = useState(false)
  const [showToDropdown, setShowToDropdown] = useState(false)

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

  const toggleFromDropdown = () => {
    setShowFromDropdown(!showFromDropdown)
    setShowToDropdown(false)
  }

  const toggleToDropdown = () => {
    setShowToDropdown(!showToDropdown)
    setShowFromDropdown(false)
  }

  const closeFromDropdown = () => setShowFromDropdown(false)
  const closeToDropdown = () => setShowToDropdown(false)

  return {
    showFromDropdown,
    showToDropdown,
    toggleFromDropdown,
    toggleToDropdown,
    closeFromDropdown,
    closeToDropdown,
  }
}
