import { BrowserRouter, Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { CharacterPage } from '@/pages/CharacterPage'
import { GMPage } from '@/pages/GMPage'
import { CombatPage } from '@/pages/CombatPage'
import { AdversaryPage } from '@/pages/AdversaryPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { GMPasswordGate } from '@/components/auth/GMPasswordGate'
import { useDBSync } from '@/hooks/useDBSync'
import { useGMAuthStore } from '@/store/gmAuthStore'

function AppInner() {
  useDBSync()
  return null
}

function TopNav() {
  const { isAuthenticated, deauthenticate } = useGMAuthStore()
  const navigate = useNavigate()

  const playerLinks = [
    { to: '/', label: 'My Characters', end: true },
    { to: '/settings', label: 'Settings', end: false },
  ]

  const gmLinks = [
    { to: '/', label: 'My Characters', end: true },
    { to: '/gm', label: 'GM Dashboard', end: false },
    { to: '/combat', label: 'Combat', end: false },
    { to: '/adversaries', label: 'Adversaries', end: false },
    { to: '/settings', label: 'Settings', end: false },
  ]

  const links = isAuthenticated ? gmLinks : playerLinks

  function handleLockGM() {
    deauthenticate()
    navigate('/')
  }

  return (
    <nav
      className="flex items-center px-4 py-2 flex-shrink-0"
      style={{
        background: 'var(--color-deep-storm)',
        borderBottom: '1px solid var(--color-storm-mid)',
      }}
    >
      <span
        className="text-sm font-bold mr-4 tracking-widest uppercase shrink-0"
        style={{ color: 'var(--color-gold)' }}
      >
        Cosmere RPG
      </span>

      {/* Main links */}
      <div className="flex items-center gap-1 flex-1">
        {links.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `px-3 py-1.5 rounded text-sm transition-colors ${isActive ? 'font-medium' : ''}`
            }
            style={({ isActive }) => ({
              color: isActive ? 'var(--color-gold-bright)' : 'var(--color-fog)',
              background: isActive ? 'var(--color-storm-mid)' : 'transparent',
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </div>

      {/* Right side: GM toggle */}
      {isAuthenticated ? (
        <button
          type="button"
          onClick={handleLockGM}
          className="text-xs px-3 py-1.5 rounded transition-opacity hover:opacity-80"
          style={{
            background: 'var(--color-storm)',
            border: '1px solid var(--color-storm-light)',
            color: 'var(--color-fog)',
          }}
        >
          🔒 Lock GM
        </button>
      ) : (
        <NavLink
          to="/gm"
          className="text-xs px-3 py-1.5 rounded transition-opacity hover:opacity-80"
          style={{
            background: 'transparent',
            border: '1px solid var(--color-storm-light)',
            color: 'var(--color-fog)',
          }}
        >
          GM Login →
        </NavLink>
      )}
    </nav>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen" style={{ background: 'var(--color-void)' }}>
        <AppInner />
        <TopNav />

        {/* Page content */}
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<CharacterPage />} />
            <Route path="/character/:id" element={<CharacterPage />} />
            <Route path="/gm" element={<GMPasswordGate><GMPage /></GMPasswordGate>} />
            <Route path="/combat" element={<GMPasswordGate><CombatPage /></GMPasswordGate>} />
            <Route path="/adversaries" element={<GMPasswordGate><AdversaryPage /></GMPasswordGate>} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
