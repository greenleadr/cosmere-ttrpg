import { useState } from 'react'
import type { SessionNote } from '@/types/campaign'
import { Button } from '@/components/ui/Button'

interface SessionNotesProps {
  notes: SessionNote[]
  currentSessionNumber: number
  onAdd: (content: string) => void
  onUpdate: (id: string, content: string) => void
  onRemove: (id: string) => void
}

export function SessionNotes({
  notes,
  currentSessionNumber,
  onAdd,
  onUpdate,
  onRemove,
}: SessionNotesProps) {
  const [draft, setDraft] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editContent, setEditContent] = useState('')

  function handleAdd() {
    if (!draft.trim()) return
    onAdd(draft.trim())
    setDraft('')
  }

  function handleEditStart(note: SessionNote) {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  function handleEditSave(id: string) {
    if (editContent.trim()) onUpdate(id, editContent.trim())
    setEditingId(null)
  }

  const grouped = notes.reduce<Record<number, SessionNote[]>>((acc, note) => {
    const sess = note.sessionNumber
    if (!acc[sess]) acc[sess] = []
    acc[sess]!.push(note)
    return acc
  }, {})

  const sortedSessions = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="flex flex-col gap-4">
      {/* Add note */}
      <div
        className="rounded-lg p-4"
        style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
      >
        <h3
          className="text-sm font-semibold uppercase tracking-widest mb-3"
          style={{ color: 'var(--color-gold)' }}
        >
          Session Notes — Session {currentSessionNumber}
        </h3>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          rows={3}
          placeholder="Record what happened this session…"
          className="w-full text-sm rounded px-2.5 py-1.5 mb-2 resize-y"
          style={{
            background: 'var(--color-storm)',
            border: '1px solid var(--color-storm-light)',
            color: 'var(--color-pale)',
            outline: 'none',
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' && e.metaKey) handleAdd()
          }}
        />
        <Button variant="primary" size="sm" onClick={handleAdd}>
          Add Note
        </Button>
      </div>

      {/* Notes list grouped by session */}
      {sortedSessions.map(sessionNum => (
        <div key={sessionNum}>
          <div
            className="text-xs font-bold uppercase tracking-widest mb-2 px-1"
            style={{ color: 'var(--color-storm-light)' }}
          >
            Session {sessionNum}
          </div>
          <div className="flex flex-col gap-2">
            {grouped[sessionNum]!
              .sort((a, b) => b.timestamp - a.timestamp)
              .map(note => (
                <div
                  key={note.id}
                  className="rounded-lg p-3"
                  style={{
                    background: 'var(--color-deep-storm)',
                    border: '1px solid var(--color-storm-mid)',
                  }}
                >
                  {editingId === note.id ? (
                    <div className="flex flex-col gap-2">
                      <textarea
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        rows={3}
                        className="w-full text-sm rounded px-2 py-1 resize-y"
                        style={{
                          background: 'var(--color-storm)',
                          border: '1px solid var(--color-stormlight)',
                          color: 'var(--color-pale)',
                          outline: 'none',
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button variant="primary" size="sm" onClick={() => handleEditSave(note.id)}>
                          Save
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className="text-sm whitespace-pre-wrap flex-1"
                        style={{ color: 'var(--color-pale)' }}
                      >
                        {note.content}
                      </p>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span className="text-xs" style={{ color: 'var(--color-storm-light)' }}>
                          {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div className="flex gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditStart(note)}
                            className="text-xs hover:opacity-70"
                            style={{ color: 'var(--color-fog)' }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onRemove(note.id)}
                            className="text-xs hover:opacity-70"
                            style={{ color: 'var(--color-fog)' }}
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}

      {notes.length === 0 && (
        <p className="text-sm text-center py-4" style={{ color: 'var(--color-fog)' }}>
          No notes yet. Record your first session note above.
        </p>
      )}
    </div>
  )
}
