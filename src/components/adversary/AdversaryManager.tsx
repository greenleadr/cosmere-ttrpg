import { useState } from 'react'
import { useAdversaryStore } from '@/store/adversaryStore'
import { StatBlockCard } from './StatBlockCard'
import { StatBlockEditor } from './StatBlockEditor'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { AdversaryRole } from '@/types/adversary'

type Filter = 'all' | AdversaryRole

export function AdversaryManager() {
  const { templates, addTemplate, updateTemplate, removeTemplate } = useAdversaryStore()
  const [filter, setFilter] = useState<Filter>('all')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | 'new' | null>(null)

  const list = Object.values(templates).filter(t => {
    if (filter !== 'all' && t.role !== filter) return false
    if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const editingTemplate = editingId && editingId !== 'new' ? templates[editingId] : undefined

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: 'var(--color-void)', color: 'var(--color-pale)' }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ background: 'var(--color-deep-storm)', borderBottom: '1px solid var(--color-storm-mid)' }}
      >
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-gold-bright)' }}>
            Adversaries
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-fog)' }}>
            {Object.keys(templates).length} template{Object.keys(templates).length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setEditingId('new')}>
          + New Adversary
        </Button>
      </div>

      {/* Filters */}
      <div
        className="px-4 py-2 flex items-center gap-3"
        style={{ borderBottom: '1px solid var(--color-storm-mid)' }}
      >
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search…"
          className="text-sm rounded px-2.5 py-1 flex-1"
          style={{
            background: 'var(--color-storm)',
            border: '1px solid var(--color-storm-light)',
            color: 'var(--color-pale)',
            outline: 'none',
            maxWidth: 220,
          }}
        />
        <div className="flex gap-1">
          {(['all', 'Minion', 'Rival', 'Boss'] as Filter[]).map(f => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className="text-xs px-2.5 py-1 rounded capitalize"
              style={{
                background: filter === f ? 'var(--color-stormlight)' : 'var(--color-storm)',
                border: `1px solid ${filter === f ? 'var(--color-stormlight)' : 'var(--color-storm-light)'}`,
                color: filter === f ? '#fff' : 'var(--color-fog)',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4">
        {list.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-sm mb-4" style={{ color: 'var(--color-fog)' }}>
              {Object.keys(templates).length === 0
                ? 'No adversary templates yet.'
                : 'No results for this filter.'}
            </p>
            {Object.keys(templates).length === 0 && (
              <Button variant="primary" onClick={() => setEditingId('new')}>
                Create First Adversary
              </Button>
            )}
          </div>
        ) : (
          <div
            className="grid gap-4"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}
          >
            {list.map(template => (
              <StatBlockCard
                key={template.id}
                template={template}
                onEdit={() => setEditingId(template.id)}
                onDelete={() => {
                  if (window.confirm(`Delete "${template.name}"?`)) removeTemplate(template.id)
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        open={editingId !== null}
        onClose={() => setEditingId(null)}
        title={editingId === 'new' ? 'New Adversary' : `Edit: ${editingTemplate?.name ?? ''}`}
        width="720px"
      >
        <div className="overflow-y-auto" style={{ maxHeight: '85vh' }}>
          {editingId !== null && (
            <StatBlockEditor
              initial={editingTemplate}
              onSave={draft => {
                if (editingId === 'new') {
                  addTemplate(draft)
                } else {
                  updateTemplate(editingId, draft)
                }
                setEditingId(null)
              }}
              onCancel={() => setEditingId(null)}
            />
          )}
        </div>
      </Modal>
    </div>
  )
}
