import { useState } from 'react'
import type { AdversaryTemplate, AdversaryRole, AdversaryAbility } from '@/types/adversary'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { ATTRIBUTES } from '@/constants/attributes'
import { nanoid } from 'nanoid'

type DraftTemplate = Omit<AdversaryTemplate, 'id' | 'schemaVersion' | 'createdAt' | 'updatedAt'>

const EMPTY_DRAFT: DraftTemplate = {
  name: '',
  role: 'Rival',
  tier: 1,
  attributes: { str: 1, spd: 1, int: 1, wil: 1, awa: 1, pre: 1 },
  defenses: { physical: 12, cognitive: 12, spiritual: 12 },
  health: 20,
  focus: 4,
  investiture: 0,
  deflect: 0,
  movement: 30,
  senses: 'Normal',
  skills: {},
  abilities: [],
  description: '',
  tags: [],
}

interface StatBlockEditorProps {
  initial?: AdversaryTemplate
  onSave: (draft: DraftTemplate) => void
  onCancel: () => void
}

const ROLE_OPTIONS: { value: AdversaryRole; label: string }[] = [
  { value: 'Minion', label: 'Minion' },
  { value: 'Rival', label: 'Rival' },
  { value: 'Boss', label: 'Boss' },
]

const TIER_OPTIONS = [1, 2, 3, 4, 5].map(t => ({ value: String(t), label: `Tier ${t}` }))

export function StatBlockEditor({ initial, onSave, onCancel }: StatBlockEditorProps) {
  const [draft, setDraft] = useState<DraftTemplate>(
    initial
      ? { ...initial }
      : { ...EMPTY_DRAFT, attributes: { ...EMPTY_DRAFT.attributes }, defenses: { ...EMPTY_DRAFT.defenses } }
  )
  const [abilityDraft, setAbilityDraft] = useState({ name: '', type: 'action' as AdversaryAbility['type'], description: '', cost: '' })
  const [addingAbility, setAddingAbility] = useState(false)
  const [tagInput, setTagInput] = useState('')

  function setField<K extends keyof DraftTemplate>(key: K, value: DraftTemplate[K]) {
    setDraft(d => ({ ...d, [key]: value }))
  }

  function handleAddAbility() {
    if (!abilityDraft.name.trim()) return
    setField('abilities', [
      ...draft.abilities,
      { id: nanoid(8), ...abilityDraft, cost: abilityDraft.cost || undefined },
    ])
    setAbilityDraft({ name: '', type: 'action', description: '', cost: '' })
    setAddingAbility(false)
  }

  function handleAddTag() {
    const t = tagInput.trim()
    if (!t || draft.tags.includes(t)) return
    setField('tags', [...draft.tags, t])
    setTagInput('')
  }

  const sectionStyle = {
    background: 'var(--color-storm)',
    border: '1px solid var(--color-storm-light)',
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      {/* Identity */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-gold)' }}>
          Identity
        </h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="col-span-1">
            <Input label="Name" value={draft.name} onChange={v => setField('name', v)} placeholder="Fused Assassin" />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-fog)' }}>Role</label>
            <Select
              value={draft.role}
              onChange={v => setField('role', v as AdversaryRole)}
              options={ROLE_OPTIONS}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium" style={{ color: 'var(--color-fog)' }}>Tier</label>
            <Select
              value={String(draft.tier)}
              onChange={v => setField('tier', Number(v))}
              options={TIER_OPTIONS}
            />
          </div>
        </div>
        <Textarea
          label="Description"
          value={draft.description}
          onChange={v => setField('description', v)}
          placeholder="A fearsome servant of Odium…"
          rows={2}
        />
      </div>

      {/* Attributes */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-gold)' }}>
          Attributes
        </h3>
        <div className="grid grid-cols-6 gap-2">
          {ATTRIBUTES.map(attr => (
            <div key={attr.key} className="flex flex-col items-center gap-1">
              <label className="text-xs font-bold uppercase" style={{ color: 'var(--color-fog)' }}>
                {attr.abbr}
              </label>
              <input
                type="number"
                min={0}
                max={10}
                value={draft.attributes[attr.key]}
                onChange={e => setField('attributes', { ...draft.attributes, [attr.key]: Number(e.target.value) || 0 })}
                className="w-full text-center text-sm rounded px-1 py-1.5"
                style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)', color: 'var(--color-pale)' }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Defenses & Resources */}
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-gold)' }}>
            Defenses
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {(['physical', 'cognitive', 'spiritual'] as const).map(def => (
              <div key={def} className="flex flex-col items-center gap-1">
                <label className="text-xs capitalize" style={{ color: 'var(--color-fog)' }}>{def}</label>
                <input
                  type="number"
                  min={0}
                  value={draft.defenses[def]}
                  onChange={e => setField('defenses', { ...draft.defenses, [def]: Number(e.target.value) || 0 })}
                  className="w-full text-center text-sm rounded px-1 py-1.5"
                  style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)', color: 'var(--color-pale)' }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-gold)' }}>
            Resources
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {([
              ['Health', 'health'],
              ['Focus', 'focus'],
              ['Investiture', 'investiture'],
              ['Deflect', 'deflect'],
              ['Movement', 'movement'],
            ] as const).map(([label, key]) => (
              <div key={key} className="flex flex-col gap-1">
                <label className="text-xs" style={{ color: 'var(--color-fog)' }}>{label}</label>
                <input
                  type="number"
                  min={0}
                  value={draft[key]}
                  onChange={e => setField(key, Number(e.target.value) || 0)}
                  className="w-full text-sm rounded px-2 py-1.5"
                  style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)', color: 'var(--color-pale)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Abilities */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-gold)' }}>
            Abilities
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setAddingAbility(v => !v)}>
            {addingAbility ? 'Cancel' : '+ Add Ability'}
          </Button>
        </div>

        {addingAbility && (
          <div className="p-3 rounded flex flex-col gap-2" style={sectionStyle}>
            <div className="grid grid-cols-2 gap-2">
              <Input label="Name" value={abilityDraft.name} onChange={v => setAbilityDraft(a => ({ ...a, name: v }))} />
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium" style={{ color: 'var(--color-fog)' }}>Type</label>
                <Select
                  value={abilityDraft.type}
                  onChange={v => setAbilityDraft(a => ({ ...a, type: v as AdversaryAbility['type'] }))}
                  options={[
                    { value: 'passive', label: 'Passive' },
                    { value: 'action', label: 'Action' },
                    { value: 'reaction', label: 'Reaction' },
                  ]}
                />
              </div>
            </div>
            <Input label="Cost (optional)" value={abilityDraft.cost} onChange={v => setAbilityDraft(a => ({ ...a, cost: v }))} placeholder="2 Focus" />
            <Textarea label="Description" value={abilityDraft.description} onChange={v => setAbilityDraft(a => ({ ...a, description: v }))} rows={2} />
            <Button variant="primary" size="sm" onClick={handleAddAbility}>Add Ability</Button>
          </div>
        )}

        {draft.abilities.length === 0 && !addingAbility && (
          <p className="text-sm" style={{ color: 'var(--color-fog)' }}>No abilities.</p>
        )}

        <div className="flex flex-col gap-2">
          {draft.abilities.map(ability => (
            <div key={ability.id} className="p-3 rounded" style={sectionStyle}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-gold-bright)' }}>{ability.name}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--color-fog)' }}>[{ability.type}]</span>
                  {ability.cost && <span className="text-xs ml-1" style={{ color: 'var(--color-fog)' }}>· {ability.cost}</span>}
                  {ability.description && (
                    <p className="text-xs mt-1" style={{ color: 'var(--color-pale)' }}>{ability.description}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setField('abilities', draft.abilities.filter(a => a.id !== ability.id))}
                  className="text-xs hover:opacity-70 shrink-0"
                  style={{ color: 'var(--color-fog)' }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-col gap-2">
        <h3 className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--color-gold)' }}>
          Tags
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag() } }}
            placeholder="undead, fused, elite…"
            className="flex-1 text-sm rounded px-2.5 py-1.5"
            style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)', color: 'var(--color-pale)' }}
          />
          <Button variant="ghost" size="sm" onClick={handleAddTag}>Add</Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {draft.tags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => setField('tags', draft.tags.filter(t => t !== tag))}
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)', color: 'var(--color-fog)' }}
            >
              {tag} ✕
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-2" style={{ borderTop: '1px solid var(--color-storm-mid)' }}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => onSave(draft)} disabled={!draft.name.trim()}>
          {initial ? 'Save Changes' : 'Create Adversary'}
        </Button>
      </div>
    </div>
  )
}
