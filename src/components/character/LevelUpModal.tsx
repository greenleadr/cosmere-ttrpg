import { useState } from 'react'
import type { Character, AttributeKey } from '@/types/character'
import type { LevelUpChoices } from '@/engine/levelUpEngine'
import { validateLevelUpChoices, applyLevelUp } from '@/engine/levelUpEngine'
import { getAdvancementRow } from '@/constants/advancement'
import { ATTRIBUTES } from '@/constants/attributes'
import { SKILLS } from '@/constants/skills'
import { HEROIC_PATH_TREES } from '@/constants/talentTrees'
import type { TalentNode } from '@/constants/talentTrees'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'

interface LevelUpModalProps {
  open: boolean
  character: Character
  onClose: () => void
  onApply: (updated: Character) => void
}

type Step = 'overview' | 'attribute' | 'skills' | 'talent' | 'confirm'

export function LevelUpModal({ open, character, onClose, onApply }: LevelUpModalProps) {
  const nextLevel = character.level + 1
  const advancement = getAdvancementRow(nextLevel)

  const [step, setStep] = useState<Step>('overview')
  const [choices, setChoices] = useState<LevelUpChoices>({ skillRanks: {} })

  const validation = validateLevelUpChoices(character, choices)
  const rankBudget = advancement.skillRanksGained
  const allocatedRanks = Object.values(choices.skillRanks).reduce((s, n) => s + n, 0)

  function reset() {
    setStep('overview')
    setChoices({ skillRanks: {} })
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleConfirm() {
    if (!validation.valid) return
    const updated = applyLevelUp(character, choices)
    onApply(updated)
    reset()
    onClose()
  }

  const steps: { key: Step; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    ...(advancement.attributeIncrease ? [{ key: 'attribute' as Step, label: 'Attribute' }] : []),
    { key: 'skills', label: 'Skills' },
    { key: 'talent', label: 'Talent' },
    { key: 'confirm', label: 'Confirm' },
  ]
  const stepIndex = steps.findIndex(s => s.key === step)
  const isFirst = stepIndex === 0
  const isLast = stepIndex === steps.length - 1

  function goNext() {
    const next = steps[stepIndex + 1]
    if (next) setStep(next.key)
  }
  function goPrev() {
    const prev = steps[stepIndex - 1]
    if (prev) setStep(prev.key)
  }

  return (
    <Modal open={open} onClose={handleClose} title={`Level Up → Level ${nextLevel}`} width="600px">
      <div className="p-5 flex flex-col gap-5">
        {/* Step indicator */}
        <div className="flex gap-1">
          {steps.map((s, i) => (
            <div
              key={s.key}
              className="flex-1 h-1 rounded"
              style={{
                background: i <= stepIndex ? 'var(--color-gold)' : 'var(--color-storm-mid)',
              }}
            />
          ))}
        </div>

        {/* Overview */}
        {step === 'overview' && (
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold" style={{ color: 'var(--color-gold-bright)' }}>
              Reaching Level {nextLevel} (Tier {advancement.tier})
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Pill label="Health Gain" value={`+${advancement.healthGain}`} />
              <Pill label="Skill Ranks" value={`+${advancement.skillRanksGained}`} />
              {advancement.attributeIncrease && <Pill label="Attribute Increase" value="Yes" highlight />}
              {advancement.talentsGained > 0 && <Pill label="Talents" value={`+${advancement.talentsGained}`} />}
              {advancement.ancestryBonusTalent && <Pill label="Ancestry Bonus Talent" value="Yes" highlight />}
              <Pill label="Skill Rank Cap" value={`${advancement.skillRankCap}`} />
            </div>
          </div>
        )}

        {/* Attribute increase */}
        {step === 'attribute' && advancement.attributeIncrease && (
          <div className="flex flex-col gap-3">
            <p className="text-sm" style={{ color: 'var(--color-fog)' }}>
              Choose one attribute to increase by 1.
            </p>
            <div className="grid grid-cols-3 gap-2">
              {ATTRIBUTES.map(attr => (
                <button
                  key={attr.key}
                  type="button"
                  onClick={() => setChoices(c => ({ ...c, attributeIncrease: attr.key as AttributeKey }))}
                  className="p-3 rounded flex flex-col items-center gap-1"
                  style={{
                    background: choices.attributeIncrease === attr.key
                      ? 'var(--color-stormlight)'
                      : 'var(--color-storm)',
                    border: `1px solid ${choices.attributeIncrease === attr.key
                      ? 'var(--color-stormlight)'
                      : 'var(--color-storm-light)'}`,
                    color: choices.attributeIncrease === attr.key ? '#fff' : 'var(--color-pale)',
                  }}
                >
                  <span className="text-xs font-bold uppercase">{attr.abbr}</span>
                  <span className="text-lg font-bold">
                    {character.attributes[attr.key as AttributeKey]}
                    <span
                      className="text-sm"
                      style={{ color: choices.attributeIncrease === attr.key ? '#fff' : 'var(--color-stormlight)' }}
                    >
                      {choices.attributeIncrease === attr.key ? ' →' + (character.attributes[attr.key as AttributeKey] + 1) : ''}
                    </span>
                  </span>
                  <span className="text-xs" style={{ color: 'inherit', opacity: 0.8 }}>{attr.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {step === 'skills' && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <p className="text-sm" style={{ color: 'var(--color-fog)' }}>
                Allocate {rankBudget} skill rank{rankBudget !== 1 ? 's' : ''}.
              </p>
              <span
                className="text-sm font-bold"
                style={{ color: allocatedRanks > rankBudget ? 'var(--color-health)' : 'var(--color-stormlight)' }}
              >
                {allocatedRanks}/{rankBudget} used
              </span>
            </div>
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto">
              {SKILLS.filter(s => !s.isSurge).map(skill => {
                const currentRanks = character.skills.find(s => s.skillId === skill.id)?.ranks ?? 0
                const adding = choices.skillRanks[skill.id] ?? 0
                const newTotal = currentRanks + adding
                const cap = advancement.skillRankCap
                const atCap = newTotal >= cap

                return (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between px-3 py-1.5 rounded"
                    style={{ background: adding > 0 ? 'var(--color-storm)' : 'transparent' }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase font-bold w-6" style={{ color: 'var(--color-fog)' }}>
                        {skill.governingAttribute.toUpperCase()}
                      </span>
                      <span className="text-sm" style={{ color: 'var(--color-pale)' }}>
                        {skill.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs" style={{ color: 'var(--color-fog)' }}>
                        {currentRanks}{adding > 0 ? ` → ${newTotal}` : ''}
                        <span style={{ color: 'var(--color-storm-light)' }}>/{cap}</span>
                      </span>
                      <button
                        type="button"
                        disabled={adding <= 0}
                        onClick={() => setChoices(c => {
                          const n = (c.skillRanks[skill.id] ?? 0) - 1
                          const sr = { ...c.skillRanks }
                          if (n <= 0) delete sr[skill.id]
                          else sr[skill.id] = n
                          return { ...c, skillRanks: sr }
                        })}
                        className="w-5 h-5 rounded text-xs flex items-center justify-center disabled:opacity-30"
                        style={{ background: 'var(--color-storm-mid)', border: '1px solid var(--color-storm-light)', color: 'var(--color-pale)' }}
                      >
                        −
                      </button>
                      <button
                        type="button"
                        disabled={allocatedRanks >= rankBudget || atCap}
                        onClick={() => setChoices(c => ({
                          ...c,
                          skillRanks: { ...c.skillRanks, [skill.id]: (c.skillRanks[skill.id] ?? 0) + 1 },
                        }))}
                        className="w-5 h-5 rounded text-xs flex items-center justify-center disabled:opacity-30"
                        style={{ background: 'var(--color-storm-mid)', border: '1px solid var(--color-storm-light)', color: 'var(--color-pale)' }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Talent */}
        {step === 'talent' && (
          <div className="flex flex-col gap-3">
            {advancement.talentsGained > 0 ? (
              <TalentStepContent
                character={character}
                choices={choices}
                setChoices={setChoices}
                ancestryBonusTalent={advancement.ancestryBonusTalent}
              />
            ) : (
              <p className="text-sm" style={{ color: 'var(--color-fog)' }}>
                No talent gained at this level.
              </p>
            )}
          </div>
        )}

        {/* Confirm */}
        {step === 'confirm' && (
          <div className="flex flex-col gap-3">
            <h3 className="font-semibold" style={{ color: 'var(--color-gold-bright)' }}>
              Summary
            </h3>
            <div className="text-sm flex flex-col gap-1.5" style={{ color: 'var(--color-pale)' }}>
              <p>Level: {character.level} → <strong>{nextLevel}</strong></p>
              <p>Health: +{advancement.healthGain}</p>
              {choices.attributeIncrease && (
                <p>
                  {choices.attributeIncrease.toUpperCase()}: {character.attributes[choices.attributeIncrease]} → {character.attributes[choices.attributeIncrease] + 1}
                </p>
              )}
              {Object.entries(choices.skillRanks).filter(([, v]) => v > 0).map(([skillId, added]) => {
                const skill = SKILLS.find(s => s.id === skillId)
                return (
                  <p key={skillId}>
                    {skill?.name ?? skillId}: +{added} rank{added !== 1 ? 's' : ''}
                  </p>
                )
              })}
              {choices.talentName && <p>Talent: {choices.talentName}</p>}
              {choices.ancestryBonusTalentName && (
                <p>Ancestry Talent: {choices.ancestryBonusTalentName}</p>
              )}
            </div>
            {!validation.valid && (
              <div className="p-3 rounded" style={{ background: '#3a1010', border: '1px solid var(--color-health)' }}>
                {validation.errors.map(err => (
                  <p key={err} className="text-xs" style={{ color: 'var(--color-health)' }}>{err}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--color-storm-mid)' }}>
          <Button variant="ghost" onClick={isFirst ? handleClose : goPrev}>
            {isFirst ? 'Cancel' : '← Back'}
          </Button>
          {isLast ? (
            <Button variant="primary" onClick={handleConfirm} disabled={!validation.valid}>
              Apply Level Up
            </Button>
          ) : (
            <Button variant="secondary" onClick={goNext}>
              Next →
            </Button>
          )}
        </div>
      </div>
    </Modal>
  )
}

// ─── Talent step sub-component ───────────────────────────────────────────────

const ACTIVATION_LABELS: Record<string, string> = {
  'action': 'Action',
  'reaction': 'Reaction',
  'free-action': 'Free Action',
  'always-active': 'Passive',
  'special': 'Special',
}

function TreeTalentCard({
  talent,
  isAcquired,
  isSelected,
  prerequisitesMet,
  onSelect,
}: {
  talent: TalentNode
  isAcquired: boolean
  isSelected: boolean
  prerequisitesMet: boolean
  onSelect: () => void
}) {
  const dim = !isSelected && !prerequisitesMet && !isAcquired
  const disabled = isAcquired

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className="w-full text-left rounded p-3 flex flex-col gap-1 transition-all"
      style={{
        background: isSelected
          ? 'rgba(212,160,23,0.18)'
          : isAcquired
            ? 'rgba(255,255,255,0.04)'
            : 'var(--color-storm)',
        border: `1px solid ${isSelected ? 'var(--color-gold)' : isAcquired ? 'var(--color-storm-mid)' : 'var(--color-storm-light)'}`,
        opacity: dim ? 0.45 : disabled ? 0.5 : 1,
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className="text-sm font-semibold"
          style={{ color: isSelected ? 'var(--color-gold-bright)' : 'var(--color-pale)' }}
        >
          {talent.name}
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded shrink-0"
          style={{ background: 'var(--color-storm-mid)', color: 'var(--color-fog)' }}
        >
          {ACTIVATION_LABELS[talent.activationType] ?? talent.activationType}
        </span>
      </div>
      {isAcquired && (
        <span className="text-xs" style={{ color: 'var(--color-fog)' }}>Already acquired</span>
      )}
      {!isAcquired && !prerequisitesMet && (
        <span className="text-xs" style={{ color: 'var(--color-fog)' }}>
          Requires: {talent.prerequisites.join(', ')}
        </span>
      )}
      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-pale)', opacity: 0.8 }}>
        {talent.description}
      </p>
      {isSelected && (
        <div
          className="mt-1 text-xs font-semibold px-2 py-0.5 rounded self-start"
          style={{ background: 'var(--color-gold)', color: '#000' }}
        >
          Selected ✓
        </div>
      )}
    </button>
  )
}

function TalentStepContent({
  character,
  choices,
  setChoices,
  ancestryBonusTalent,
}: {
  character: Character
  choices: LevelUpChoices
  setChoices: React.Dispatch<React.SetStateAction<LevelUpChoices>>
  ancestryBonusTalent: boolean
}) {
  const [mode, setMode] = useState<'tree' | 'custom'>(
    character.heroicPaths.length > 0 ? 'tree' : 'custom',
  )
  const [expandedSpecialty, setExpandedSpecialty] = useState<string | null>(null)

  const pathName = character.heroicPaths[0]
  const tree = pathName ? HEROIC_PATH_TREES[pathName] : null
  const acquiredIds = new Set(character.talents.map(t => t.id))

  function selectTreeTalent(talent: TalentNode, specialty: string) {
    const source = tree ? `${tree.pathName} · ${specialty}` : specialty
    setChoices(c => ({
      ...c,
      selectedTalentId: talent.id,
      talentName: talent.name,
      talentDescription: talent.description,
      talentActivationType: talent.activationType,
      talentSource: source,
    }))
  }

  function clearTalent() {
    setChoices(c => ({
      ...c,
      selectedTalentId: undefined,
      talentName: undefined,
      talentDescription: undefined,
      talentActivationType: undefined,
      talentSource: undefined,
    }))
  }

  function prerequisitesMet(talent: TalentNode) {
    return talent.prerequisites.every(pid => acquiredIds.has(pid))
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Mode switcher */}
      {tree && (
        <div className="flex gap-1">
          {(['tree', 'custom'] as const).map(m => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); clearTalent() }}
              className="flex-1 py-1.5 text-sm rounded font-medium transition-colors"
              style={{
                background: mode === m ? 'var(--color-gold)' : 'var(--color-storm)',
                border: `1px solid ${mode === m ? 'var(--color-gold)' : 'var(--color-storm-light)'}`,
                color: mode === m ? '#000' : 'var(--color-fog)',
              }}
            >
              {m === 'tree' ? `${tree.pathName} Path` : 'Custom / Other'}
            </button>
          ))}
        </div>
      )}

      {/* Tree browser */}
      {mode === 'tree' && tree && (
        <div className="flex flex-col gap-3 max-h-80 overflow-y-auto pr-1">
          {/* Key talent */}
          <div>
            <div className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: 'var(--color-gold)' }}>
              Key Talent
            </div>
            <TreeTalentCard
              talent={tree.keyTalent}
              isAcquired={acquiredIds.has(tree.keyTalent.id)}
              isSelected={choices.selectedTalentId === tree.keyTalent.id}
              prerequisitesMet
              onSelect={() => selectTreeTalent(tree.keyTalent, 'Key Talent')}
            />
          </div>

          {/* Specialties */}
          {tree.specialties.map(specialty => (
            <div key={specialty.id}>
              <button
                type="button"
                onClick={() => setExpandedSpecialty(p => p === specialty.id ? null : specialty.id)}
                className="w-full flex items-center justify-between px-3 py-2 rounded text-sm font-semibold"
                style={{
                  background: 'var(--color-deep-storm)',
                  border: '1px solid var(--color-storm-mid)',
                  color: 'var(--color-stormlight)',
                }}
              >
                <span>{specialty.name}</span>
                <span style={{ color: 'var(--color-fog)' }}>
                  {expandedSpecialty === specialty.id ? '▲' : '▼'}
                </span>
              </button>
              {expandedSpecialty === specialty.id && (
                <div className="mt-1.5 flex flex-col gap-1.5">
                  {specialty.talents.map(talent => (
                    <TreeTalentCard
                      key={talent.id}
                      talent={talent}
                      isAcquired={acquiredIds.has(talent.id)}
                      isSelected={choices.selectedTalentId === talent.id}
                      prerequisitesMet={prerequisitesMet(talent)}
                      onSelect={() => selectTreeTalent(talent, specialty.name)}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Custom / free-text form */}
      {mode === 'custom' && (
        <div className="flex flex-col gap-3">
          <p className="text-sm" style={{ color: 'var(--color-fog)' }}>
            Describe a custom talent (ancestry, homebrew, or other).
          </p>
          <Input
            label="Talent Name"
            value={choices.talentName ?? ''}
            onChange={v => setChoices(c => ({ ...c, talentName: v, selectedTalentId: undefined }))}
            placeholder="e.g. Stormblessed Reflexes"
          />
          <Textarea
            label="Description"
            value={choices.talentDescription ?? ''}
            onChange={v => setChoices(c => ({ ...c, talentDescription: v }))}
            placeholder="When you take the Dodge action…"
            rows={3}
          />
          <div className="flex gap-2">
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--color-fog)' }}>Activation</label>
              <select
                value={choices.talentActivationType ?? 'always-active'}
                onChange={e => setChoices(c => ({ ...c, talentActivationType: e.target.value }))}
                className="text-sm rounded px-2 py-1.5"
                style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)', color: 'var(--color-pale)' }}
              >
                <option value="always-active">Always Active</option>
                <option value="action">Action</option>
                <option value="reaction">Reaction</option>
                <option value="free-action">Free Action</option>
                <option value="special">Special</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--color-fog)' }}>Source</label>
              <input
                type="text"
                value={choices.talentSource ?? 'custom'}
                onChange={e => setChoices(c => ({ ...c, talentSource: e.target.value }))}
                className="text-sm rounded px-2.5 py-1.5"
                style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)', color: 'var(--color-pale)' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Ancestry bonus talent */}
      {ancestryBonusTalent && (
        <div
          className="p-3 rounded"
          style={{ background: 'var(--color-storm)', border: '1px solid var(--color-gold)' }}
        >
          <p className="text-xs font-bold mb-2" style={{ color: 'var(--color-gold)' }}>
            Ancestry Bonus Talent
          </p>
          <Input
            label="Ancestry Talent Name"
            value={choices.ancestryBonusTalentName ?? ''}
            onChange={v => setChoices(c => ({ ...c, ancestryBonusTalentName: v }))}
          />
          <div className="mt-2">
            <Textarea
              label="Description"
              value={choices.ancestryBonusTalentDescription ?? ''}
              onChange={v => setChoices(c => ({ ...c, ancestryBonusTalentDescription: v }))}
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────

function Pill({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className="p-2.5 rounded flex flex-col gap-0.5"
      style={{
        background: highlight ? 'rgba(212,160,23,0.15)' : 'var(--color-storm)',
        border: `1px solid ${highlight ? 'var(--color-gold)' : 'var(--color-storm-light)'}`,
      }}
    >
      <span className="text-xs" style={{ color: 'var(--color-fog)' }}>{label}</span>
      <span className="text-sm font-bold" style={{ color: highlight ? 'var(--color-gold-bright)' : 'var(--color-pale)' }}>
        {value}
      </span>
    </div>
  )
}
