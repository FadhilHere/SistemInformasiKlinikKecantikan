const variantClassMap = {
  primary: 'bg-primary text-white shadow-button hover:bg-[#48af16]',
  ghost: 'bg-lime-50 text-primary-dark border border-primary hover:bg-white',
  outline:
    'border border-brand/30 bg-white text-brand hover:border-primary hover:text-primary',
  light:
    'bg-white/20 text-white border border-white/40 hover:bg-white/30 hover:text-white'
}

const Button = ({
  children,
  variant = 'primary',
  className = '',
  type = 'button',
  ...props
}) => {
  const variantClasses = variantClassMap[variant] ?? variantClassMap.primary
  const buttonClassName = [
    'inline-flex items-center justify-center rounded-full px-7 py-2.5 font-semibold transition-transform duration-150',
    'hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary/50',
    variantClasses,
    className
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={buttonClassName} {...props}>
      {children}
    </button>
  )
}

export default Button
