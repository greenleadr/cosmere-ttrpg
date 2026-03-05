import type { DerivedStats } from '@/types/character'
import { Tooltip } from '@/components/ui/Tooltip'

interface DerivedStatsBarProps {
  derived: DerivedStats
}

export function DerivedStatsBar({ derived }: DerivedStatsBarProps) {
  const stats = [
    {
      label: 'Movement',
      value: `${derived.movement} ft`,
      tooltip: `Movement Rate: ${derived.movement} feet per action. Derived from Speed (${derived.effectiveAttributes.spd}).`,
    },
    {
      label: 'Recovery Die',
      value: derived.recoveryDie,
      tooltip: `Recovery Die: ${derived.recoveryDie}. Derived from Willpower (${derived.effectiveAttributes.wil}). Used to recover Health during rests.`,
    },
    {
      label: 'Senses',
      value: `${derived.sensesRange} ft`,
      tooltip: `Senses Range: ${derived.sensesRange} feet when primary sense is obscured. Derived from Awareness (${derived.effectiveAttributes.awa}).`,
    },
    {
      label: 'Lifting',
      value: `${derived.liftingCapacity} lbs`,
      tooltip: `Lifting Capacity: ${derived.liftingCapacity} pounds. Derived from Strength (${derived.effectiveAttributes.str}).`,
    },
  ]

  return (
    <div
      className="rounded-lg p-3"
      style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
    >
      <div className="flex gap-4 flex-wrap">
        {stats.map(s => (
          <Tooltip key={s.label} content={s.tooltip}>
            <div className="flex flex-col items-center gap-0.5 derived-field px-3 py-1.5 rounded">
              <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-fog)' }}>
                {s.label}
              </span>
              <span className="text-sm font-mono font-bold" style={{ color: 'var(--color-stormlight)' }}>
                {s.value}
              </span>
            </div>
          </Tooltip>
        ))}
      </div>
    </div>
  )
}
