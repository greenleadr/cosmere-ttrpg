import { useState } from 'react'
import type { Character } from '@/types/character'
import { HEROIC_PATHS, RADIANT_PATHS, CULTURES } from '@/constants/paths'
import { Button } from '@/components/ui/Button'

type IdentityUpdates = Partial<Pick<Character,
  'name' | 'playerName' | 'level' | 'ancestry' | 'cultures' |
  'heroicPaths' | 'radiantPath' | 'isRadiant' | 'occupation' | 'appearanceNotes' |
  'rewards' | 'focusBonus' | 'investitureMax' | 'defenseOverrides'
>>

interface CharacterIdentityPanelProps {
  character: Character
  readOnly?: boolean
  onUpdate: (updates: IdentityUpdates) => void
}

export function CharacterIdentityPanel({
  character,
  readOnly = false,
  onUpdate,
}: CharacterIdentityPanelProps) {
  const [customCulture, setCustomCulture] = useState('')

  const card = (title: string, children: React.ReactNode) => (
    <div
      className="rounded-lg p-4"
      style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
    >
      <h3
        className="text-sm font-semibold uppercase tracking-widest mb-4"
        style={{ color: 'var(--color-gold)' }}
      >
        {title}
      </h3>
      {children}
    </div>
  )

  const field = (label: string, children: React.ReactNode) => (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium" style={{ color: 'var(--color-fog)' }}>
        {label}
      </label>
      {children}
    </div>
  )

  const inputStyle = {
    background: 'var(--color-storm)',
    border: '1px solid var(--color-storm-light)',
    color: 'var(--color-pale)',
    outline: 'none',
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Basic Identity */}
      {card('Identity', (
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {field('Character Name',
              readOnly
                ? <p className="text-sm" style={{ color: 'var(--color-pale)' }}>{character.name || '—'}</p>
                : <input
                    type="text"
                    value={character.name}
                    onChange={e => onUpdate({ name: e.target.value })}
                    className="text-sm rounded px-2.5 py-1.5"
                    style={inputStyle}
                    placeholder="Kaladin Stormblessed"
                  />
            )}
            {field('Player Name',
              readOnly
                ? <p className="text-sm" style={{ color: 'var(--color-pale)' }}>{character.playerName || '—'}</p>
                : <input
                    type="text"
                    value={character.playerName}
                    onChange={e => onUpdate({ playerName: e.target.value })}
                    className="text-sm rounded px-2.5 py-1.5"
                    style={inputStyle}
                    placeholder="Your name"
                  />
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {field('Ancestry',
              readOnly
                ? <p className="text-sm" style={{ color: 'var(--color-pale)' }}>{character.ancestry}</p>
                : <select
                    value={character.ancestry}
                    onChange={e => onUpdate({ ancestry: e.target.value as 'Human' | 'Singer' })}
                    className="text-sm rounded px-2 py-1.5"
                    style={inputStyle}
                  >
                    <option value="Human">Human</option>
                    <option value="Singer">Singer</option>
                  </select>
            )}
            {field('Occupation',
              readOnly
                ? <p className="text-sm" style={{ color: 'var(--color-pale)' }}>{character.occupation || '—'}</p>
                : <input
                    type="text"
                    value={character.occupation}
                    onChange={e => onUpdate({ occupation: e.target.value })}
                    className="text-sm rounded px-2.5 py-1.5"
                    style={inputStyle}
                    placeholder="Soldier, scholar, thief…"
                  />
            )}
          </div>

          {field('Appearance Notes',
            readOnly
              ? <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--color-pale)' }}>{character.appearanceNotes || '—'}</p>
              : <textarea
                  value={character.appearanceNotes}
                  onChange={e => onUpdate({ appearanceNotes: e.target.value })}
                  rows={3}
                  className="text-sm rounded px-2.5 py-1.5 resize-y"
                  style={inputStyle}
                  placeholder="Tall, dark-eyed, brands on forehead…"
                />
          )}
        </div>
      ))}

      {/* Cultures */}
      {card('Culture(s)', (
        <div className="flex flex-col gap-3">
          {readOnly ? (
            <p className="text-sm" style={{ color: 'var(--color-pale)' }}>
              {character.cultures.length > 0 ? character.cultures.join(', ') : '—'}
            </p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                {CULTURES.filter(c => c !== 'Other / Custom').map(culture => {
                  const selected = character.cultures.includes(culture)
                  return (
                    <button
                      key={culture}
                      type="button"
                      onClick={() => {
                        const next = selected
                          ? character.cultures.filter(c => c !== culture)
                          : [...character.cultures, culture]
                        onUpdate({ cultures: next })
                      }}
                      className="px-2.5 py-1 rounded text-xs font-medium"
                      style={{
                        background: selected ? 'var(--color-stormlight)' : 'var(--color-storm)',
                        border: `1px solid ${selected ? 'var(--color-stormlight)' : 'var(--color-storm-light)'}`,
                        color: selected ? '#fff' : 'var(--color-fog)',
                      }}
                    >
                      {culture}
                    </button>
                  )
                })}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customCulture}
                  onChange={e => setCustomCulture(e.target.value)}
                  placeholder="Custom culture…"
                  className="flex-1 text-sm rounded px-2.5 py-1.5"
                  style={inputStyle}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && customCulture.trim()) {
                      onUpdate({ cultures: [...character.cultures, customCulture.trim()] })
                      setCustomCulture('')
                    }
                  }}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (!customCulture.trim()) return
                    onUpdate({ cultures: [...character.cultures, customCulture.trim()] })
                    setCustomCulture('')
                  }}
                >
                  Add
                </Button>
              </div>
              {/* Selected cultures with remove buttons */}
              {character.cultures.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {character.cultures.map(c => (
                    <span
                      key={c}
                      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded"
                      style={{
                        background: 'var(--color-stormlight)',
                        color: '#fff',
                      }}
                    >
                      {c}
                      <button
                        type="button"
                        onClick={() => onUpdate({ cultures: character.cultures.filter(x => x !== c) })}
                        className="hover:opacity-70"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {/* Heroic Paths */}
      {card('Heroic Path(s)', (
        <div className="flex flex-col gap-3">
          {readOnly ? (
            <p className="text-sm" style={{ color: 'var(--color-pale)' }}>
              {character.heroicPaths.length > 0 ? character.heroicPaths.join(', ') : '—'}
            </p>
          ) : (
            <>
              <p className="text-xs" style={{ color: 'var(--color-fog)' }}>
                Six heroic paths are available. Characters may multi-path over time.
              </p>
              <div className="flex flex-wrap gap-2">
                {HEROIC_PATHS.map(path => {
                  const selected = character.heroicPaths.includes(path)
                  return (
                    <button
                      key={path}
                      type="button"
                      onClick={() => {
                        const next = selected
                          ? character.heroicPaths.filter(p => p !== path)
                          : [...character.heroicPaths, path]
                        onUpdate({ heroicPaths: next })
                      }}
                      className="px-3 py-1.5 rounded text-sm font-medium"
                      style={{
                        background: selected ? 'rgba(212,160,23,0.2)' : 'var(--color-storm)',
                        border: `1px solid ${selected ? 'var(--color-gold)' : 'var(--color-storm-light)'}`,
                        color: selected ? 'var(--color-gold-bright)' : 'var(--color-fog)',
                      }}
                    >
                      {path}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      ))}

      {/* Radiant Path */}
      {card('Radiant Path', (
        <div className="flex flex-col gap-3">
          {/* Radiant bonded toggle */}
          {!readOnly && (
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className="relative w-10 h-5 rounded-full transition-colors"
                style={{
                  background: character.isRadiant ? 'var(--color-stormlight)' : 'var(--color-storm)',
                  border: `1px solid ${character.isRadiant ? 'var(--color-stormlight)' : 'var(--color-storm-light)'}`,
                }}
                onClick={() => onUpdate({ isRadiant: !character.isRadiant, ...(!character.isRadiant ? {} : { radiantPath: null }) })}
              >
                <div
                  className="absolute top-0.5 w-4 h-4 rounded-full transition-all"
                  style={{
                    left: character.isRadiant ? '22px' : '2px',
                    background: character.isRadiant ? '#fff' : 'var(--color-fog)',
                  }}
                />
              </div>
              <div>
                <span className="text-sm font-medium" style={{ color: character.isRadiant ? 'var(--color-stormlight)' : 'var(--color-fog)' }}>
                  {character.isRadiant ? 'Radiant Bonded' : 'Not Radiant'}
                </span>
                <p className="text-xs" style={{ color: 'var(--color-fog)' }}>
                  Toggle to unlock Investiture and surge skills.
                </p>
              </div>
            </label>
          )}

          {character.isRadiant ? (
            <div className="flex flex-col gap-3">
              {readOnly ? (
                <p className="text-sm" style={{ color: 'var(--color-pale)' }}>
                  {character.radiantPath ?? '—'}
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-xs" style={{ color: 'var(--color-fog)' }}>
                    Select your Radiant Order. This unlocks your surge skills and determines Investiture mechanics.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {RADIANT_PATHS.map(path => {
                      const selected = character.radiantPath === path
                      return (
                        <button
                          key={path}
                          type="button"
                          onClick={() => onUpdate({ radiantPath: selected ? null : path })}
                          className="px-2.5 py-1 rounded text-xs font-medium"
                          style={{
                            background: selected ? 'var(--color-stormlight)' : 'var(--color-storm)',
                            border: `1px solid ${selected ? 'var(--color-stormlight)' : 'var(--color-storm-light)'}`,
                            color: selected ? '#fff' : 'var(--color-fog)',
                          }}
                        >
                          {path}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Investiture controls */}
              <div
                className="p-3 rounded flex flex-col gap-2"
                style={{
                  background: 'rgba(99, 168, 210, 0.08)',
                  border: '1px solid var(--color-stormlight)',
                }}
              >
                <p className="text-xs font-medium" style={{ color: 'var(--color-stormlight)' }}>
                  Investiture Settings
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {field('Max Investiture Override',
                    readOnly
                      ? <p className="text-sm" style={{ color: 'var(--color-pale)' }}>{character.investitureMax}</p>
                      : <input
                          type="number"
                          min={0}
                          max={50}
                          value={character.investitureMax}
                          onChange={e => onUpdate({ investitureMax: Number(e.target.value) || 0 })}
                          className="text-sm rounded px-2 py-1.5"
                          style={inputStyle}
                        />
                  )}
                  {field('Focus Talent Bonus',
                    readOnly
                      ? <p className="text-sm" style={{ color: 'var(--color-pale)' }}>{character.focusBonus}</p>
                      : <input
                          type="number"
                          min={0}
                          value={character.focusBonus}
                          onChange={e => onUpdate({ focusBonus: Number(e.target.value) || 0 })}
                          className="text-sm rounded px-2 py-1.5"
                          style={inputStyle}
                        />
                  )}
                </div>
                <p className="text-xs" style={{ color: 'var(--color-fog)' }}>
                  Max Investiture is set by your Radiant path formula. Focus Talent Bonus adds to 2×WIL (e.g., from the Composed talent).
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm" style={{ color: 'var(--color-fog)' }}>
              This character has not bonded a spren. Investiture and surge skills are unavailable.
            </p>
          )}
        </div>
      ))}

      {/* Defense overrides */}
      {card('Defense Bonuses', (
        <div className="flex flex-col gap-2">
          <p className="text-xs" style={{ color: 'var(--color-fog)' }}>
            Manual bonus/penalty applied on top of the auto-calculated defense (from talents, conditions, or special effects not tracked elsewhere).
          </p>
          <div className="grid grid-cols-3 gap-3">
            {([
              ['Physical Bonus', 'physicalBonus'],
              ['Cognitive Bonus', 'cognitiveBonus'],
              ['Spiritual Bonus', 'spiritualBonus'],
            ] as const).map(([label, key]) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs" style={{ color: 'var(--color-fog)' }}>{label}</label>
                {readOnly ? (
                  <p className="text-sm" style={{ color: 'var(--color-pale)' }}>
                    {character.defenseOverrides[key] >= 0 ? '+' : ''}{character.defenseOverrides[key]}
                  </p>
                ) : (
                  <input
                    type="number"
                    value={character.defenseOverrides[key]}
                    onChange={e => onUpdate({
                      defenseOverrides: { ...character.defenseOverrides, [key]: Number(e.target.value) || 0 },
                    })}
                    className="text-sm rounded px-2 py-1.5"
                    style={inputStyle}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
