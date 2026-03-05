import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?: string
  onClick?: () => void
  className?: string
}

export function Badge({ children, color, onClick, className = '' }: BadgeProps) {
  const Tag = onClick ? 'button' : 'span'
  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium select-none ${
        onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : ''
      } ${className}`}
      style={{
        background: color ? `${color}33` : 'var(--color-storm-mid)',
        border: `1px solid ${color ?? 'var(--color-storm-light)'}`,
        color: color ?? 'var(--color-pale)',
      }}
    >
      {children}
    </Tag>
  )
}
