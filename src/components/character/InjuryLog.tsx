import { useState } from 'react'
import type { InjuryEntry } from '@/types/character'
import { INJURY_DURATIONS } from '@/constants/injuries'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'

interface InjuryLogProps {
  injuries: InjuryEntry[]
  readOnly?: boolean
  onAdd: (injury: Omit<InjuryEntry, 'id' | 'createdAt'>) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, updates: Partial<InjuryEntry>) => void
}

const SEVERITY_COLORS: Record<InjuryEntry['durationCategory'], string> = {
  'death': 'var(--color-health)',
  'permanent': '#c04020',
  'vicious': '#804030',
  'shallow': '#604020',
  'flesh-wound': '#406040',
}

export function InjuryLog({ injuries, readOnly = false, onAdd, onRemove, onUpdate }: InjuryLogProps) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    description: '',
    durationCategory: 'shallow' as InjuryEntry['durationCategory'],
    mechanicalEffect: '',
    daysRemaining: undefined as number | undefined,
    isPermanent: false,
  })

  const categoryOptions = INJURY_DURATIONS.map(c => ({ value: c.category, label: c.label }))

  function handleAdd() {
    if (!form.description.trim()) return
    onAdd({ ...form })
    setForm({ description: '', durationCategory: 'shallow', mechanicalEffect: '', daysRemaining: undefined, isPermanent: false })
    setAdding(false)
  }

  return (
    <div
      className="rounded-lg p-4"
      style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3
          className="text-sm font-semibold uppercase tracking-widest"
          style={{ color: 'var(--color-gold)' }}
        >
          Injuries
        </h3>
        {!readOnly && (
          <Button variant="ghost" size="sm" onClick={() => setAdding(v => !v)}>
            {adding ? 'Cancel' : '+ Add Injury'}
          </Button>
        )}
      </div>

      {adding && (
        <div
          className="mb-4 p-3 rounded flex flex-col gap-2"
          style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)' }}
        >
          <Input
            label="Description"
            value={form.description}
            onChange={v => setForm(f => ({ ...f, description: v }))}
            placeholder="Fractured rib from fall…"
          />
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-xs font-medium" style={{ color: 'var(--color-fog)' }}>
                Category
              </label>
              <Select
                value={form.durationCategory}
                onChange={v => setForm(f => ({ ...f, durationCategory: v as InjuryEntry['durationCategory'] }))}
                options={categoryOptions}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium" style={{ color: 'var(--color-fog)' }}>
                Days
              </label>
              <input
                type="number"
                min={0}
                value={form.daysRemaining ?? ''}
                onChange={e => setForm(f => ({ ...f, daysRemaining: e.target.value ? Number(e.target.value) : undefined }))}
                className="w-16 text-sm rounded px-2 py-1.5"
                style={{
                  background: 'var(--color-storm-mid)',
                  border: '1px solid var(--color-storm-light)',
                  color: 'var(--color-pale)',
                }}
              />
            </div>
          </div>
          <Textarea
            label="Mechanical Effect"
            value={form.mechanicalEffect}
            onChange={v => setForm(f => ({ ...f, mechanicalEffect: v }))}
            placeholder="−1 to all STR-based tests…"
            rows={2}
          />
          <label className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-fog)' }}>
            <input
              type="checkbox"
              checked={form.isPermanent}
              onChange={e => setForm(f => ({ ...f, isPermanent: e.target.checked }))}
            />
            Permanent
          </label>
          <Button variant="primary" size="sm" onClick={handleAdd}>
            Record Injury
          </Button>
        </div>
      )}

      {injuries.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--color-fog)' }}>
          No injuries recorded.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {injuries.map(inj => (
            <div
              key={inj.id}
              className="p-3 rounded flex flex-col gap-1"
              style={{
                background: 'var(--color-storm)',
                border: `1px solid ${SEVERITY_COLORS[inj.durationCategory]}`,
              }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="text-xs font-bold px-1.5 py-0.5 rounded"
                    style={{
                      background: SEVERITY_COLORS[inj.durationCategory],
                      color: '#fff',
                    }}
                  >
                    {INJURY_DURATIONS.find(c => c.category === inj.durationCategory)?.label ?? inj.durationCategory}
                  </span>
                  {inj.isPermanent && (
                    <span className="text-xs font-bold" style={{ color: 'var(--color-health)' }}>
                      PERMANENT
                    </span>
                  )}
                  {inj.daysRemaining !== undefined && (
                    <span className="text-xs" style={{ color: 'var(--color-fog)' }}>
                      {inj.daysRemaining}d remaining
                    </span>
                  )}
                </div>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => onRemove(inj.id)}
                    className="text-xs shrink-0 hover:opacity-80"
                    style={{ color: 'var(--color-fog)' }}
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-sm" style={{ color: 'var(--color-pale)' }}>
                {inj.description}
              </p>
              {inj.mechanicalEffect && (
                <p className="text-xs italic" style={{ color: 'var(--color-fog)' }}>
                  {inj.mechanicalEffect}
                </p>
              )}
              {!readOnly && inj.daysRemaining !== undefined && (
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs" style={{ color: 'var(--color-fog)' }}>Days left:</span>
                  <button
                    type="button"
                    onClick={() => onUpdate(inj.id, { daysRemaining: Math.max(0, (inj.daysRemaining ?? 0) - 1) })}
                    className="w-5 h-5 rounded text-xs flex items-center justify-center"
                    style={{ background: 'var(--color-storm-mid)', border: '1px solid var(--color-storm-light)', color: 'var(--color-pale)' }}
                  >
                    −
                  </button>
                  <span className="text-xs w-4 text-center" style={{ color: 'var(--color-pale)' }}>
                    {inj.daysRemaining}
                  </span>
                  <button
                    type="button"
                    onClick={() => onUpdate(inj.id, { daysRemaining: (inj.daysRemaining ?? 0) + 1 })}
                    className="w-5 h-5 rounded text-xs flex items-center justify-center"
                    style={{ background: 'var(--color-storm-mid)', border: '1px solid var(--color-storm-light)', color: 'var(--color-pale)' }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
