import { type InputHTMLAttributes } from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onChange?: (value: string) => void
  label?: string
}

export function Input({ onChange, label, className = '', ...rest }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium" style={{ color: 'var(--color-fog)' }}>
          {label}
        </label>
      )}
      <input
        {...rest}
        onChange={e => onChange?.(e.target.value)}
        className={`text-sm rounded px-2.5 py-1.5 ${className}`}
        style={{
          background: 'var(--color-storm)',
          border: '1px solid var(--color-storm-light)',
          color: 'var(--color-pale)',
          outline: 'none',
        }}
      />
    </div>
  )
}

interface TextareaProps extends Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  onChange?: (value: string) => void
  label?: string
  rows?: number
}

export function Textarea({ onChange, label, rows = 3, className = '', ...rest }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-medium" style={{ color: 'var(--color-fog)' }}>
          {label}
        </label>
      )}
      <textarea
        {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        rows={rows}
        onChange={e => onChange?.(e.target.value)}
        className={`text-sm rounded px-2.5 py-1.5 resize-y ${className}`}
        style={{
          background: 'var(--color-storm)',
          border: '1px solid var(--color-storm-light)',
          color: 'var(--color-pale)',
          outline: 'none',
        }}
      />
    </div>
  )
}
