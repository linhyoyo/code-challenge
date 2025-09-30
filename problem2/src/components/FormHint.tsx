interface FormHintProps {
  isLoading: boolean
  className?: string
}

const FormHint = ({ isLoading, className = '' }: FormHintProps) => {
  return (
    <p className={`mt-3 text-center text-xs text-gray-500 ${className}`}>
      {isLoading
        ? 'Please wait while we process your transaction...'
        : 'Click to execute the swap transaction'}
    </p>
  )
}

export default FormHint
