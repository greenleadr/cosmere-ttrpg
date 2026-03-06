import { useEffect, useState } from 'react'
import { useCharacterStore } from '@/store/characterStore'
import { useSessionStore } from '@/store/sessionStore'
import { CharacterSheet } from '@/components/character/CharacterSheet'
import { Button } from '@/components/ui/Button'
import { deleteCharacter } from '@/db/sync'

export function CharacterPage() {
  const { characters, activeCharacterId, addCharacter, removeCharacter, setActiveCharacter } = useCharacterStore()
  const { role, sessionCode, linkedCharacterId, initPlayerSession, initSoloMode } = useSessionStore()

  const charList = Object.values(characters)
  const activeChar = activeCharacterId ? characters[activeCharacterId] : charList[0] ?? null

  const [sessionOpen, setSessionOpen] = useState(role !== 'solo')
  const [codeInput, setCodeInput] = useState('')
  const [charInput, setCharInput] = useState('')

  // Pre-select linked char or first char in dropdown
  useEffect(() => {
    setCharInput(linkedCharacterId ?? charList[0]?.id ?? '')
  }, [linkedCharacterId, charList.length])

  useEffect(() => {
    if (!activeChar && charList.length === 0) {
      addCharacter()
    }
  }, [])

  function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name || 'Unnamed Character'}"? This cannot be undone.`)) return
    removeCharacter(id)
    void deleteCharacter(id)
  }

  function handleJoin() {
    const code = codeInput.trim()
    const charId = charInput
    if (!code || !charId) return
    initPlayerSession(code, charId)
    setCodeInput('')
  }

  function handleDisconnect() {
    initSoloMode()
  }

  const isConnected = role === 'player' && !!sessionCode

  if (!activeChar) {
    return (
      <div className="flex items-center justify-center h-full">
        <Button variant="primary" onClick={() => addCharacter()}>
          Create Character
        </Button>
      </div>
    )
  }

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div
        className="w-48 flex-shrink-0 flex flex-col"
        style={{ borderRight: '1px solid var(--color-storm-mid)', background: 'var(--color-deep-storm)' }}
      >
        {/* Character list */}
        <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
          {charList.map(c => (
            <div
              key={c.id}
              className="flex items-center gap-1 rounded"
              style={{
                background: c.id === activeChar.id ? 'var(--color-storm-mid)' : 'transparent',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveCharacter(c.id)}
                className="flex-1 text-left px-2 py-2 text-sm truncate"
                style={{ color: c.id === activeChar.id ? 'var(--color-gold-bright)' : 'var(--color-pale)' }}
              >
                {c.name || 'Unnamed'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(c.id, c.name)}
                className="px-1.5 py-1 text-xs rounded hover:opacity-80 shrink-0"
                style={{ color: 'var(--color-fog)' }}
                title="Delete character"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* New character button */}
        <div className="px-2 pt-2 shrink-0" style={{ borderTop: '1px solid var(--color-storm-mid)' }}>
          <Button variant="ghost" size="sm" onClick={() => addCharacter()}>
            + New Character
          </Button>
        </div>

        {/* Session panel */}
        <div
          className="shrink-0"
          style={{ borderTop: '1px solid var(--color-storm-mid)' }}
        >
          {/* Header */}
          <button
            type="button"
            onClick={() => setSessionOpen(o => !o)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-widest"
            style={{ color: 'var(--color-fog)' }}
          >
            <span>Session</span>
            <span>{sessionOpen ? '▲' : '▼'}</span>
          </button>

          {sessionOpen && (
            <div className="px-2 pb-3 flex flex-col gap-2">
              {/* Status */}
              <div className="flex items-center gap-1.5 px-1">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ background: isConnected ? '#6bbf6b' : 'var(--color-fog)' }}
                />
                <span className="text-xs truncate" style={{ color: 'var(--color-fog)' }}>
                  {isConnected
                    ? <><span style={{ color: 'var(--color-pale)' }}>Connected</span> · <span className="font-mono" style={{ color: 'var(--color-stormlight)' }}>{sessionCode}</span></>
                    : 'Solo'}
                </span>
              </div>

              {isConnected ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="w-full text-xs py-1 rounded"
                  style={{
                    background: 'transparent',
                    border: '1px solid var(--color-storm-light)',
                    color: 'var(--color-fog)',
                  }}
                >
                  Disconnect
                </button>
              ) : (
                <>
                  <input
                    type="text"
                    value={codeInput}
                    onChange={e => setCodeInput(e.target.value.toUpperCase())}
                    placeholder="Session code"
                    maxLength={6}
                    className="w-full text-xs rounded px-2 py-1.5 font-mono text-center tracking-widest"
                    style={{
                      background: 'var(--color-storm)',
                      border: '1px solid var(--color-storm-light)',
                      color: 'var(--color-pale)',
                      outline: 'none',
                    }}
                  />
                  <select
                    value={charInput}
                    onChange={e => setCharInput(e.target.value)}
                    className="w-full text-xs rounded px-2 py-1.5"
                    style={{
                      background: 'var(--color-storm)',
                      border: '1px solid var(--color-storm-light)',
                      color: 'var(--color-pale)',
                    }}
                  >
                    {charList.map(c => (
                      <option key={c.id} value={c.id}>{c.name || 'Unnamed'}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!codeInput.trim() || !charInput}
                    onClick={handleJoin}
                    className="w-full text-xs py-1.5 rounded font-medium disabled:opacity-40"
                    style={{
                      background: 'var(--color-stormlight)',
                      color: '#fff',
                    }}
                  >
                    Join Session
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main character sheet */}
      <div className="flex-1 overflow-hidden">
        <CharacterSheet character={activeChar} />
      </div>
    </div>
  )
}
