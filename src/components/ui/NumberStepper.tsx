interface NumberStepperProps {
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
  disabled?: boolean
  size?: 'sm' | 'md'
  label?: string
}

export function NumberStepper({
  value,
  min = 0,
  max = 99,
  onChange,
  disabled = false,
  size = 'md',
  label,
}: NumberStepperProps) {
  const btnClass =
    size === 'sm'
      ? 'w-5 h-5 text-xs'
      : 'w-7 h-7 text-sm'

  const valClass =
    size === 'sm'
      ? 'w-6 text-sm font-mono'
      : 'w-8 text-base font-mono'

  return (
    <div className="flex items-center gap-1">
      {label && (
        <span className="text-xs mr-1" style={{ color: 'var(--color-fog)' }}>
          {label}
        </span>
      )}
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={disabled || value <= min}
        className={`${btnClass} flex items-center justify-center rounded font-bold transition-colors disabled:opacity-30`}
        style={{
          background: 'var(--color-storm-mid)',
          color: 'var(--color-pale)',
          border: '1px solid var(--color-storm-light)',
        }}
        aria-label={`Decrease ${label ?? 'value'}`}
      >
        −
      </button>
      <span
        className={`${valClass} text-center select-none`}
        style={{ color: 'var(--color-white)' }}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={disabled || value >= max}
        className={`${btnClass} flex items-center justify-center rounded font-bold transition-colors disabled:opacity-30`}
        style={{
          background: 'var(--color-storm-mid)',
          color: 'var(--color-pale)',
          border: '1px solid var(--color-storm-light)',
        }}
        aria-label={`Increase ${label ?? 'value'}`}
      >
        +
      </button>
    </div>
  )
}
