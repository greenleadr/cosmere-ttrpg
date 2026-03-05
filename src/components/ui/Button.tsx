import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

const VARIANT_STYLES = {
  primary: {
    background: 'var(--color-gold-dim)',
    border: '1px solid var(--color-gold)',
    color: 'var(--color-gold-bright)',
  },
  secondary: {
    background: 'var(--color-storm-mid)',
    border: '1px solid var(--color-storm-light)',
    color: 'var(--color-pale)',
  },
  ghost: {
    background: 'transparent',
    border: '1px solid transparent',
    color: 'var(--color-fog)',
  },
  danger: {
    background: 'rgba(192,32,32,0.2)',
    border: '1px solid var(--color-health-low)',
    color: 'var(--color-health)',
  },
}

const SIZE_CLASSES = {
  sm: 'px-2 py-1 text-xs rounded',
  md: 'px-3 py-1.5 text-sm rounded-md',
  lg: 'px-4 py-2 text-base rounded-lg',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={`font-medium transition-opacity hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed ${SIZE_CLASSES[size]} ${className}`}
      style={VARIANT_STYLES[variant]}
    >
      {children}
    </button>
  )
}
