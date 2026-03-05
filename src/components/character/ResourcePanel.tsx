import type { Character, DerivedStats } from '@/types/character'
import { NumberStepper } from '@/components/ui/NumberStepper'
import { Tooltip } from '@/components/ui/Tooltip'

interface ResourcePanelProps {
  character: Character
  derived: DerivedStats
  readOnly?: boolean
  onHealthChange?: (value: number) => void
  onFocusChange?: (value: number) => void
  onInvestitureChange?: (value: number) => void
}

interface ResourceBarProps {
  label: string
  current: number
  max: number
  color: string
  tooltip: string
  readOnly: boolean
  onChange?: (value: number) => void
}

function ResourceBar({ label, current, max, color, tooltip, readOnly, onChange }: ResourceBarProps) {
  const pct = max > 0 ? Math.min(100, (current / max) * 100) : 0

  return (
    <Tooltip content={tooltip}>
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-fog)' }}>
            {label}
          </span>
          <span className="text-xs font-mono" style={{ color }}>
            {current} / {max}
          </span>
        </div>
        <div
          className="h-2 rounded-full overflow-hidden"
          style={{ background: 'var(--color-storm-mid)' }}
        >
          <div
            className="h-full rounded-full transition-all duration-150"
            style={{ width: `${pct}%`, background: color }}
          />
        </div>
        {!readOnly && (
          <div className="flex justify-center">
            <NumberStepper
              value={current}
              min={0}
              max={max}
              onChange={v => onChange?.(v)}
              size="sm"
            />
          </div>
        )}
      </div>
    </Tooltip>
  )
}

export function ResourcePanel({
  character,
  derived,
  readOnly = false,
  onHealthChange,
  onFocusChange,
  onInvestitureChange,
}: ResourcePanelProps) {
  const { resources } = character

  return (
    <div
      className="rounded-lg p-4"
      style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
    >
      <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-gold)' }}>
        Resources
      </h3>
      <div className="flex flex-col gap-4">
        <ResourceBar
          label="Health"
          current={resources.healthCurrent}
          max={derived.maxHealth}
          color="var(--color-health)"
          tooltip={`Health: ${resources.healthCurrent} / ${derived.maxHealth}. At 0, the character becomes Unconscious and suffers an Injury Roll.`}
          readOnly={readOnly}
          onChange={onHealthChange}
        />
        <ResourceBar
          label="Focus"
          current={resources.focusCurrent}
          max={derived.maxFocus}
          color="var(--color-focus)"
          tooltip={`Focus: ${resources.focusCurrent} / ${derived.maxFocus}. Max Focus = 2 × WIL (${character.attributes.wil}) + talent bonuses (${character.focusBonus}). Spent to activate talents.`}
          readOnly={readOnly}
          onChange={onFocusChange}
        />
        {character.isRadiant && (
          <ResourceBar
            label="Investiture"
            current={resources.investitureCurrent}
            max={derived.maxInvestiture}
            color="var(--color-investiture)"
            tooltip={`Investiture: ${resources.investitureCurrent} / ${derived.maxInvestiture}. Fuels Surgebinding. Recovered by breathing in Stormlight from infused spheres.`}
            readOnly={readOnly}
            onChange={onInvestitureChange}
          />
        )}

        {/* Deflect display */}
        <Tooltip content={`Deflect: ${derived.deflect}. Reduces incoming impact, keen, and energy damage. Comes from equipped armour and/or talents.`}>
          <div className="flex items-center justify-between py-1">
            <span className="text-xs uppercase tracking-wider" style={{ color: 'var(--color-fog)' }}>
              Deflect
            </span>
            <span
              className="text-sm font-bold font-mono derived-field px-2 py-0.5 rounded"
              style={{ color: 'var(--color-stormlight)' }}
            >
              {derived.deflect}
            </span>
          </div>
        </Tooltip>
      </div>
    </div>
  )
}
