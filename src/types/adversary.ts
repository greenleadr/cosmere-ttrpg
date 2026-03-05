import type { ActiveCondition, Attributes } from './character'

export type AdversaryRole = 'Minion' | 'Rival' | 'Boss'

export interface AdversaryAbility {
  id: string
  name: string
  type: 'passive' | 'action' | 'reaction'
  description: string
  cost?: string
}

export interface AdversaryTemplate {
  id: string
  schemaVersion: number
  name: string
  role: AdversaryRole
  tier: number
  attributes: Attributes
  defenses: { physical: number; cognitive: number; spiritual: number }
  health: number
  focus: number
  investiture: number
  deflect: number
  movement: number
  senses: string
  skills: Record<string, number>
  abilities: AdversaryAbility[]
  description: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

export interface AdversaryInstance {
  id: string
  templateId: string
  displayName: string
  hpCurrent: number
  hpMax: number
  focusCurrent: number
  conditions: ActiveCondition[]
}
