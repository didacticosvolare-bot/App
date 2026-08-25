import React, { useState } from 'react'

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({
    label,
    error,
    hint,
    required,
    icon,
    iconPosition = 'left',
    id,
    className = '',
    disabled,
    type = 'text',
    ...props
  }, ref) => {
    const inputId = id || `input-${Math.random()}`

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            disabled={disabled}
            className={`
              w-full px-4 py-2 text-base
              border-2 rounded-lg
              transition-colors duration-200
              font-family-base
              focus:outline-none focus:ring-2 focus:ring-offset-2
              disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
              ${icon && iconPosition === 'left' ? 'pl-10' : ''}
              ${icon && iconPosition === 'right' ? 'pr-10' : ''}
              ${error
                ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
                : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
              }
              ${className}
            `}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />

          {icon && iconPosition === 'right' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 pointer-events-none">
              {icon}
            </div>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-error-600 font-medium">
            ✕ {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-neutral-500">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

FormInput.displayName = 'FormInput'

// Select Component
interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  options: Array<{ value: string; label: string }>
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
  ({
    label,
    error,
    hint,
    required,
    id,
    options,
    className = '',
    disabled,
    ...props
  }, ref) => {
    const inputId = id || `select-${Math.random()}`

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`
            w-full px-4 py-2 text-base
            border-2 rounded-lg
            transition-colors duration-200
            font-family-base
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
            appearance-none bg-right bg-no-repeat bg-contain
            ${error
              ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
              : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
            }
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-error-600 font-medium">
            ✕ {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-neutral-500">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

FormSelect.displayName = 'FormSelect'

// Textarea Component
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  hint?: string
  required?: boolean
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({
    label,
    error,
    hint,
    required,
    id,
    className = '',
    disabled,
    ...props
  }, ref) => {
    const inputId = id || `textarea-${Math.random()}`

    return (
      <div className="flex flex-col gap-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-neutral-700">
            {label}
            {required && <span className="text-error-500 ml-1">*</span>}
          </label>
        )}

        <textarea
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`
            w-full px-4 py-2 text-base
            border-2 rounded-lg
            transition-colors duration-200
            font-family-base resize-none
            focus:outline-none focus:ring-2 focus:ring-offset-2
            disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed
            ${error
              ? 'border-error-300 focus:border-error-500 focus:ring-error-500'
              : 'border-neutral-300 focus:border-primary-500 focus:ring-primary-500'
            }
            ${className}
          `}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
          {...props}
        />

        {error && (
          <p id={`${inputId}-error`} className="text-sm text-error-600 font-medium">
            ✕ {error}
          </p>
        )}

        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-sm text-neutral-500">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

FormTextarea.displayName = 'FormTextarea'
