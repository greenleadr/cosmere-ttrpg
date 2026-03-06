import type { AdversaryTemplate } from '@/types/adversary'
import { Button } from '@/components/ui/Button'

interface StatBlockCardProps {
  template: AdversaryTemplate
  onEdit: () => void
  onDelete: () => void
  onAddToEncounter?: () => void
}

const ROLE_COLORS: Record<string, string> = {
  Minion: '#406040',
  Rival: '#604020',
  Boss: '#802030',
}

export function StatBlockCard({ template, onEdit, onDelete, onAddToEncounter }: StatBlockCardProps) {
  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: 'var(--color-deep-storm)',
        border: '1px solid var(--color-storm-mid)',
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center justify-between"
        style={{ background: 'var(--color-storm)', borderBottom: '1px solid var(--color-storm-mid)' }}
      >
        <div>
          <span className="font-bold text-sm" style={{ color: 'var(--color-gold-bright)' }}>
            {template.name}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-xs font-medium px-1.5 py-0.5 rounded"
              style={{ background: ROLE_COLORS[template.role] ?? '#404040', color: '#fff' }}
            >
              {template.role}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-fog)' }}>Tier {template.tier}</span>
            {template.tags.slice(0, 3).map(tag => (
              <span key={tag} className="text-xs px-1 py-0.5 rounded" style={{ background: 'var(--color-storm-mid)', color: 'var(--color-fog)' }}>
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-1">
          {onAddToEncounter && (
            <Button variant="secondary" size="sm" onClick={onAddToEncounter}>
              + Combat
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
          <Button variant="ghost" size="sm" onClick={onDelete}>✕</Button>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-3">
        {template.description && (
          <p className="text-xs mb-3 italic" style={{ color: 'var(--color-fog)' }}>
            {template.description}
          </p>
        )}

        {/* Attributes */}
        <div className="grid grid-cols-6 gap-1 mb-3">
          {(['str', 'spd', 'int', 'wil', 'awa', 'pre'] as const).map(key => (
            <div key={key} className="flex flex-col items-center">
              <span className="text-xs font-bold uppercase" style={{ color: 'var(--color-fog)' }}>{key}</span>
              <span className="text-base font-bold" style={{ color: 'var(--color-pale)' }}>
                {template.attributes[key]}
              </span>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <StatPill label="PD" value={template.defenses.physical} />
          <StatPill label="CD" value={template.defenses.cognitive} />
          <StatPill label="SD" value={template.defenses.spiritual} />
          <StatPill label="HP" value={template.health} color="var(--color-health)" />
          <StatPill label="Focus" value={template.focus} color="var(--color-stormlight)" />
          <StatPill label="Deflect" value={template.deflect} />
          <StatPill label="Move" value={`${template.movement}ft`} />
          {template.investiture > 0 && <StatPill label="Invest." value={template.investiture} />}
        </div>

        {/* Abilities */}
        {template.abilities.length > 0 && (
          <div className="flex flex-col gap-1.5">
            {template.abilities.map(ability => (
              <div key={ability.id}>
                <span className="text-xs font-bold" style={{ color: 'var(--color-gold-bright)' }}>
                  {ability.name}
                </span>
                <span className="text-xs ml-1" style={{ color: 'var(--color-fog)' }}>
                  [{ability.type}{ability.cost ? ` · ${ability.cost}` : ''}]
                </span>
                {ability.description && (
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-pale)' }}>
                    {ability.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatPill({ label, value, color }: { label: string; value: number | string; color?: string }) {
  return (
    <div
      className="flex items-center justify-between px-2 py-1 rounded"
      style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)' }}
    >
      <span className="text-xs" style={{ color: 'var(--color-fog)' }}>{label}</span>
      <span className="text-xs font-bold" style={{ color: color ?? 'var(--color-pale)' }}>
        {value}
      </span>
    </div>
  )
}
