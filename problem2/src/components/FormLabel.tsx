import type { ReactNode } from 'react'

interface FormLabelProps {
  children: ReactNode
  className?: string
}

const FormLabel = ({ children, className = '' }: FormLabelProps) => {
  return (
    <label className={`mb-2 block text-sm font-medium text-gray-700 ${className}`}>
      {children}
    </label>
  )
}

export default FormLabel
