import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { nanoid } from 'nanoid'
import type { Encounter, CombatantSlot, TurnPhase } from '@/types/combat'
import type { ActiveCondition } from '@/types/character'
import { advanceTurn, startNewRound } from '@/engine/combatEngine'

interface CombatState {
  encounter: Encounter | null

  startEncounter: (campaignId: string, name: string, combatants: Omit<CombatantSlot, 'id' | 'hasActed'>[]) => void
  endEncounter: () => void

  advanceTurn: () => void
  startNewRound: () => void

  setCombatantHP: (slotId: string, hp: number) => void
  setCombatantFocus: (slotId: string, focus: number) => void
  toggleCombatantFast: (slotId: string) => void
  toggleCombatantActed: (slotId: string) => void
  addCombatantCondition: (slotId: string, condition: ActiveCondition) => void
  removeCombatantCondition: (slotId: string, conditionId: string) => void
  addCombatant: (combatant: Omit<CombatantSlot, 'id' | 'hasActed'>) => void
  removeCombatant: (slotId: string) => void

  setCurrentPhase: (phase: TurnPhase) => void

  hydrate: (encounter: Encounter) => void
}

export const useCombatStore = create<CombatState>()(
  immer((set) => ({
    encounter: null,

    startEncounter: (campaignId, name, combatants) => set(state => {
      state.encounter = {
        id: nanoid(10),
        schemaVersion: 1,
        campaignId,
        name,
        roundNumber: 1,
        currentPhase: 'fast-pc',
        currentCombatantIndex: 0,
        isActive: true,
        createdAt: Date.now(),
        combatants: combatants.map(c => ({ ...c, id: nanoid(8), hasActed: false })),
      }
    }),

    endEncounter: () => set(state => {
      if (state.encounter) state.encounter.isActive = false
      state.encounter = null
    }),

    advanceTurn: () => set(state => {
      if (!state.encounter) return
      state.encounter = advanceTurn(state.encounter) as typeof state.encounter
    }),

    startNewRound: () => set(state => {
      if (!state.encounter) return
      state.encounter = startNewRound(state.encounter) as typeof state.encounter
    }),

    setCombatantHP: (slotId, hp) => set(state => {
      if (!state.encounter) return
      const slot = state.encounter.combatants.find(c => c.id === slotId)
      if (slot) slot.hpCurrent = Math.max(0, Math.min(hp, slot.hpMax))
    }),

    setCombatantFocus: (slotId, focus) => set(state => {
      if (!state.encounter) return
      const slot = state.encounter.combatants.find(c => c.id === slotId)
      if (slot) slot.focusCurrent = Math.max(0, Math.min(focus, slot.focusMax))
    }),

    toggleCombatantFast: (slotId) => set(state => {
      if (!state.encounter) return
      const slot = state.encounter.combatants.find(c => c.id === slotId)
      if (slot) slot.isFast = !slot.isFast
    }),

    toggleCombatantActed: (slotId) => set(state => {
      if (!state.encounter) return
      const slot = state.encounter.combatants.find(c => c.id === slotId)
      if (slot) slot.hasActed = !slot.hasActed
    }),

    addCombatantCondition: (slotId, condition) => set(state => {
      if (!state.encounter) return
      const slot = state.encounter.combatants.find(c => c.id === slotId)
      if (!slot) return
      const exists = slot.conditions.find(c => c.conditionId === condition.conditionId)
      if (!exists) slot.conditions.push(condition)
    }),

    removeCombatantCondition: (slotId, conditionId) => set(state => {
      if (!state.encounter) return
      const slot = state.encounter.combatants.find(c => c.id === slotId)
      if (slot) slot.conditions = slot.conditions.filter(c => c.conditionId !== conditionId)
    }),

    addCombatant: (combatant) => set(state => {
      if (!state.encounter) return
      state.encounter.combatants.push({ ...combatant, id: nanoid(8), hasActed: false })
    }),

    removeCombatant: (slotId) => set(state => {
      if (!state.encounter) return
      state.encounter.combatants = state.encounter.combatants.filter(c => c.id !== slotId)
    }),

    setCurrentPhase: (phase) => set(state => {
      if (!state.encounter) return
      state.encounter.currentPhase = phase
    }),

    hydrate: (encounter) => set(state => {
      state.encounter = encounter
    }),
  })),
)
