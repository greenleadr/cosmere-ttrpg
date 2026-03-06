import { useState } from 'react'
import type { CombatantSlot } from '@/types/combat'
import type { ActiveCondition } from '@/types/character'
import { CONDITIONS } from '@/constants/conditions'
import { Tooltip } from '@/components/ui/Tooltip'
import { NumberStepper } from '@/components/ui/NumberStepper'
import { Badge } from '@/components/ui/Badge'

interface CombatantRowProps {
  combatant: CombatantSlot
  isActive: boolean
  onHPChange: (hp: number) => void
  onFocusChange: (focus: number) => void
  onToggleActed: () => void
  onToggleFast: () => void
  onAddCondition: (condition: ActiveCondition) => void
  onRemoveCondition: (conditionId: string) => void
  onRemove: () => void
}

export function CombatantRow({
  combatant,
  isActive,
  onHPChange,
  onFocusChange,
  onToggleActed,
  onToggleFast,
  onAddCondition,
  onRemoveCondition,
  onRemove,
}: CombatantRowProps) {
  const [showConditions, setShowConditions] = useState(false)
  const hpPct = combatant.hpMax > 0 ? combatant.hpCurrent / combatant.hpMax : 0

  const hpBarColor =
    hpPct > 0.6 ? 'var(--color-health)' :
    hpPct > 0.3 ? '#c09020' : '#c04020'

  return (
    <div
      className="rounded-lg p-3 transition-all"
      style={{
        background: isActive ? 'rgba(99, 168, 210, 0.08)' : 'var(--color-deep-storm)',
        border: `1px solid ${isActive ? 'var(--color-stormlight)' : 'var(--color-storm-mid)'}`,
        opacity: combatant.hasActed ? 0.55 : 1,
      }}
    >
      <div className="flex items-start gap-3">
        {/* Acted toggle */}
        <button
          type="button"
          onClick={onToggleActed}
          className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0"
          style={{
            borderColor: combatant.hasActed ? 'var(--color-stormlight)' : 'var(--color-storm-light)',
            background: combatant.hasActed ? 'var(--color-stormlight)' : 'transparent',
          }}
          title="Toggle acted"
        >
          {combatant.hasActed && (
            <span style={{ color: '#fff', fontSize: '10px', lineHeight: 1 }}>✓</span>
          )}
        </button>

        <div className="flex-1 min-w-0">
          {/* Name row */}
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="font-medium text-sm truncate"
              style={{ color: isActive ? 'var(--color-stormlight)' : 'var(--color-pale)' }}
            >
              {combatant.displayName}
            </span>

            {/* PC / NPC badge */}
            <Badge color={combatant.isPC ? 'var(--color-stormlight)' : 'var(--color-fog)'}>
              {combatant.isPC ? 'PC' : 'NPC'}
            </Badge>

            {/* Fast / Slow toggle */}
            <button
              type="button"
              onClick={onToggleFast}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: combatant.isFast ? 'rgba(212,160,23,0.2)' : 'var(--color-storm)',
                border: `1px solid ${combatant.isFast ? 'var(--color-gold)' : 'var(--color-storm-light)'}`,
                color: combatant.isFast ? 'var(--color-gold-bright)' : 'var(--color-fog)',
              }}
            >
              {combatant.isFast ? 'Fast' : 'Slow'}
            </button>

            {/* Active indicator */}
            {isActive && (
              <span className="text-xs font-bold" style={{ color: 'var(--color-stormlight)' }}>
                ← ACTIVE
              </span>
            )}

            {/* Surprised */}
            {combatant.isSurprised && (
              <Badge color="var(--color-health)">Surprised</Badge>
            )}
          </div>

          {/* HP & Focus bars */}
          <div className="flex gap-4 mb-2">
            {/* HP */}
            <div className="flex-1">
              <div className="flex items-center justify-between text-xs mb-0.5">
                <span style={{ color: 'var(--color-fog)' }}>HP</span>
                <div className="flex items-center gap-1">
                  <NumberStepper
                    value={combatant.hpCurrent}
                    min={0}
                    max={combatant.hpMax}
                    onChange={onHPChange}
                    size="sm"
                  />
                  <span style={{ color: 'var(--color-fog)' }}>/ {combatant.hpMax}</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-storm)' }}>
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${hpPct * 100}%`, background: hpBarColor }}
                />
              </div>
            </div>

            {/* Focus */}
            {combatant.focusMax > 0 && (
              <div style={{ minWidth: 80 }}>
                <div className="flex items-center justify-between text-xs mb-0.5">
                  <span style={{ color: 'var(--color-fog)' }}>Focus</span>
                  <div className="flex items-center gap-1">
                    <NumberStepper
                      value={combatant.focusCurrent}
                      min={0}
                      max={combatant.focusMax}
                      onChange={onFocusChange}
                      size="sm"
                    />
                    <span style={{ color: 'var(--color-fog)' }}>/ {combatant.focusMax}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-storm)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(combatant.focusCurrent / combatant.focusMax) * 100}%`,
                      background: 'var(--color-stormlight)',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Active conditions */}
          <div className="flex flex-wrap gap-1">
            {combatant.conditions.map(ac => {
              const def = CONDITIONS.find(c => c.id === ac.conditionId)
              if (!def) return null
              return (
                <Tooltip key={ac.conditionId} content={def.ruleTooltip}>
                  <button
                    type="button"
                    onClick={() => onRemoveCondition(ac.conditionId)}
                    className="text-xs px-1.5 py-0.5 rounded font-medium"
                    style={{ background: def.color, color: '#fff' }}
                    title="Click to remove"
                  >
                    {def.name}
                    {ac.stacks && ac.stacks > 1 ? ` ×${ac.stacks}` : ''}
                  </button>
                </Tooltip>
              )
            })}

            {/* Add condition */}
            <button
              type="button"
              onClick={() => setShowConditions(v => !v)}
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                background: 'var(--color-storm)',
                border: '1px solid var(--color-storm-light)',
                color: 'var(--color-fog)',
              }}
            >
              + Condition
            </button>
          </div>

          {/* Condition picker */}
          {showConditions && (
            <div
              className="mt-2 p-2 rounded flex flex-wrap gap-1"
              style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)' }}
            >
              {CONDITIONS.filter(c => !combatant.conditions.find(ac => ac.conditionId === c.id)).map(cond => (
                <button
                  key={cond.id}
                  type="button"
                  onClick={() => {
                    onAddCondition({ conditionId: cond.id, stacks: cond.isStacking ? 1 : undefined })
                    setShowConditions(false)
                  }}
                  className="text-xs px-1.5 py-0.5 rounded font-medium"
                  style={{ background: cond.color, color: '#fff' }}
                >
                  {cond.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Remove button */}
        <button
          type="button"
          onClick={onRemove}
          className="text-xs hover:opacity-70 shrink-0"
          style={{ color: 'var(--color-fog)' }}
        >
          ✕
        </button>
      </div>
    </div>
  )
}
