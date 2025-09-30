import { useCallback } from 'react'
import { TOKEN_ICON_MAP } from '../constants/currencies'
import { API_ENDPOINTS } from '../constants/api'

export const useSwapLogic = () => {
  const getTokenIcon = useCallback((currency: string) => {
    const iconName = TOKEN_ICON_MAP[currency] || currency
    return `${API_ENDPOINTS.TOKEN_ICONS}/${iconName}.svg`
  }, [])

  return {
    getTokenIcon,
  }
}
