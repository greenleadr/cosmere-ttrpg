import type { ActiveCondition } from './character'

export type TurnPhase = 'fast-pc' | 'fast-npc' | 'slow-pc' | 'slow-npc'

export interface CombatantSlot {
  id: string
  characterRef: string | null      // character ID (PCs)
  adversaryRef: string | null      // adversary instance ID (NPCs)
  displayName: string
  isFast: boolean
  isPC: boolean
  hpCurrent: number
  hpMax: number
  focusCurrent: number
  focusMax: number
  conditions: ActiveCondition[]
  hasActed: boolean
  isSurprised: boolean
}

export interface Encounter {
  id: string
  schemaVersion: number
  campaignId: string
  name: string
  roundNumber: number
  currentPhase: TurnPhase
  currentCombatantIndex: number
  combatants: CombatantSlot[]
  isActive: boolean
  createdAt: number
}
