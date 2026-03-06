import { useState } from 'react'
import type { Character, AttributeKey } from '@/types/character'
import type { LevelUpChoices } from '@/engine/levelUpEngine'
import { validateLevelUpChoices, applyLevelUp } from '@/engine/levelUpEngine'
import { getAdvancementRow } from '@/constants/advancement'
import { ATTRIBUTES } from '@/constants/attributes'
import { SKILLS } from '@/constants/skills'
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
              <>
                <p className="text-sm" style={{ color: 'var(--color-fog)' }}>
                  You gain a talent. Describe it below (you can fill in details later).
                </p>
                <Input
                  label="Talent Name"
                  value={choices.talentName ?? ''}
                  onChange={v => setChoices(c => ({ ...c, talentName: v }))}
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
                    <label className="text-xs font-medium" style={{ color: 'var(--color-fog)' }}>
                      Activation
                    </label>
                    <select
                      value={choices.talentActivationType ?? 'always-active'}
                      onChange={e => setChoices(c => ({ ...c, talentActivationType: e.target.value }))}
                      className="text-sm rounded px-2 py-1.5"
                      style={{
                        background: 'var(--color-storm)',
                        border: '1px solid var(--color-storm-light)',
                        color: 'var(--color-pale)',
                      }}
                    >
                      <option value="always-active">Always Active</option>
                      <option value="action">Action</option>
                      <option value="reaction">Reaction</option>
                      <option value="free-action">Free Action</option>
                      <option value="special">Special</option>
                    </select>
                  </div>
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-xs font-medium" style={{ color: 'var(--color-fog)' }}>
                      Source
                    </label>
                    <input
                      type="text"
                      value={choices.talentSource ?? 'level'}
                      onChange={e => setChoices(c => ({ ...c, talentSource: e.target.value }))}
                      className="text-sm rounded px-2.5 py-1.5"
                      style={{
                        background: 'var(--color-storm)',
                        border: '1px solid var(--color-storm-light)',
                        color: 'var(--color-pale)',
                      }}
                    />
                  </div>
                </div>

                {advancement.ancestryBonusTalent && (
                  <div
                    className="p-3 rounded mt-2"
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
              </>
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
