import { type UseFormRegister, type FieldErrors } from 'react-hook-form'
import { AlertTriangle } from 'lucide-react'

interface FormInputProps {
  register: UseFormRegister<any>
  errors: FieldErrors<any>
  fieldName: string
  placeholder: string
  value?: string
  readOnly?: boolean
  validation?: any
  showUsdValue?: boolean
  usdValue?: string
  className?: string
}

const FormInput = ({
  register,
  errors,
  fieldName,
  placeholder,
  value,
  readOnly = false,
  validation,
  showUsdValue = false,
  usdValue,
  className = '',
}: FormInputProps) => {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <input
        {...(readOnly ? { value } : register(fieldName, validation))}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full rounded-xl border border-gray-300 px-4 py-3 text-lg outline-none focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
          readOnly ? 'cursor-not-allowed bg-gray-50' : ''
        } ${className}`}
      />
      {errors[fieldName] && (
        <p className="mt-1 flex items-center gap-1 text-sm text-red-500">
          <AlertTriangle className="h-4 w-4" />
          {errors[fieldName]?.message as string}
        </p>
      )}
      {showUsdValue && usdValue && <p className="mt-1 text-sm text-gray-500">{usdValue}</p>}
    </div>
  )
}

export default FormInput
