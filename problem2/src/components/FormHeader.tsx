interface FormHeaderProps {
  title: string
  subtitle: string
  className?: string
}

const FormHeader = ({ title, subtitle, className = '' }: FormHeaderProps) => {
  return (
    <div className={`mb-8 text-center ${className}`}>
      <h1 className="mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
        {title}
      </h1>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  )
}

export default FormHeader
