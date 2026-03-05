import type { AttributeKey } from '@/types/character'

export interface AttributeDefinition {
  key: AttributeKey
  name: string
  abbr: string
  category: 'physical' | 'cognitive' | 'spiritual'
  primaryEffect: string
  ruleTooltip: string
}

export const ATTRIBUTES: AttributeDefinition[] = [
  {
    key: 'str',
    name: 'Strength',
    abbr: 'STR',
    category: 'physical',
    primaryEffect: 'Physical Defense, base Health, Lifting Capacity',
    ruleTooltip:
      'Contributes to Physical Defense (10 + STR + SPD) and base Health (10 + STR). Also determines Lifting Capacity.',
  },
  {
    key: 'spd',
    name: 'Speed',
    abbr: 'SPD',
    category: 'physical',
    primaryEffect: 'Physical Defense, Movement Rate',
    ruleTooltip:
      'Contributes to Physical Defense (10 + STR + SPD) and determines Movement Rate (feet per action).',
  },
  {
    key: 'int',
    name: 'Intellect',
    abbr: 'INT',
    category: 'cognitive',
    primaryEffect: 'Cognitive Defense, bonus Expertises',
    ruleTooltip:
      'Contributes to Cognitive Defense (10 + INT + WIL). You gain bonus Expertises equal to your INT score.',
  },
  {
    key: 'wil',
    name: 'Willpower',
    abbr: 'WIL',
    category: 'cognitive',
    primaryEffect: 'Cognitive Defense, max Focus, Recovery Die',
    ruleTooltip:
      'Contributes to Cognitive Defense (10 + INT + WIL). Maximum Focus = 2 × WIL. Recovery Die size is determined by WIL.',
  },
  {
    key: 'awa',
    name: 'Awareness',
    abbr: 'AWA',
    category: 'spiritual',
    primaryEffect: 'Spiritual Defense, Senses Range',
    ruleTooltip:
      'Contributes to Spiritual Defense (10 + AWA + PRE). Determines Senses Range when primary sense is obscured.',
  },
  {
    key: 'pre',
    name: 'Presence',
    abbr: 'PRE',
    category: 'spiritual',
    primaryEffect: 'Spiritual Defense, Investiture (Radiant)',
    ruleTooltip:
      'Contributes to Spiritual Defense (10 + AWA + PRE). Also contributes to Investiture maximum on some Radiant paths.',
  },
]

export const ATTRIBUTE_KEYS: AttributeKey[] = ['str', 'spd', 'int', 'wil', 'awa', 'pre']

export const CREATION_POINT_BUDGET = 12
export const CREATION_MAX_PER_ATTRIBUTE = 3
export const ATTRIBUTE_MAX = 5
export const ATTRIBUTE_MIN = 0

export const ATTRIBUTE_INCREASE_LEVELS = [3, 6, 9, 12, 15, 18]
