import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  width?: string
}

export function Modal({ open, onClose, title, children, width = '560px' }: ModalProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col max-h-[90vh] overflow-hidden rounded-lg"
        style={{
          width,
          maxWidth: 'calc(100vw - 32px)',
          background: 'var(--color-deep-storm)',
          border: '1px solid var(--color-storm-mid)',
          boxShadow: '0 24px 64px rgba(0,0,0,0.8)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {title && (
          <div
            className="flex items-center justify-between px-5 py-3 shrink-0"
            style={{ borderBottom: '1px solid var(--color-storm-mid)' }}
          >
            <h2 className="text-base font-semibold" style={{ color: 'var(--color-gold-bright)' }}>
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-lg leading-none px-1 hover:opacity-70"
              style={{ color: 'var(--color-fog)' }}
            >
              ✕
            </button>
          </div>
        )}
        <div className="overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}
