import type { DerivedStats } from '@/types/character'
import { Tooltip } from '@/components/ui/Tooltip'
import { NumberStepper } from '@/components/ui/NumberStepper'

interface DefensePanelProps {
  derived: DerivedStats
  defenseOverrides: { physicalBonus: number; cognitiveBonus: number; spiritualBonus: number }
  readOnly?: boolean
  onOverrideChange?: (key: 'physicalBonus' | 'cognitiveBonus' | 'spiritualBonus', value: number) => void
}

interface DefenseItemProps {
  label: string
  value: number
  formula: string
  tooltip: string
  bonus: number
  readOnly: boolean
  onBonusChange?: (value: number) => void
}

function DefenseItem({ label, value, formula, tooltip, bonus, readOnly, onBonusChange }: DefenseItemProps) {
  return (
    <Tooltip content={tooltip}>
      <div
        className="flex flex-col items-center gap-1 p-3 rounded derived-field"
        style={{ minWidth: 80 }}
      >
        <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-fog)' }}>
          {label}
        </span>
        <span
          className="text-3xl font-bold font-mono"
          style={{ color: 'var(--color-stormlight)' }}
        >
          {value}
        </span>
        <span className="text-xs" style={{ color: 'var(--color-fog)' }}>
          {formula}
        </span>
        {!readOnly && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs" style={{ color: 'var(--color-fog)' }}>±</span>
            <NumberStepper
              value={bonus}
              min={-10}
              max={10}
              onChange={v => onBonusChange?.(v)}
              size="sm"
            />
          </div>
        )}
      </div>
    </Tooltip>
  )
}

export function DefensePanel({ derived, defenseOverrides, readOnly = false, onOverrideChange }: DefensePanelProps) {
  const { effectiveAttributes: ea } = derived

  return (
    <div
      className="rounded-lg p-4"
      style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-gold)' }}>
        Defenses
      </h3>
      <div className="flex gap-4 justify-around">
        <DefenseItem
          label="Physical"
          value={derived.physicalDefense}
          formula={`10 + ${ea.str} + ${ea.spd}${defenseOverrides.physicalBonus !== 0 ? ` + ${defenseOverrides.physicalBonus}` : ''}`}
          tooltip={`Physical Defense = 10 + STR (${ea.str}) + SPD (${ea.spd}) + bonuses. Resists most physical attacks.`}
          bonus={defenseOverrides.physicalBonus}
          readOnly={readOnly}
          onBonusChange={v => onOverrideChange?.('physicalBonus', v)}
        />
        <DefenseItem
          label="Cognitive"
          value={derived.cognitiveDefense}
          formula={`10 + ${ea.int} + ${ea.wil}${defenseOverrides.cognitiveBonus !== 0 ? ` + ${defenseOverrides.cognitiveBonus}` : ''}`}
          tooltip={`Cognitive Defense = 10 + INT (${ea.int}) + WIL (${ea.wil}) + bonuses. Resists mental and illusion effects.`}
          bonus={defenseOverrides.cognitiveBonus}
          readOnly={readOnly}
          onBonusChange={v => onOverrideChange?.('cognitiveBonus', v)}
        />
        <DefenseItem
          label="Spiritual"
          value={derived.spiritualDefense}
          formula={`10 + ${ea.awa} + ${ea.pre}${defenseOverrides.spiritualBonus !== 0 ? ` + ${defenseOverrides.spiritualBonus}` : ''}`}
          tooltip={`Spiritual Defense = 10 + AWA (${ea.awa}) + PRE (${ea.pre}) + bonuses. Resists Investiture and spiritual attacks.`}
          bonus={defenseOverrides.spiritualBonus}
          readOnly={readOnly}
          onBonusChange={v => onOverrideChange?.('spiritualBonus', v)}
        />
      </div>
    </div>
  )
}
