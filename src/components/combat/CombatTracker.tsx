import { useState } from 'react'
import { useCombatStore } from '@/store/combatStore'
import { useCharacterStore } from '@/store/characterStore'
import { useAdversaryStore } from '@/store/adversaryStore'
import { useCampaignStore } from '@/store/campaignStore'
import { getCombatantsForPhase } from '@/engine/combatEngine'
import { computeDerivedStats } from '@/engine/derivedStats'
import { RoundCounter } from './RoundCounter'
import { CombatantRow } from './CombatantRow'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import type { CombatantSlot, TurnPhase } from '@/types/combat'
import type { Character } from '@/types/character'

const PHASE_ORDER: TurnPhase[] = ['fast-pc', 'fast-npc', 'slow-pc', 'slow-npc']
const PHASE_LABELS: Record<TurnPhase, string> = {
  'fast-pc': 'Fast PC',
  'fast-npc': 'Fast NPC',
  'slow-pc': 'Slow PC',
  'slow-npc': 'Slow NPC',
}

export function CombatTracker() {
  const {
    encounter,
    startEncounter,
    endEncounter,
    advanceTurn,
    setCombatantHP,
    setCombatantFocus,
    toggleCombatantFast,
    toggleCombatantActed,
    addCombatantCondition,
    removeCombatantCondition,
    addCombatant,
    removeCombatant,
  } = useCombatStore()

  const { characters } = useCharacterStore()
  const { templates: adversaryTemplates } = useAdversaryStore()
  const { campaigns, activeCampaignId } = useCampaignStore()

  const [setupOpen, setSetupOpen] = useState(!encounter)
  const [encounterName, setEncounterName] = useState('New Encounter')
  const [pendingCombatants, setPendingCombatants] = useState<Omit<CombatantSlot, 'id' | 'hasActed'>[]>([])

  const campaign = activeCampaignId ? campaigns[activeCampaignId] : null
  const partyChars = (campaign?.playerCharacterIds ?? [])
    .map(id => characters[id])
    .filter((c): c is Character => c !== undefined)

  // Add a PC to pending
  function handleAddPC(char: Character) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const derived = getDerivedForChar(char)
    setPendingCombatants(prev => [
      ...prev,
      {
        characterRef: char.id,
        adversaryRef: null,
        displayName: char.name,
        isPC: true,
        isFast: false,
        hpCurrent: char.resources.healthCurrent,
        hpMax: derived.maxHealth,
        focusCurrent: char.resources.focusCurrent,
        focusMax: derived.maxFocus,
        conditions: [...char.activeConditions],
        isSurprised: false,
      },
    ])
  }

  // Add an adversary to pending
  function handleAddAdversary(templateId: string) {
    const template = adversaryTemplates[templateId]
    if (!template) return
    const existingCount = pendingCombatants.filter(c => !c.isPC && c.adversaryRef?.startsWith(templateId)).length
    setPendingCombatants(prev => [
      ...prev,
      {
        characterRef: null,
        adversaryRef: `${templateId}:${existingCount + 1}`,
        displayName: existingCount > 0 ? `${template.name} ${existingCount + 1}` : template.name,
        isPC: false,
        isFast: false,
        hpCurrent: template.health,
        hpMax: template.health,
        focusCurrent: template.focus,
        focusMax: template.focus,
        conditions: [],
        isSurprised: false,
      },
    ])
  }

  function handleStartEncounter() {
    const campaignId = campaign?.id ?? 'solo'
    startEncounter(campaignId, encounterName, pendingCombatants)
    setSetupOpen(false)
    setPendingCombatants([])
  }

  if (!encounter) {
    return (
      <div
        className="flex flex-col h-full items-center justify-center gap-6 p-8"
        style={{ background: 'var(--color-void)', color: 'var(--color-pale)' }}
      >
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-gold-bright)' }}>
            Combat Tracker
          </h2>
          <p className="text-sm" style={{ color: 'var(--color-fog)' }}>
            No active encounter. Start one to begin tracking turns.
          </p>
        </div>
        <Button variant="primary" onClick={() => setSetupOpen(true)}>
          Start Encounter
        </Button>

        <SetupModal
          open={setupOpen}
          onClose={() => setSetupOpen(false)}
          encounterName={encounterName}
          onNameChange={setEncounterName}
          partyChars={partyChars}
          adversaryTemplates={Object.values(adversaryTemplates)}
          pendingCombatants={pendingCombatants}
          onAddPC={handleAddPC}
          onAddAdversary={handleAddAdversary}
          onRemovePending={idx => setPendingCombatants(prev => prev.filter((_, i) => i !== idx))}
          onTogglePendingFast={idx => setPendingCombatants(prev =>
            prev.map((c, i) => i === idx ? { ...c, isFast: !c.isFast } : c)
          )}
          onTogglePendingSurprised={idx => setPendingCombatants(prev =>
            prev.map((c, i) => i === idx ? { ...c, isSurprised: !c.isSurprised } : c)
          )}
          onStart={handleStartEncounter}
        />
      </div>
    )
  }

  const activeCombatant = encounter.combatants[encounter.currentCombatantIndex]

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: 'var(--color-void)', color: 'var(--color-pale)' }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ background: 'var(--color-deep-storm)', borderBottom: '1px solid var(--color-storm-mid)' }}
      >
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-gold-bright)' }}>
            {encounter.name}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-fog)' }}>
            {encounter.combatants.length} combatant{encounter.combatants.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={advanceTurn}>
            Next Turn →
          </Button>
          <Button variant="ghost" size="sm" onClick={() => {
            if (window.confirm('End this encounter?')) endEncounter()
          }}>
            End Encounter
          </Button>
        </div>
      </div>

      {/* Round counter */}
      <div className="px-4 pt-4 pb-2">
        <RoundCounter roundNumber={encounter.roundNumber} currentPhase={encounter.currentPhase} />
      </div>

      {/* Combatant list by phase */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <div className="flex flex-col gap-6">
          {PHASE_ORDER.map(phase => {
            const phaseCombatants = getCombatantsForPhase(encounter, phase)
            if (phaseCombatants.length === 0) return null
            return (
              <div key={phase}>
                <div
                  className="text-xs font-bold uppercase tracking-widest mb-2 px-1"
                  style={{
                    color: phase === encounter.currentPhase
                      ? 'var(--color-stormlight)'
                      : 'var(--color-storm-light)',
                  }}
                >
                  {PHASE_LABELS[phase]}
                </div>
                <div className="flex flex-col gap-2">
                  {phaseCombatants.map(combatant => (
                    <CombatantRow
                      key={combatant.id}
                      combatant={combatant}
                      isActive={activeCombatant?.id === combatant.id}
                      onHPChange={hp => setCombatantHP(combatant.id, hp)}
                      onFocusChange={focus => setCombatantFocus(combatant.id, focus)}
                      onToggleActed={() => toggleCombatantActed(combatant.id)}
                      onToggleFast={() => toggleCombatantFast(combatant.id)}
                      onAddCondition={cond => addCombatantCondition(combatant.id, cond)}
                      onRemoveCondition={condId => removeCombatantCondition(combatant.id, condId)}
                      onRemove={() => removeCombatant(combatant.id)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Add combatant mid-encounter */}
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-storm-mid)' }}>
          <p className="text-xs mb-2" style={{ color: 'var(--color-fog)' }}>Add to encounter:</p>
          <div className="flex flex-wrap gap-2">
            {partyChars
              .filter(c => !encounter.combatants.find(slot => slot.characterRef === c.id))
              .map(char => (
                <Button
                  key={char.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const derived = getDerivedForChar(char)
                    addCombatant({
                      characterRef: char.id,
                      adversaryRef: null,
                      displayName: char.name,
                      isPC: true,
                      isFast: false,
                      hpCurrent: char.resources.healthCurrent,
                      hpMax: derived.maxHealth,
                      focusCurrent: char.resources.focusCurrent,
                      focusMax: derived.maxFocus,
                      conditions: [...char.activeConditions],
                      isSurprised: false,
                    })
                  }}
                >
                  + {char.name}
                </Button>
              ))}
            {Object.values(adversaryTemplates).map(template => (
              <Button
                key={template.id}
                variant="ghost"
                size="sm"
                onClick={() => {
                  addCombatant({
                    characterRef: null,
                    adversaryRef: template.id,
                    displayName: template.name,
                    isPC: false,
                    isFast: false,
                    hpCurrent: template.health,
                    hpMax: template.health,
                    focusCurrent: template.focus,
                    focusMax: template.focus,
                    conditions: [],
                    isSurprised: false,
                  })
                }}
              >
                + {template.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Standalone derived stats computation for non-hook context
function getDerivedForChar(char: Character) {
  return computeDerivedStats(char)
}

// ─── Setup Modal ─────────────────────────────────────────────────────────────

interface SetupModalProps {
  open: boolean
  onClose: () => void
  encounterName: string
  onNameChange: (n: string) => void
  partyChars: Character[]
  adversaryTemplates: import('@/types/adversary').AdversaryTemplate[]
  pendingCombatants: Omit<CombatantSlot, 'id' | 'hasActed'>[]
  onAddPC: (char: Character) => void
  onAddAdversary: (templateId: string) => void
  onRemovePending: (idx: number) => void
  onTogglePendingFast: (idx: number) => void
  onTogglePendingSurprised: (idx: number) => void
  onStart: () => void
}

function SetupModal({
  open,
  onClose,
  encounterName,
  onNameChange,
  partyChars,
  adversaryTemplates,
  pendingCombatants,
  onAddPC,
  onAddAdversary,
  onRemovePending,
  onTogglePendingFast,
  onTogglePendingSurprised,
  onStart,
}: SetupModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Setup Encounter" width="640px">
      <div className="p-5 flex flex-col gap-4">
        <Input
          label="Encounter Name"
          value={encounterName}
          onChange={onNameChange}
          placeholder="Assault on the Tower"
        />

        <div className="grid grid-cols-2 gap-4">
          {/* Party characters */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-fog)' }}>
              Player Characters
            </p>
            {partyChars.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--color-fog)' }}>No party characters.</p>
            ) : (
              <div className="flex flex-col gap-1">
                {partyChars.map(char => (
                  <button
                    key={char.id}
                    type="button"
                    onClick={() => onAddPC(char)}
                    disabled={pendingCombatants.some(c => c.characterRef === char.id)}
                    className="text-left px-3 py-1.5 rounded text-sm disabled:opacity-40"
                    style={{
                      background: 'var(--color-storm)',
                      border: '1px solid var(--color-storm-light)',
                      color: 'var(--color-pale)',
                    }}
                  >
                    + {char.name} (Lv {char.level})
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Adversaries */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-fog)' }}>
              Adversaries
            </p>
            {adversaryTemplates.length === 0 ? (
              <p className="text-xs" style={{ color: 'var(--color-fog)' }}>No adversary templates.</p>
            ) : (
              <div className="flex flex-col gap-1">
                {adversaryTemplates.map(tmpl => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => onAddAdversary(tmpl.id)}
                    className="text-left px-3 py-1.5 rounded text-sm"
                    style={{
                      background: 'var(--color-storm)',
                      border: '1px solid var(--color-storm-light)',
                      color: 'var(--color-pale)',
                    }}
                  >
                    + {tmpl.name} ({tmpl.role} T{tmpl.tier})
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pending combatants */}
        {pendingCombatants.length > 0 && (
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-fog)' }}>
              Combatants ({pendingCombatants.length})
            </p>
            <div className="flex flex-col gap-1.5">
              {pendingCombatants.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1.5 rounded"
                  style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)' }}
                >
                  <span className="flex-1 text-sm" style={{ color: 'var(--color-pale)' }}>
                    {c.displayName}
                  </span>
                  <button
                    type="button"
                    onClick={() => onTogglePendingFast(idx)}
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: c.isFast ? 'rgba(212,160,23,0.2)' : 'transparent',
                      border: `1px solid ${c.isFast ? 'var(--color-gold)' : 'var(--color-storm-light)'}`,
                      color: c.isFast ? 'var(--color-gold-bright)' : 'var(--color-fog)',
                    }}
                  >
                    Fast
                  </button>
                  <button
                    type="button"
                    onClick={() => onTogglePendingSurprised(idx)}
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: c.isSurprised ? '#3a1010' : 'transparent',
                      border: `1px solid ${c.isSurprised ? 'var(--color-health)' : 'var(--color-storm-light)'}`,
                      color: c.isSurprised ? 'var(--color-health)' : 'var(--color-fog)',
                    }}
                  >
                    Surprised
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemovePending(idx)}
                    className="text-xs hover:opacity-70"
                    style={{ color: 'var(--color-fog)' }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--color-storm-mid)' }}>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={onStart}
            disabled={pendingCombatants.length === 0}
          >
            Start Encounter ({pendingCombatants.length})
          </Button>
        </div>
      </div>
    </Modal>
  )
}
