import { useState, type ReactNode } from 'react'
import { useGMAuthStore } from '@/store/gmAuthStore'
import { Button } from '@/components/ui/Button'

interface GMPasswordGateProps {
  children: ReactNode
}

export function GMPasswordGate({ children }: GMPasswordGateProps) {
  const { isAuthenticated, authenticate } = useGMAuthStore()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  if (isAuthenticated) return <>{children}</>

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const ok = authenticate(password)
    if (!ok) {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div
      className="flex items-center justify-center h-full"
      style={{ background: 'var(--color-void)' }}
    >
      <div
        className="w-80 rounded-xl p-8 flex flex-col gap-5"
        style={{
          background: 'var(--color-deep-storm)',
          border: '1px solid var(--color-storm-mid)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* Icon + title */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
            style={{ background: 'rgba(212,160,23,0.15)', border: '1px solid var(--color-gold)' }}
          >
            🔒
          </div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--color-gold-bright)' }}>
            GM Access Required
          </h2>
          <p className="text-xs" style={{ color: 'var(--color-fog)' }}>
            Enter the GM password to access campaign tools.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            placeholder="Password"
            autoFocus
            className="w-full text-sm rounded px-3 py-2.5 text-center tracking-widest"
            style={{
              background: 'var(--color-storm)',
              border: `1px solid ${error ? 'var(--color-health)' : 'var(--color-storm-light)'}`,
              color: 'var(--color-pale)',
              outline: 'none',
            }}
          />
          {error && (
            <p className="text-xs text-center" style={{ color: 'var(--color-health)' }}>
              Incorrect password.
            </p>
          )}
          <Button type="submit" variant="primary" disabled={!password}>
            Unlock
          </Button>
        </form>
      </div>
    </div>
  )
}
