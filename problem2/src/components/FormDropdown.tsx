import React from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  ;(e.target as HTMLImageElement).src =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSI0IiB5PSI0IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiPgo8L3N2Zz4KPC9zdmc+'
}

interface FormDropdownProps {
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
  selectedCurrency: string
  currencies: string[]
  onSelect: (currency: string) => void
  getTokenIcon: (currency: string) => string
  className?: string
}

const FormDropdown = ({
  isOpen,
  onToggle,
  onClose,
  selectedCurrency,
  currencies,
  onSelect,
  getTokenIcon,
  className = '',
}: FormDropdownProps) => {
  return (
    <div className={`dropdown-container relative flex-shrink-0 ${className}`}>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-40 items-center justify-between rounded-xl border border-gray-300 bg-white px-4 py-4 text-sm outline-none hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
      >
        <div className="flex items-center gap-2">
          <img
            src={getTokenIcon(selectedCurrency)}
            alt={selectedCurrency}
            className="h-5 w-5"
            onError={handleImageError}
          />
          <span className="font-medium">{selectedCurrency}</span>
        </div>
        <ChevronDownIcon className="h-4 w-4" />
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-gray-300 bg-white shadow-lg">
          {currencies.map((currency) => (
            <button
              key={currency}
              type="button"
              onClick={() => {
                onSelect(currency)
                onClose()
              }}
              className="flex w-full items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50"
            >
              <img
                src={getTokenIcon(currency)}
                alt={currency}
                className="h-5 w-5"
                onError={handleImageError}
              />
              <span className="font-medium">{currency}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default FormDropdown
