import { useState } from 'react'
import type { Character } from '@/types/character'
import { useDerivedStats } from '@/hooks/useDerivedStats'
import { useCharacterStore } from '@/store/characterStore'
import { AttributePanel } from './AttributePanel'
import { DefensePanel } from './DefensePanel'
import { ResourcePanel } from './ResourcePanel'
import { DerivedStatsBar } from './DerivedStatsBar'
import { SkillsPanel } from './SkillsPanel'
import { ConditionTracker } from './ConditionTracker'
import { InjuryLog } from './InjuryLog'
import { SingerFormPanel } from './SingerFormPanel'
import { EquipmentPanel } from './EquipmentPanel'
import { NarrativePanel } from './NarrativePanel'
import { LevelUpModal } from './LevelUpModal'
import { CharacterIdentityPanel } from './CharacterIdentityPanel'
import { TalentTreePanel } from './TalentTreePanel'
import { Button } from '@/components/ui/Button'

type Tab = 'details' | 'stats' | 'skills' | 'talents' | 'equipment' | 'narrative'

interface CharacterSheetProps {
  character: Character
  readOnly?: boolean
}

export function CharacterSheet({ character, readOnly = false }: CharacterSheetProps) {
  const [activeTab, setActiveTab] = useState<Tab>('details')
  const [levelUpOpen, setLevelUpOpen] = useState(false)
  const derived = useDerivedStats(character)
  const store = useCharacterStore()

  const id = character.id

  const tabs: { key: Tab; label: string }[] = [
    { key: 'details', label: 'Details' },
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
        <div className="flex items-center gap-2">
          {!readOnly && (
            <Button variant="secondary" size="sm" onClick={() => setLevelUpOpen(true)}>
              Level Up
            </Button>
          )}
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
        {activeTab === 'details' && (
          <CharacterIdentityPanel
            character={character}
            readOnly={readOnly}
            onUpdate={updates => store.updateMeta(id, updates)}
          />
        )}

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

            <ConditionTracker
              activeConditions={character.activeConditions}
              readOnly={readOnly}
              onToggle={conditionId => {
                if (character.activeConditions.some(c => c.conditionId === conditionId)) {
                  store.removeCondition(id, conditionId)
                } else {
                  store.addCondition(id, { conditionId })
                }
              }}
              onExhaustedStackChange={stacks => store.updateExhaustedStacks(id, stacks)}
            />

            <InjuryLog
              injuries={character.injuries}
              readOnly={readOnly}
              onAdd={injury => store.addInjury(id, injury)}
              onRemove={injuryId => store.removeInjury(id, injuryId)}
              onUpdate={(injuryId, updates) => store.updateInjury(id, injuryId, updates)}
            />

            {character.ancestry === 'Singer' && (
              <SingerFormPanel
                activeSingerForm={character.activeSingerForm}
                baseAttributes={character.attributes}
                effectiveAttributes={derived.effectiveAttributes}
                readOnly={readOnly}
                onFormChange={formId => store.setSingerForm(id, formId)}
              />
            )}
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
          <div className="flex flex-col gap-4">
            {/* Heroic Path Talent Tree */}
            <TalentTreePanel character={character} readOnly={readOnly} />

            {/* Expertises */}
            <div
              className="rounded-lg p-4"
              style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
            >
              <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-gold)' }}>
                Expertises
              </h3>
              {!readOnly && (
                <form
                  className="flex gap-2 mb-3"
                  onSubmit={e => {
                    e.preventDefault()
                    const input = (e.currentTarget.elements.namedItem('text') as HTMLInputElement)
                    if (!input.value.trim()) return
                    store.addExpertise(id, { text: input.value.trim(), note: '' })
                    input.value = ''
                  }}
                >
                  <input
                    name="text"
                    type="text"
                    placeholder="Add expertise…"
                    className="flex-1 text-sm rounded px-2.5 py-1.5"
                    style={{
                      background: 'var(--color-storm)',
                      border: '1px solid var(--color-storm-light)',
                      color: 'var(--color-pale)',
                    }}
                  />
                  <Button type="submit" variant="secondary" size="sm">Add</Button>
                </form>
              )}
              {character.expertises.length === 0 ? (
                <p className="text-sm" style={{ color: 'var(--color-fog)' }}>No expertises.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {character.expertises.map(e => (
                    <div
                      key={e.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded text-sm"
                      style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)', color: 'var(--color-pale)' }}
                    >
                      {e.text}
                      {!readOnly && (
                        <button
                          type="button"
                          onClick={() => store.removeExpertise(id, e.id)}
                          className="text-xs hover:opacity-70"
                          style={{ color: 'var(--color-fog)' }}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'equipment' && (
          <EquipmentPanel
            character={character}
            readOnly={readOnly}
            onAddWeapon={w => store.addWeapon(id, w)}
            onRemoveWeapon={wid => store.removeWeapon(id, wid)}
            onAddArmour={a => store.addArmour(id, a)}
            onRemoveArmour={aid => store.removeArmour(id, aid)}
            onToggleArmour={aid => store.toggleArmourEquipped(id, aid)}
            onAddEquipment={item => store.addEquipment(id, item)}
            onRemoveEquipment={iid => store.removeEquipment(id, iid)}
            onCurrencyChange={cur => store.setCurrency(id, cur)}
          />
        )}

        {activeTab === 'narrative' && (
          <NarrativePanel
            character={character}
            readOnly={readOnly}
            onAddGoal={g => store.addGoal(id, g)}
            onRemoveGoal={gid => store.removeGoal(id, gid)}
            onAddConnection={c => store.addConnection(id, c)}
            onRemoveConnection={cid => store.removeConnection(id, cid)}
            onRewardsChange={text => store.updateMeta(id, { rewards: text })}
          />
        )}
      </div>

      {/* Level Up Modal */}
      <LevelUpModal
        open={levelUpOpen}
        character={character}
        onClose={() => setLevelUpOpen(false)}
        onApply={updated => store.applyUpdatedCharacter(updated)}
      />
    </div>
  )
}
