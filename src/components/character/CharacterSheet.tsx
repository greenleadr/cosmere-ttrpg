import { useState } from 'react'
import type { Character } from '@/types/character'
import { useDerivedStats } from '@/hooks/useDerivedStats'
import { useCharacterStore } from '@/store/characterStore'
import { AttributePanel } from './AttributePanel'
import { DefensePanel } from './DefensePanel'
import { ResourcePanel } from './ResourcePanel'
import { DerivedStatsBar } from './DerivedStatsBar'
import { SkillsPanel } from './SkillsPanel'

type Tab = 'stats' | 'skills' | 'talents' | 'equipment' | 'narrative'

interface CharacterSheetProps {
  character: Character
  readOnly?: boolean
}

export function CharacterSheet({ character, readOnly = false }: CharacterSheetProps) {
  const [activeTab, setActiveTab] = useState<Tab>('stats')
  const derived = useDerivedStats(character)
  const store = useCharacterStore()

  const id = character.id

  const tabs: { key: Tab; label: string }[] = [
    { key: 'stats', label: 'Stats' },
    { key: 'skills', label: 'Skills' },
    { key: 'talents', label: 'Talents' },
    { key: 'equipment', label: 'Equipment' },
    { key: 'narrative', label: 'Narrative' },
  ]

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: 'var(--color-void)', color: 'var(--color-pale)' }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{
          background: 'var(--color-deep-storm)',
          borderBottom: '1px solid var(--color-storm-mid)',
        }}
      >
        <div>
          <h1
            className="text-xl font-bold"
            style={{ color: 'var(--color-gold-bright)' }}
          >
            {character.name || 'Unnamed Character'}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-fog)' }}>
            Level {character.level} · {character.ancestry}
            {character.heroicPaths.length > 0 && ` · ${character.heroicPaths.join(', ')}`}
            {character.isRadiant && character.radiantPath && ` · ${character.radiantPath}`}
          </p>
        </div>
        {readOnly && (
          <span
            className="text-xs px-2 py-1 rounded"
            style={{
              background: 'var(--color-storm-mid)',
              border: '1px solid var(--color-storm-light)',
              color: 'var(--color-fog)',
            }}
          >
            View Only
          </span>
        )}
      </div>

      {/* Tab bar */}
      <div
        className="flex"
        style={{ borderBottom: '1px solid var(--color-storm-mid)' }}
      >
        {tabs.map(tab => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2.5 text-sm font-medium transition-colors"
            style={{
              color: activeTab === tab.key ? 'var(--color-gold-bright)' : 'var(--color-fog)',
              borderBottom: activeTab === tab.key ? '2px solid var(--color-gold)' : '2px solid transparent',
              background: 'transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'stats' && (
          <div className="flex flex-col gap-4">
            <DerivedStatsBar derived={derived} />
            <div className="grid grid-cols-2 gap-4">
              <AttributePanel
                attributes={character.attributes}
                effectiveAttributes={derived.effectiveAttributes}
                readOnly={readOnly}
                onChange={(key, value) => store.setAttribute(id, key, value)}
              />
              <div className="flex flex-col gap-4">
                <DefensePanel
                  derived={derived}
                  defenseOverrides={character.defenseOverrides}
                  readOnly={readOnly}
                  onOverrideChange={(key, value) => store.setDefenseOverride(id, key, value)}
                />
                <ResourcePanel
                  character={character}
                  derived={derived}
                  readOnly={readOnly}
                  onHealthChange={v => store.setHealthCurrent(id, v)}
                  onFocusChange={v => store.setFocusCurrent(id, v)}
                  onInvestitureChange={v => store.setInvestitureCurrent(id, v)}
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'skills' && (
          <SkillsPanel
            derived={derived}
            level={character.level}
            isRadiant={character.isRadiant}
            unlockedSurgePaths={character.radiantPath ? [character.radiantPath] : []}
            readOnly={readOnly}
            onRanksChange={(skillId, ranks) => store.setSkillRanks(id, skillId, ranks)}
          />
        )}

        {activeTab === 'talents' && (
          <div
            className="rounded-lg p-4"
            style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-gold)' }}>
              Talents
            </h3>
            {character.talents.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--color-fog)' }}>No talents recorded.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {character.talents.map(t => (
                  <div
                    key={t.id}
                    className="p-3 rounded"
                    style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)' }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm" style={{ color: 'var(--color-gold-bright)' }}>
                        {t.name}
                      </span>
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: 'var(--color-storm-mid)', color: 'var(--color-fog)' }}
                      >
                        {t.activationType}
                      </span>
                      {t.source && (
                        <span className="text-xs" style={{ color: 'var(--color-fog)' }}>
                          {t.source}
                        </span>
                      )}
                    </div>
                    {t.prerequisites && (
                      <p className="text-xs mb-1" style={{ color: 'var(--color-fog)' }}>
                        Prerequisites: {t.prerequisites}
                      </p>
                    )}
                    {t.description && (
                      <p className="text-xs" style={{ color: 'var(--color-pale)' }}>
                        {t.description}
                      </p>
                    )}
                    {!readOnly && (
                      <button
                        type="button"
                        onClick={() => store.removeTalent(id, t.id)}
                        className="mt-2 text-xs hover:opacity-80"
                        style={{ color: 'var(--color-health)' }}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'equipment' && (
          <div
            className="rounded-lg p-4"
            style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-gold)' }}>
              Equipment
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-fog)' }}>
              Equipment management — coming in Milestone 2.
            </p>
          </div>
        )}

        {activeTab === 'narrative' && (
          <div
            className="rounded-lg p-4"
            style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
          >
            <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-gold)' }}>
              Narrative
            </h3>
            <p className="text-sm" style={{ color: 'var(--color-fog)' }}>
              Goals, connections, and rewards — coming in Milestone 2.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
