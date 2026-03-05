import { useState, useRef, type ReactNode } from 'react'

interface TooltipProps {
  content: string
  children: ReactNode
  className?: string
}

export function Tooltip({ content, children, className = '' }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 text-xs rounded-md shadow-lg pointer-events-none max-w-xs text-left whitespace-normal"
          style={{
            background: 'var(--color-storm)',
            border: '1px solid var(--color-storm-light)',
            color: 'var(--color-pale)',
            minWidth: '160px',
          }}
        >
          {content}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2"
            style={{
              width: 0,
              height: 0,
              borderLeft: '5px solid transparent',
              borderRight: '5px solid transparent',
              borderTop: '5px solid var(--color-storm)',
            }}
          />
        </div>
      )}
    </div>
  )
}
