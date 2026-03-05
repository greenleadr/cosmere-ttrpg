import type { AttributeKey } from '@/types/character'

export interface SkillDefinition {
  id: string
  name: string
  governingAttribute: AttributeKey
  category: 'physical' | 'cognitive' | 'spiritual' | 'surge'
  isSurge: boolean
  /** Radiant path that unlocks this surge skill, if applicable */
  unlockPath?: string
  ruleTooltip: string
}

export const SKILLS: SkillDefinition[] = [
  // Physical
  { id: 'agility',        name: 'Agility',        governingAttribute: 'spd', category: 'physical', isSurge: false, ruleTooltip: 'Used for acrobatics, dodging, and feats of nimbleness. Governed by Speed.' },
  { id: 'athletics',      name: 'Athletics',      governingAttribute: 'str', category: 'physical', isSurge: false, ruleTooltip: 'Used for climbing, jumping, swimming, and feats of raw strength. Governed by Strength.' },
  { id: 'heavy-weaponry', name: 'Heavy Weaponry',  governingAttribute: 'str', category: 'physical', isSurge: false, ruleTooltip: 'Used to attack with heavy melee weapons. Governed by Strength.' },
  { id: 'light-weaponry', name: 'Light Weaponry',  governingAttribute: 'spd', category: 'physical', isSurge: false, ruleTooltip: 'Used to attack with light melee weapons and ranged weapons. Governed by Speed.' },
  { id: 'stealth',        name: 'Stealth',        governingAttribute: 'spd', category: 'physical', isSurge: false, ruleTooltip: 'Used to move without being detected. Governed by Speed.' },
  { id: 'thievery',       name: 'Thievery',       governingAttribute: 'spd', category: 'physical', isSurge: false, ruleTooltip: 'Used for pickpocketing, sleight of hand, and lockpicking. Governed by Speed.' },

  // Cognitive
  { id: 'crafting',       name: 'Crafting',       governingAttribute: 'int', category: 'cognitive', isSurge: false, ruleTooltip: 'Used to create or repair objects. Governed by Intellect.' },
  { id: 'deduction',      name: 'Deduction',      governingAttribute: 'int', category: 'cognitive', isSurge: false, ruleTooltip: 'Used to analyse clues and reach logical conclusions. Governed by Intellect.' },
  { id: 'discipline',     name: 'Discipline',     governingAttribute: 'wil', category: 'cognitive', isSurge: false, ruleTooltip: 'Used to resist mental effects and maintain focus under pressure. Governed by Willpower.' },
  { id: 'intimidation',   name: 'Intimidation',   governingAttribute: 'wil', category: 'cognitive', isSurge: false, ruleTooltip: 'Used to frighten or coerce others through force of personality. Governed by Willpower.' },
  { id: 'lore',           name: 'Lore',           governingAttribute: 'int', category: 'cognitive', isSurge: false, ruleTooltip: 'Used to recall knowledge about history, culture, and subjects of expertise. Governed by Intellect.' },
  { id: 'medicine',       name: 'Medicine',       governingAttribute: 'int', category: 'cognitive', isSurge: false, ruleTooltip: 'Used to treat injuries and illness. Governed by Intellect.' },

  // Spiritual
  { id: 'deception',      name: 'Deception',      governingAttribute: 'pre', category: 'spiritual', isSurge: false, ruleTooltip: 'Used to lie, bluff, or mislead others. Governed by Presence.' },
  { id: 'insight',        name: 'Insight',        governingAttribute: 'awa', category: 'spiritual', isSurge: false, ruleTooltip: 'Used to read emotions and detect when someone is being dishonest. Governed by Awareness.' },
  { id: 'leadership',     name: 'Leadership',     governingAttribute: 'pre', category: 'spiritual', isSurge: false, ruleTooltip: 'Used to inspire allies and coordinate group action. Governed by Presence.' },
  { id: 'perception',     name: 'Perception',     governingAttribute: 'awa', category: 'spiritual', isSurge: false, ruleTooltip: 'Used to notice hidden details and detect threats. Governed by Awareness.' },
  { id: 'persuasion',     name: 'Persuasion',     governingAttribute: 'pre', category: 'spiritual', isSurge: false, ruleTooltip: 'Used to convince others through reasoned argument or charm. Governed by Presence.' },
  { id: 'survival',       name: 'Survival',       governingAttribute: 'awa', category: 'spiritual', isSurge: false, ruleTooltip: 'Used to navigate wilderness, track creatures, and find shelter. Governed by Awareness.' },

  // Surge skills (hidden until unlocked by Radiant path)
  { id: 'surge-abrasion',       name: 'Abrasion',       governingAttribute: 'awa', category: 'surge', isSurge: true, unlockPath: "Willshapers",    ruleTooltip: 'Surge of Abrasion: manipulate friction on surfaces. Governed by Awareness.' },
  { id: 'surge-adhesion',       name: 'Adhesion',       governingAttribute: 'pre', category: 'surge', isSurge: true, unlockPath: "Windrunners",     ruleTooltip: 'Surge of Adhesion: bind objects together with Stormlight. Governed by Presence.' },
  { id: 'surge-cohesion',       name: 'Cohesion',       governingAttribute: 'wil', category: 'surge', isSurge: true, unlockPath: "Stonewards",      ruleTooltip: 'Surge of Cohesion: alter the shape of stone and other materials. Governed by Willpower.' },
  { id: 'surge-division',       name: 'Division',       governingAttribute: 'str', category: 'surge', isSurge: true, unlockPath: "Dustbringers",    ruleTooltip: 'Surge of Division: break down and destroy matter. Governed by Strength.' },
  { id: 'surge-gravitation',    name: 'Gravitation',    governingAttribute: 'spd', category: 'surge', isSurge: true, unlockPath: "Windrunners",     ruleTooltip: 'Surge of Gravitation: alter gravity. Governed by Speed.' },
  { id: 'surge-illumination',   name: 'Illumination',   governingAttribute: 'int', category: 'surge', isSurge: true, unlockPath: "Lightweavers",    ruleTooltip: 'Surge of Illumination: create illusions of light and sound. Governed by Intellect.' },
  { id: 'surge-progression',    name: 'Progression',    governingAttribute: 'awa', category: 'surge', isSurge: true, unlockPath: "Edgedancers",     ruleTooltip: 'Surge of Progression: accelerate or reverse natural growth. Governed by Awareness.' },
  { id: 'surge-tension',        name: 'Tension',        governingAttribute: 'str', category: 'surge', isSurge: true, unlockPath: "Stonewards",      ruleTooltip: 'Surge of Tension: alter the flexibility of materials. Governed by Strength.' },
  { id: 'surge-transformation', name: 'Transformation', governingAttribute: 'int', category: 'surge', isSurge: true, unlockPath: "Elsecallers",     ruleTooltip: 'Surge of Transformation: change the nature of matter. Governed by Intellect.' },
  { id: 'surge-transportation', name: 'Transportation', governingAttribute: 'spd', category: 'surge', isSurge: true, unlockPath: "Willshapers",    ruleTooltip: 'Surge of Transportation: move through Shadesmar or teleport. Governed by Speed.' },
]

export const STANDARD_SKILLS = SKILLS.filter(s => !s.isSurge)
export const SURGE_SKILLS = SKILLS.filter(s => s.isSurge)

export function getSkillById(id: string): SkillDefinition | undefined {
  return SKILLS.find(s => s.id === id)
}

/** Max rank cap by tier (1-indexed, tier = Math.ceil(level / 5)) */
export const SKILL_RANK_CAP_BY_TIER: Record<number, number> = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 5,
}

export function getSkillRankCap(level: number): number {
  const tier = Math.min(5, Math.ceil(level / 5))
  return SKILL_RANK_CAP_BY_TIER[tier] ?? 5
}
