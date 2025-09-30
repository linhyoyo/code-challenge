export const CURRENCIES = [
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

export const TOKEN_ICON_MAP: Record<string, string> = {
  STATOM: 'stATOM',
  RATOM: 'rATOM',
  STEVMOS: 'stEVMOS',
  STLUNA: 'stLUNA',
  STOSMO: 'stOSMO',
}

export const API_ENDPOINTS = {
  PRICES: 'https://interview.switcheo.com/prices.json',
  TOKEN_ICONS: 'https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens',
} as const

export const FORM_DEFAULTS = {
  FROM_CURRENCY: 'ETH',
  TO_CURRENCY: 'USDC',
  FROM_AMOUNT: '',
} as const
