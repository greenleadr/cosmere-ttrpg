import { ATTRIBUTES } from '@/constants/attributes'
import type { Attributes, AttributeKey } from '@/types/character'
import { NumberStepper } from '@/components/ui/NumberStepper'
import { Tooltip } from '@/components/ui/Tooltip'

interface AttributePanelProps {
  attributes: Attributes
  effectiveAttributes?: Attributes
  readOnly?: boolean
  onChange?: (key: AttributeKey, value: number) => void
}

export function AttributePanel({
  attributes,
  effectiveAttributes,
  readOnly = false,
  onChange,
}: AttributePanelProps) {
  const pointsUsed = Object.values(attributes).reduce((s, v) => s + v, 0)

  return (
    <div
      className="rounded-lg p-4"
      style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-gold)' }}>
          Attributes
        </h3>
        {!readOnly && (
          <span className="text-xs" style={{ color: 'var(--color-fog)' }}>
            Points used: <span style={{ color: pointsUsed > 12 ? 'var(--color-health)' : 'var(--color-gold-bright)' }}>{pointsUsed}</span> / 12
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        {ATTRIBUTES.map(def => {
          const base = attributes[def.key]
          const effective = effectiveAttributes?.[def.key] ?? base
          const modified = effective !== base

          return (
            <Tooltip key={def.key} content={def.ruleTooltip}>
              <div
                className="flex flex-col items-center gap-1 p-2 rounded"
                style={{
                  background: 'var(--color-storm)',
                  border: modified
                    ? '1px solid var(--color-stormlight-glow)'
                    : '1px solid var(--color-storm-light)',
                }}
              >
                <span
                  className="text-xs uppercase tracking-wider font-bold"
                  style={{ color: 'var(--color-gold)' }}
                >
                  {def.abbr}
                </span>

                {readOnly ? (
                  <span
                    className="text-2xl font-bold font-mono"
                    style={{ color: modified ? 'var(--color-stormlight)' : 'var(--color-white)' }}
                  >
                    {effective}
                  </span>
                ) : (
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className="text-2xl font-bold font-mono leading-none"
                      style={{ color: modified ? 'var(--color-stormlight)' : 'var(--color-white)' }}
                    >
                      {effective}
                    </span>
                    {modified && (
                      <span className="text-xs" style={{ color: 'var(--color-fog)' }}>
                        base {base}
                      </span>
                    )}
                    <NumberStepper
                      value={base}
                      min={0}
                      max={5}
                      onChange={v => onChange?.(def.key, v)}
                      size="sm"
                    />
                  </div>
                )}

                <span
                  className="text-xs text-center leading-tight"
                  style={{ color: 'var(--color-fog)' }}
                >
                  {def.name}
                </span>
              </div>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}
