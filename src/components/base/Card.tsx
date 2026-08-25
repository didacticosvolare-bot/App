import React from 'react'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined'
  hover?: boolean
}

const variantClasses: Record<string, string> = {
  default: 'bg-white border border-neutral-200',
  elevated: 'bg-white shadow-lg',
  outlined: 'bg-neutral-50 border-2 border-neutral-200',
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ variant = 'default', hover = true, className = '', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`
          rounded-lg p-6
          ${variantClasses[variant]}
          ${hover ? 'transition-shadow duration-200 hover:shadow-xl' : ''}
          ${className}
        `}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

// Card Header
interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className = '', ...props }, ref) => (
    <div
      ref={ref}
      className={`mb-4 pb-4 border-b border-neutral-200 ${className}`}
      {...props}
    />
  )
)

CardHeader.displayName = 'CardHeader'

// Card Title
interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

export const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className = '', ...props }, ref) => (
    <h2
      ref={ref}
      className={`text-2xl font-bold text-neutral-900 ${className}`}
      {...props}
    />
  )
)

CardTitle.displayName = 'CardTitle'

// Card Content
interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`text-neutral-600 ${className}`} {...props} />
  )
)

CardContent.displayName = 'CardContent'

// Metric Card (specialized)
interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  icon?: React.ReactNode
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}

const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
  primary: { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-200' },
  secondary: { bg: 'bg-secondary-50', text: 'text-secondary-600', border: 'border-secondary-200' },
  success: { bg: 'bg-success-50', text: 'text-success-600', border: 'border-success-200' },
  warning: { bg: 'bg-warning-50', text: 'text-warning-600', border: 'border-warning-200' },
  error: { bg: 'bg-error-50', text: 'text-error-600', border: 'border-error-200' },
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  color = 'primary',
}) => {
  const colors = colorClasses[color]

  return (
    <Card className={`${colors.bg} border-l-4 ${colors.border}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-neutral-600 font-medium">{title}</p>
          <p className={`text-3xl font-bold ${colors.text} mt-2`}>{value}</p>
          {subtitle && <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className="flex items-center gap-1 mt-2">
              <span className={`text-sm font-semibold ${trend.isPositive ? 'text-success-600' : 'text-error-600'}`}>
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        {icon && <div className={`text-3xl ${colors.text}`}>{icon}</div>}
      </div>
    </Card>
  )
}
