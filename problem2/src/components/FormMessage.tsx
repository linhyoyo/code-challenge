import { AlertTriangle, CheckCircle } from 'lucide-react'

interface FormMessageProps {
  type: 'error' | 'success'
  message: string
  show: boolean
}

const FormMessage = ({ type, message, show }: FormMessageProps) => {
  if (!show) return null

  const isError = type === 'error'
  const Icon = isError ? AlertTriangle : CheckCircle
  const containerClasses = `
    mb-4 flex items-center gap-2 rounded-xl border p-3
    ${
      isError
        ? 'border-red-100 bg-red-50 text-red-600'
        : 'border-green-100 bg-green-50 text-green-600'
    }
  `

  return (
    <div className={containerClasses}>
      <Icon className="h-5 w-5" />
      <span className={`text-sm ${isError ? '' : 'font-medium'}`}>{message}</span>
    </div>
  )
}

export default FormMessage
