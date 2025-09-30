import type { ReactNode } from 'react'
import { ArrowsUpDownIcon } from '@heroicons/react/24/outline'

interface FormButtonProps {
  type: 'submit' | 'button'
  onClick?: () => void
  disabled?: boolean
  isLoading?: boolean
  loadingText?: string
  children: ReactNode
  className?: string
  variant?: 'primary' | 'swap'
}

const FormButton = ({
  type,
  onClick,
  disabled = false,
  isLoading = false,
  loadingText = 'Processing...',
  children,
  className = '',
  variant = 'primary',
}: FormButtonProps) => {
  const baseClasses = 'font-semibold transition-all'

  const variantClasses = {
    primary:
      'flex w-full transform items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-4 text-white shadow-lg hover:scale-[1.02] hover:from-blue-700 hover:to-purple-700 hover:shadow-xl active:scale-[0.98] disabled:cursor-not-allowed disabled:from-gray-300 disabled:to-gray-400',
    swap: 'transform rounded-full bg-gradient-to-r from-blue-500 to-purple-500 p-3 shadow-lg transition-all hover:scale-110 hover:from-blue-600 hover:to-purple-600 hover:shadow-xl',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {isLoading ? (
        <>
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          {loadingText}
        </>
      ) : variant === 'swap' ? (
        <ArrowsUpDownIcon className="h-5 w-5 text-white" />
      ) : (
        children
      )}
    </button>
  )
}

export default FormButton
