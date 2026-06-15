import Spinner from './Spinner.jsx'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  ...props
}) {
  const variants = {
    primary: 'btn-primary',
    outline: 'btn-outline',
    ghost: 'btn text-gray-600 hover:bg-gray-100',
    danger: 'btn bg-red-500 text-white hover:bg-red-600'
  }
  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'text-base px-6 py-3'
  }

  return (
    <button
      disabled={disabled || loading}
      className={`${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && <Spinner size="sm" className="mr-2" />}
      {children}
    </button>
  )
}
