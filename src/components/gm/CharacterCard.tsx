import type { Character } from '@/types/character'
import type { DerivedStats } from '@/types/character'
import { CONDITIONS } from '@/constants/conditions'
import { Tooltip } from '@/components/ui/Tooltip'

interface CharacterCardProps {
  character: Character
  derived: DerivedStats
  onClick: () => void
}

export function CharacterCard({ character, derived, onClick }: CharacterCardProps) {
  const hpPct = derived.maxHealth > 0
    ? Math.max(0, character.resources.healthCurrent / derived.maxHealth)
    : 0
  const focusPct = derived.maxFocus > 0
    ? Math.max(0, character.resources.focusCurrent / derived.maxFocus)
    : 0

  const hpColor =
    hpPct > 0.6 ? 'var(--color-health)' :
    hpPct > 0.3 ? '#c09020' :
    'var(--color-health)'

  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left rounded-lg p-4 transition-all hover:opacity-90 active:opacity-80 w-full"
      style={{
        background: 'var(--color-deep-storm)',
        border: '1px solid var(--color-storm-mid)',
        cursor: 'pointer',
      }}
    >
      {/* Name & level */}
      <div className="mb-2">
        <div className="font-bold text-sm truncate" style={{ color: 'var(--color-gold-bright)' }}>
          {character.name || 'Unnamed'}
        </div>
        <div className="text-xs" style={{ color: 'var(--color-fog)' }}>
          Lv {character.level} · {character.ancestry}
          {character.heroicPaths[0] && ` · ${character.heroicPaths[0]}`}
        </div>
      </div>

      {/* HP bar */}
      <div className="mb-1.5">
        <div className="flex justify-between text-xs mb-0.5" style={{ color: 'var(--color-fog)' }}>
          <span>HP</span>
          <span style={{ color: 'var(--color-pale)' }}>
            {character.resources.healthCurrent}/{derived.maxHealth}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-storm)' }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${hpPct * 100}%`, background: hpColor }}
          />
        </div>
      </div>

      {/* Focus bar */}
      {derived.maxFocus > 0 && (
        <div className="mb-2">
          <div className="flex justify-between text-xs mb-0.5" style={{ color: 'var(--color-fog)' }}>
            <span>Focus</span>
            <span style={{ color: 'var(--color-pale)' }}>
              {character.resources.focusCurrent}/{derived.maxFocus}
            </span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-storm)' }}>
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${focusPct * 100}%`, background: 'var(--color-stormlight)' }}
            />
          </div>
        </div>
      )}

      {/* Active conditions */}
      {character.activeConditions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {character.activeConditions.map(ac => {
            const def = CONDITIONS.find(c => c.id === ac.conditionId)
            if (!def) return null
            return (
              <Tooltip key={ac.conditionId} content={def.ruleTooltip}>
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-medium"
                  style={{ background: def.color, color: '#fff' }}
                >
                  {def.name}
                  {ac.stacks && ac.stacks > 1 ? ` ×${ac.stacks}` : ''}
                </span>
              </Tooltip>
            )
          })}
        </div>
      )}
    </button>
  )
}
