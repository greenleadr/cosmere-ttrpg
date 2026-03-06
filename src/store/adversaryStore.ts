import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { nanoid } from 'nanoid'
import type { AdversaryTemplate, AdversaryInstance } from '@/types/adversary'
import type { ActiveCondition } from '@/types/character'

interface AdversaryState {
  templates: Record<string, AdversaryTemplate>
  instances: Record<string, AdversaryInstance>

  // Template CRUD
  addTemplate: (template: Omit<AdversaryTemplate, 'id' | 'schemaVersion' | 'createdAt' | 'updatedAt'>) => string
  updateTemplate: (id: string, updates: Partial<AdversaryTemplate>) => void
  removeTemplate: (id: string) => void

  // Instantiation (for encounters)
  createInstance: (templateId: string, displayName?: string) => string
  removeInstance: (id: string) => void
  setInstanceHP: (id: string, hp: number) => void
  setInstanceFocus: (id: string, focus: number) => void
  addInstanceCondition: (id: string, condition: ActiveCondition) => void
  removeInstanceCondition: (id: string, conditionId: string) => void
  clearInstances: () => void

  hydrate: (templates: AdversaryTemplate[]) => void
}

export const useAdversaryStore = create<AdversaryState>()(
  immer((set) => ({
    templates: {},
    instances: {},

    addTemplate: (template) => {
      const now = Date.now()
      const id = nanoid(10)
      set(state => {
        state.templates[id] = {
          ...template,
          id,
          schemaVersion: 1,
          createdAt: now,
          updatedAt: now,
        }
      })
      return id
    },

    updateTemplate: (id, updates) => set(state => {
      const t = state.templates[id]
      if (!t) return
      Object.assign(t, updates)
      t.updatedAt = Date.now()
    }),

    removeTemplate: (id) => set(state => {
      delete state.templates[id]
    }),

    createInstance: (templateId, displayName) => {
      const template = useAdversaryStore.getState().templates[templateId]
      if (!template) throw new Error(`Template ${templateId} not found`)
      const id = nanoid(8)
      const name = displayName ?? template.name
      set(state => {
        state.instances[id] = {
          id,
          templateId,
          displayName: name,
          hpCurrent: template.health,
          hpMax: template.health,
          focusCurrent: template.focus,
          conditions: [],
        }
      })
      return id
    },

    removeInstance: (id) => set(state => {
      delete state.instances[id]
    }),

    setInstanceHP: (id, hp) => set(state => {
      const inst = state.instances[id]
      if (!inst) return
      inst.hpCurrent = Math.max(0, Math.min(hp, inst.hpMax))
    }),

    setInstanceFocus: (id, focus) => set(state => {
      const inst = state.instances[id]
      if (!inst) return
      const template = useAdversaryStore.getState().templates[inst.templateId]
      inst.focusCurrent = Math.max(0, Math.min(focus, template?.focus ?? focus))
    }),

    addInstanceCondition: (id, condition) => set(state => {
      const inst = state.instances[id]
      if (!inst) return
      const exists = inst.conditions.find(c => c.conditionId === condition.conditionId)
      if (!exists) inst.conditions.push(condition)
    }),

    removeInstanceCondition: (id, conditionId) => set(state => {
      const inst = state.instances[id]
      if (!inst) return
      inst.conditions = inst.conditions.filter(c => c.conditionId !== conditionId)
    }),

    clearInstances: () => set(state => {
      state.instances = {}
    }),

    hydrate: (templates) => set(state => {
      for (const t of templates) {
        state.templates[t.id] = t
      }
    }),
  })),
)
