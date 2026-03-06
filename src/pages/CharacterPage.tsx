import { useEffect } from 'react'
import { useCharacterStore } from '@/store/characterStore'
import { CharacterSheet } from '@/components/character/CharacterSheet'
import { Button } from '@/components/ui/Button'
import { deleteCharacter } from '@/db/sync'

export function CharacterPage() {
  const { characters, activeCharacterId, addCharacter, removeCharacter, setActiveCharacter } = useCharacterStore()

  const charList = Object.values(characters)
  const activeChar = activeCharacterId ? characters[activeCharacterId] : charList[0] ?? null

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
      {/* Sidebar — always visible */}
      <div
        className="w-48 flex-shrink-0 flex flex-col"
        style={{ borderRight: '1px solid var(--color-storm-mid)', background: 'var(--color-deep-storm)' }}
      >
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

        <div className="p-2 shrink-0" style={{ borderTop: '1px solid var(--color-storm-mid)' }}>
          <Button variant="ghost" size="sm" onClick={() => addCharacter()}>
            + New Character
          </Button>
        </div>
      </div>

      {/* Main character sheet */}
      <div className="flex-1 overflow-hidden">
        <CharacterSheet character={activeChar} />
      </div>
    </div>
  )
}
