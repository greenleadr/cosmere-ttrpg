import { SINGER_FORMS } from '@/constants/singerForms'
import type { Attributes } from '@/types/character'
import { Tooltip } from '@/components/ui/Tooltip'

interface SingerFormPanelProps {
  activeSingerForm: string | null
  baseAttributes: Attributes
  effectiveAttributes: Attributes
  readOnly?: boolean
  onFormChange: (formId: string | null) => void
}

export function SingerFormPanel({
  activeSingerForm,
  baseAttributes,
  effectiveAttributes,
  readOnly = false,
  onFormChange,
}: SingerFormPanelProps) {
  const activeForm = SINGER_FORMS.find(f => f.id === activeSingerForm)

  return (
    <div
      className="rounded-lg p-4"
      style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
    >
      <h3
        className="text-sm font-semibold uppercase tracking-widest mb-3"
        style={{ color: 'var(--color-gold)' }}
      >
        Singer Form
      </h3>

      {/* Form selector */}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          type="button"
          disabled={readOnly}
          onClick={() => onFormChange(null)}
          className="px-2.5 py-1 rounded text-xs font-medium"
          style={{
            background: activeSingerForm === null ? 'var(--color-storm-light)' : 'var(--color-storm)',
            border: `1px solid ${activeSingerForm === null ? 'var(--color-fog)' : 'var(--color-storm-light)'}`,
            color: activeSingerForm === null ? 'var(--color-pale)' : 'var(--color-fog)',
            cursor: readOnly ? 'default' : 'pointer',
          }}
        >
          None
        </button>
        {SINGER_FORMS.map(form => (
          <Tooltip key={form.id} content={form.ruleTooltip}>
            <button
              type="button"
              disabled={readOnly}
              onClick={() => onFormChange(activeSingerForm === form.id ? null : form.id)}
              className="px-2.5 py-1 rounded text-xs font-medium"
              style={{
                background: activeSingerForm === form.id ? 'var(--color-stormlight)' : 'var(--color-storm)',
                border: `1px solid ${activeSingerForm === form.id ? 'var(--color-stormlight)' : 'var(--color-storm-light)'}`,
                color: activeSingerForm === form.id ? '#fff' : 'var(--color-fog)',
                cursor: readOnly ? 'default' : 'pointer',
              }}
            >
              {form.name}
            </button>
          </Tooltip>
        ))}
      </div>

      {/* Active form details */}
      {activeForm && (
        <div
          className="p-3 rounded"
          style={{ background: 'var(--color-storm)', border: '1px solid var(--color-stormlight)' }}
        >
          <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-stormlight)' }}>
            {activeForm.name}
          </p>
          <p className="text-xs mb-2" style={{ color: 'var(--color-fog)' }}>
            {activeForm.description}
          </p>

          {/* Attribute deltas */}
          <div className="flex flex-wrap gap-2">
            {(Object.entries(activeForm.attributeDeltas) as [keyof Attributes, number][])
              .filter(([, delta]) => delta !== 0)
              .map(([attr, delta]) => (
                <div key={attr} className="flex items-center gap-1 text-xs">
                  <span
                    className="uppercase font-bold"
                    style={{ color: 'var(--color-fog)' }}
                  >
                    {attr.toUpperCase()}
                  </span>
                  <span style={{ color: 'var(--color-fog)' }}>
                    {baseAttributes[attr]}
                  </span>
                  <span style={{ color: 'var(--color-stormlight)' }}>
                    +{delta}
                  </span>
                  <span className="font-bold" style={{ color: 'var(--color-pale)' }}>
                    = {effectiveAttributes[attr]}
                  </span>
                </div>
              ))}
            {activeForm.deflectBonus > 0 && (
              <div className="flex items-center gap-1 text-xs">
                <span className="uppercase font-bold" style={{ color: 'var(--color-fog)' }}>
                  DEFLECT
                </span>
                <span style={{ color: 'var(--color-stormlight)' }}>
                  +{activeForm.deflectBonus}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
