export interface Attributes {
  str: number
  spd: number
  int: number
  wil: number
  awa: number
  pre: number
}

export type AttributeKey = keyof Attributes

export interface SkillEntry {
  skillId: string
  ranks: number
}

export interface ActiveCondition {
  conditionId: string
  stacks?: number       // only used for Exhausted
  durationNote?: string
}

export interface InjuryEntry {
  id: string
  description: string
  durationCategory: 'death' | 'permanent' | 'vicious' | 'shallow' | 'flesh-wound'
  daysRemaining?: number
  mechanicalEffect: string
  isPermanent: boolean
  createdAt: number
}

export interface ExpertiseEntry {
  id: string
  text: string
  note: string
}

export interface TalentEntry {
  id: string
  name: string
  source: string        // path/specialty name or 'ancestry' / 'custom'
  activationType: 'action' | 'reaction' | 'free-action' | 'always-active' | 'special'
  prerequisites: string
  description: string
}

export interface WeaponEntry {
  id: string
  name: string
  bonus: number
  damageType: string
  damageDice: string    // e.g. "2d6"
  special: string
}

export interface ArmourEntry {
  id: string
  name: string
  deflectBonus: number
  weight: string
  isEquipped: boolean
}

export interface EquipmentEntry {
  id: string
  name: string
  quantity: number
  weight: string
  price: string
}

export interface GoalEntry {
  id: string
  purpose: string
  obstacle: string
  note: string
}

export interface ConnectionEntry {
  id: string
  name: string
  relationship: string
  status: string
}

export interface LevelHistoryEntry {
  level: number
  attributeIncreased?: AttributeKey
  skillRanksAllocated: { skillId: string; added: number }[]
  talentAdded?: string
  ancestryBonusTalent?: string
  healthGained: number
}

export interface Character {
  id: string
  schemaVersion: number

  // Identity
  name: string
  playerName: string
  level: number
  ancestry: 'Human' | 'Singer'
  cultures: string[]
  heroicPaths: string[]
  radiantPath: string | null
  isRadiant: boolean
  occupation: string
  appearanceNotes: string

  // Core stats
  attributes: Attributes
  skills: SkillEntry[]
  expertises: ExpertiseEntry[]
  talents: TalentEntry[]
  weapons: WeaponEntry[]
  armour: ArmourEntry[]
  equipment: EquipmentEntry[]
  currency: { broams: number; marks: number; chips: number }

  // Manual overrides for defense bonuses (from talents/conditions not auto-tracked)
  defenseOverrides: {
    physicalBonus: number
    cognitiveBonus: number
    spiritualBonus: number
  }

  // Manual investiture max override (Radiant-path-specific formula)
  investitureMax: number
  // Talent bonus to Focus max
  focusBonus: number

  // Current resources
  resources: {
    healthCurrent: number
    focusCurrent: number
    investitureCurrent: number
  }

  // Conditions and injuries
  activeConditions: ActiveCondition[]
  injuries: InjuryEntry[]

  // Singer-specific
  activeSingerForm: string | null

  // Narrative
  goals: GoalEntry[]
  connections: ConnectionEntry[]
  rewards: string

  // History
  levelHistory: LevelHistoryEntry[]

  // Metadata
  createdAt: number
  updatedAt: number
}

export interface DerivedStats {
  effectiveAttributes: Attributes   // after singer form modifiers
  physicalDefense: number
  cognitiveDefense: number
  spiritualDefense: number
  maxHealth: number
  maxFocus: number
  maxInvestiture: number
  deflect: number
  movement: number                  // feet per action
  recoveryDie: string               // 'd4', 'd6', etc.
  sensesRange: number               // feet
  liftingCapacity: number           // pounds
  skills: Record<string, SkillDerivedEntry>
}

export interface SkillDerivedEntry {
  total: number
  ranks: number
  attributeBonus: number
}
