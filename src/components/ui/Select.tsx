interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function Select({ value, onChange, options, placeholder, disabled, className = '' }: SelectProps) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      disabled={disabled}
      className={`text-sm rounded px-2 py-1.5 ${className}`}
      style={{
        background: 'var(--color-storm)',
        border: '1px solid var(--color-storm-light)',
        color: value ? 'var(--color-pale)' : 'var(--color-fog)',
        outline: 'none',
        minWidth: '120px',
      }}
    >
      {placeholder && (
        <option value="" style={{ color: 'var(--color-fog)' }}>
          {placeholder}
        </option>
      )}
      {options.map(o => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
}
