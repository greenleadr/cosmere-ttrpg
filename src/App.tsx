import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import { CharacterPage } from '@/pages/CharacterPage'
import { GMPage } from '@/pages/GMPage'
import { CombatPage } from '@/pages/CombatPage'
import { AdversaryPage } from '@/pages/AdversaryPage'

export function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col h-screen" style={{ background: 'var(--color-void)' }}>
        {/* Top nav */}
        <nav
          className="flex items-center gap-1 px-4 py-2 flex-shrink-0"
          style={{
            background: 'var(--color-deep-storm)',
            borderBottom: '1px solid var(--color-storm-mid)',
          }}
        >
          <span
            className="text-sm font-bold mr-4 tracking-widest uppercase"
            style={{ color: 'var(--color-gold)' }}
          >
            Cosmere RPG
          </span>
          {[
            { to: '/', label: 'Character' },
            { to: '/gm', label: 'GM Dashboard' },
            { to: '/combat', label: 'Combat' },
            { to: '/adversaries', label: 'Adversaries' },
          ].map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded text-sm transition-colors ${
                  isActive ? 'font-medium' : ''
                }`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--color-gold-bright)' : 'var(--color-fog)',
                background: isActive ? 'var(--color-storm-mid)' : 'transparent',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Page content */}
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<CharacterPage />} />
            <Route path="/character/:id" element={<CharacterPage />} />
            <Route path="/gm" element={<GMPage />} />
            <Route path="/combat" element={<CombatPage />} />
            <Route path="/adversaries" element={<AdversaryPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
