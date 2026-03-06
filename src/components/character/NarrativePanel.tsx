import { useState } from 'react'
import type { Character, GoalEntry, ConnectionEntry } from '@/types/character'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'

interface NarrativePanelProps {
  character: Character
  readOnly?: boolean
  onAddGoal: (g: Omit<GoalEntry, 'id'>) => void
  onRemoveGoal: (id: string) => void
  onAddConnection: (c: Omit<ConnectionEntry, 'id'>) => void
  onRemoveConnection: (id: string) => void
  onRewardsChange: (text: string) => void
}

export function NarrativePanel({
  character,
  readOnly = false,
  onAddGoal,
  onRemoveGoal,
  onAddConnection,
  onRemoveConnection,
  onRewardsChange,
}: NarrativePanelProps) {
  const [addingGoal, setAddingGoal] = useState(false)
  const [addingConn, setAddingConn] = useState(false)
  const [goalForm, setGoalForm] = useState({ purpose: '', obstacle: '', note: '' })
  const [connForm, setConnForm] = useState({ name: '', relationship: '', status: '' })

  const panelStyle = {
    background: 'var(--color-deep-storm)',
    border: '1px solid var(--color-storm-mid)',
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Goals */}
      <div className="rounded-lg p-4" style={panelStyle}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-gold)' }}>
            Goals
          </h3>
          {!readOnly && (
            <Button variant="ghost" size="sm" onClick={() => setAddingGoal(v => !v)}>
              {addingGoal ? 'Cancel' : '+ Add Goal'}
            </Button>
          )}
        </div>

        {addingGoal && (
          <div
            className="mb-3 p-3 rounded flex flex-col gap-2"
            style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)' }}
          >
            <Input label="Purpose" value={goalForm.purpose} onChange={v => setGoalForm(f => ({ ...f, purpose: v }))} placeholder="What does the character want?" />
            <Input label="Obstacle" value={goalForm.obstacle} onChange={v => setGoalForm(f => ({ ...f, obstacle: v }))} placeholder="What stands in the way?" />
            <Input label="Note" value={goalForm.note} onChange={v => setGoalForm(f => ({ ...f, note: v }))} placeholder="Additional context…" />
            <Button variant="primary" size="sm" onClick={() => {
              if (!goalForm.purpose.trim()) return
              onAddGoal(goalForm)
              setGoalForm({ purpose: '', obstacle: '', note: '' })
              setAddingGoal(false)
            }}>Add Goal</Button>
          </div>
        )}

        {character.goals.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--color-fog)' }}>No goals recorded.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {character.goals.map(g => (
              <div
                key={g.id}
                className="p-3 rounded"
                style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)' }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--color-pale)' }}>{g.purpose}</p>
                    {g.obstacle && (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-fog)' }}>
                        Obstacle: {g.obstacle}
                      </p>
                    )}
                    {g.note && (
                      <p className="text-xs mt-0.5 italic" style={{ color: 'var(--color-fog)' }}>{g.note}</p>
                    )}
                  </div>
                  {!readOnly && (
                    <button type="button" onClick={() => onRemoveGoal(g.id)} className="text-xs ml-2 hover:opacity-70" style={{ color: 'var(--color-fog)' }}>✕</button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Connections */}
      <div className="rounded-lg p-4" style={panelStyle}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-gold)' }}>
            Connections
          </h3>
          {!readOnly && (
            <Button variant="ghost" size="sm" onClick={() => setAddingConn(v => !v)}>
              {addingConn ? 'Cancel' : '+ Add Connection'}
            </Button>
          )}
        </div>

        {addingConn && (
          <div
            className="mb-3 p-3 rounded flex flex-col gap-2"
            style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)' }}
          >
            <Input label="Name" value={connForm.name} onChange={v => setConnForm(f => ({ ...f, name: v }))} placeholder="Kaladin Stormblessed" />
            <Input label="Relationship" value={connForm.relationship} onChange={v => setConnForm(f => ({ ...f, relationship: v }))} placeholder="Commanding officer, ally…" />
            <Input label="Status" value={connForm.status} onChange={v => setConnForm(f => ({ ...f, status: v }))} placeholder="Trusted, estranged, unknown…" />
            <Button variant="primary" size="sm" onClick={() => {
              if (!connForm.name.trim()) return
              onAddConnection(connForm)
              setConnForm({ name: '', relationship: '', status: '' })
              setAddingConn(false)
            }}>Add Connection</Button>
          </div>
        )}

        {character.connections.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--color-fog)' }}>No connections recorded.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {character.connections.map(c => (
              <div
                key={c.id}
                className="flex items-center justify-between p-2.5 rounded"
                style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)' }}
              >
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--color-pale)' }}>{c.name}</span>
                  {c.relationship && (
                    <span className="text-xs ml-2" style={{ color: 'var(--color-fog)' }}>{c.relationship}</span>
                  )}
                  {c.status && (
                    <span className="text-xs ml-1 italic" style={{ color: 'var(--color-fog)' }}>· {c.status}</span>
                  )}
                </div>
                {!readOnly && (
                  <button type="button" onClick={() => onRemoveConnection(c.id)} className="text-xs hover:opacity-70" style={{ color: 'var(--color-fog)' }}>✕</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rewards / Notes */}
      <div className="rounded-lg p-4" style={panelStyle}>
        <h3 className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--color-gold)' }}>
          Rewards & Notes
        </h3>
        {readOnly ? (
          <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--color-pale)' }}>
            {character.rewards || 'None.'}
          </p>
        ) : (
          <Textarea
            value={character.rewards}
            onChange={onRewardsChange}
            rows={4}
            placeholder="Stormlight stored, boons, story rewards…"
          />
        )}
      </div>
    </div>
  )
}
