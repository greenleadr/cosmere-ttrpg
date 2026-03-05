import { useEffect } from 'react'
import { useCharacterStore } from '@/store/characterStore'
import { CharacterSheet } from '@/components/character/CharacterSheet'
import { Button } from '@/components/ui/Button'

export function CharacterPage() {
  const { characters, activeCharacterId, addCharacter, setActiveCharacter } = useCharacterStore()

  const charList = Object.values(characters)
  const activeChar = activeCharacterId ? characters[activeCharacterId] : charList[0] ?? null

  useEffect(() => {
    if (!activeChar && charList.length === 0) {
      addCharacter()
    }
  }, [])

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
      {/* Character list sidebar (if multiple) */}
      {charList.length > 1 && (
        <div
          className="w-48 flex-shrink-0 overflow-y-auto p-2 flex flex-col gap-1"
          style={{ borderRight: '1px solid var(--color-storm-mid)', background: 'var(--color-deep-storm)' }}
        >
          {charList.map(c => (
            <button
              key={c.id}
              type="button"
              onClick={() => setActiveCharacter(c.id)}
              className="text-left px-3 py-2 rounded text-sm transition-colors"
              style={{
                background: c.id === activeChar.id ? 'var(--color-storm-mid)' : 'transparent',
                color: c.id === activeChar.id ? 'var(--color-gold-bright)' : 'var(--color-pale)',
              }}
            >
              {c.name}
            </button>
          ))}
          <Button variant="ghost" size="sm" onClick={() => addCharacter()} className="mt-2">
            + New
          </Button>
        </div>
      )}

      {/* Main character sheet */}
      <div className="flex-1 overflow-hidden">
        <CharacterSheet character={activeChar} />
      </div>
    </div>
  )
}
