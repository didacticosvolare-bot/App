import React from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700',
  secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 active:bg-secondary-700',
  success: 'bg-success-500 text-white hover:bg-success-600 active:bg-success-700',
  warning: 'bg-warning-500 text-white hover:bg-warning-600 active:bg-warning-700',
  error: 'bg-error-500 text-white hover:bg-error-600 active:bg-error-700',
  ghost: 'bg-transparent text-primary-600 hover:bg-primary-50 active:bg-primary-100',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm font-medium rounded-md',
  md: 'px-4 py-2 text-base font-medium rounded-lg',
  lg: 'px-6 py-3 text-lg font-semibold rounded-lg',
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          inline-flex items-center justify-center gap-2
          font-family-heading font-medium transition-colors duration-200
          disabled:opacity-50 disabled:cursor-not-allowed
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
          ${variantClasses[variant]}
          ${sizeClasses[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading && (
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        )}
        {icon && iconPosition === 'left' && !isLoading && <span className="flex-shrink-0">{icon}</span>}
        {children}
        {icon && iconPosition === 'right' && !isLoading && <span className="flex-shrink-0">{icon}</span>}
      </button>
    )
  }
)

Button.displayName = 'Button'
