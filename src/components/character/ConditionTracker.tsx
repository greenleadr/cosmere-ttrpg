import { CONDITIONS } from '@/constants/conditions'
import type { ActiveCondition } from '@/types/character'
import { Tooltip } from '@/components/ui/Tooltip'

interface ConditionTrackerProps {
  activeConditions: ActiveCondition[]
  readOnly?: boolean
  onToggle: (conditionId: string) => void
  onExhaustedStackChange: (stacks: number) => void
}

export function ConditionTracker({
  activeConditions,
  readOnly = false,
  onToggle,
  onExhaustedStackChange,
}: ConditionTrackerProps) {
  const isActive = (id: string) => activeConditions.some(c => c.conditionId === id)
  const exhaustedEntry = activeConditions.find(c => c.conditionId === 'exhausted')
  const exhaustedStacks = exhaustedEntry?.stacks ?? 0

  return (
    <div
      className="rounded-lg p-4"
      style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
    >
      <h3
        className="text-sm font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--color-gold)' }}
      >
        Conditions
      </h3>

      <div className="flex flex-wrap gap-2">
        {CONDITIONS.map(cond => {
          const active = isActive(cond.id)
          return (
            <Tooltip key={cond.id} content={cond.ruleTooltip}>
              <button
                type="button"
                disabled={readOnly}
                onClick={() => {
                  if (cond.id === 'exhausted') {
                    if (active) {
                      onToggle(cond.id)
                    } else {
                      onExhaustedStackChange(1)
                    }
                  } else {
                    onToggle(cond.id)
                  }
                }}
                className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-opacity"
                style={{
                  background: active ? cond.color : 'var(--color-storm)',
                  border: `1px solid ${active ? cond.color : 'var(--color-storm-light)'}`,
                  color: active ? '#fff' : 'var(--color-fog)',
                  opacity: readOnly ? 0.7 : 1,
                  cursor: readOnly ? 'default' : 'pointer',
                }}
              >
                {cond.name}
                {cond.id === 'exhausted' && active && (
                  <span className="ml-1 font-bold">[−{exhaustedStacks}]</span>
                )}
              </button>
            </Tooltip>
          )
        })}
      </div>

      {/* Exhausted stack controls */}
      {isActive('exhausted') && !readOnly && (
        <div className="mt-3 flex items-center gap-3">
          <span className="text-xs" style={{ color: 'var(--color-fog)' }}>
            Exhausted stacks:
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                const next = Math.max(0, exhaustedStacks - 1)
                if (next === 0) onToggle('exhausted')
                else onExhaustedStackChange(next)
              }}
              className="w-6 h-6 rounded text-sm font-bold flex items-center justify-center"
              style={{
                background: 'var(--color-storm)',
                border: '1px solid var(--color-storm-light)',
                color: 'var(--color-pale)',
              }}
            >
              −
            </button>
            <span
              className="w-6 text-center text-sm font-bold"
              style={{ color: 'var(--color-health)' }}
            >
              {exhaustedStacks}
            </span>
            <button
              type="button"
              onClick={() => onExhaustedStackChange(exhaustedStacks + 1)}
              className="w-6 h-6 rounded text-sm font-bold flex items-center justify-center"
              style={{
                background: 'var(--color-storm)',
                border: '1px solid var(--color-storm-light)',
                color: 'var(--color-pale)',
              }}
            >
              +
            </button>
          </div>
          {exhaustedStacks >= 10 && (
            <span className="text-xs font-bold" style={{ color: 'var(--color-health)' }}>
              DEATH
            </span>
          )}
        </div>
      )}
    </div>
  )
}
