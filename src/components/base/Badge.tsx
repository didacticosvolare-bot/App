import React from 'react'

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'neutral'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: BadgeSize
  icon?: React.ReactNode
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-800 border border-primary-300',
  secondary: 'bg-secondary-100 text-secondary-800 border border-secondary-300',
  success: 'bg-success-100 text-success-800 border border-success-300',
  warning: 'bg-warning-100 text-warning-800 border border-warning-300',
  error: 'bg-error-100 text-error-800 border border-error-300',
  neutral: 'bg-neutral-100 text-neutral-800 border border-neutral-300',
}

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs font-medium rounded',
  md: 'px-3 py-1 text-sm font-medium rounded-md',
  lg: 'px-4 py-2 text-base font-semibold rounded-lg',
}

const dotColorClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-500',
  secondary: 'bg-secondary-500',
  success: 'bg-success-500',
  warning: 'bg-warning-500',
  error: 'bg-error-500',
  neutral: 'bg-neutral-500',
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  icon,
  dot,
  className = '',
  children,
  ...props
}) => {
  return (
    <span
      className={`
        inline-flex items-center gap-2
        font-family-base font-medium
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      {...props}
    >
      {dot && <span className={`w-2 h-2 rounded-full ${dotColorClasses[variant]}`} />}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </span>
  )
}

// Alert Component
type AlertVariant = 'success' | 'warning' | 'error' | 'info'

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant
  title?: string
  icon?: React.ReactNode
  closeable?: boolean
  onClose?: () => void
}

const alertClasses: Record<AlertVariant, { bg: string; border: string; text: string; icon: string }> = {
  success: {
    bg: 'bg-success-50',
    border: 'border-success-300',
    text: 'text-success-800',
    icon: 'text-success-600',
  },
  warning: {
    bg: 'bg-warning-50',
    border: 'border-warning-300',
    text: 'text-warning-800',
    icon: 'text-warning-600',
  },
  error: {
    bg: 'bg-error-50',
    border: 'border-error-300',
    text: 'text-error-800',
    icon: 'text-error-600',
  },
  info: {
    bg: 'bg-secondary-50',
    border: 'border-secondary-300',
    text: 'text-secondary-800',
    icon: 'text-secondary-600',
  },
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  icon,
  closeable,
  onClose,
  className = '',
  children,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(true)

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  if (!isOpen) return null

  const classes = alertClasses[variant]

  return (
    <div
      className={`
        border-l-4 rounded-lg p-4
        ${classes.bg} ${classes.border} ${classes.text}
        flex gap-3
        ${className}
      `}
      role="alert"
      {...props}
    >
      {icon && <div className={`flex-shrink-0 mt-0.5 ${classes.icon}`}>{icon}</div>}

      <div className="flex-1">
        {title && <p className="font-semibold mb-1">{title}</p>}
        <p className="text-sm">{children}</p>
      </div>

      {closeable && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 text-lg font-bold opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Cerrar"
        >
          ✕
        </button>
      )}
    </div>
  )
}
