import type { Character, AttributeKey } from '@/types/character'
import { getAdvancementRow } from '@/constants/advancement'
import { getSkillRankCap } from '@/constants/skills'

export interface LevelUpChoices {
  /** Which attribute to increase (only on levels 3/6/9/12/15/18) */
  attributeIncrease?: AttributeKey
  /** Skill rank allocations: skillId → number of ranks to add */
  skillRanks: Record<string, number>
  /** Talent name/description (free text for v1) */
  talentName?: string
  talentDescription?: string
  talentSource?: string
  talentActivationType?: string
  /** Ancestry bonus talent (only on tier start levels) */
  ancestryBonusTalentName?: string
  ancestryBonusTalentDescription?: string
  /** At level 21+, player picks talent OR rank — 'talent' or 'rank' */
  choiceMode?: 'talent' | 'rank'
}

export interface LevelUpValidationResult {
  valid: boolean
  errors: string[]
}

export function validateLevelUpChoices(
  character: Character,
  choices: LevelUpChoices,
): LevelUpValidationResult {
  const errors: string[] = []
  const nextLevel = character.level + 1
  const advancement = getAdvancementRow(nextLevel)
  const rankCap = getSkillRankCap(nextLevel)

  // Attribute increase required?
  if (advancement.attributeIncrease && !choices.attributeIncrease) {
    errors.push('You must choose an attribute to increase.')
  }

  // Skill rank budget
  const totalRanksAllocated = Object.values(choices.skillRanks).reduce((s, n) => s + n, 0)
  const budget = advancement.skillRanksGained
  if (totalRanksAllocated > budget) {
    errors.push(`You can only allocate ${budget} skill rank(s) at this level.`)
  }

  // Rank cap
  for (const [skillId, added] of Object.entries(choices.skillRanks)) {
    const current = character.skills.find(s => s.skillId === skillId)?.ranks ?? 0
    if (current + added > rankCap) {
      errors.push(`Skill "${skillId}" would exceed the tier rank cap of ${rankCap}.`)
    }
    if (added < 0) {
      errors.push(`Cannot remove skill ranks via level-up.`)
    }
  }

  return { valid: errors.length === 0, errors }
}

export function applyLevelUp(character: Character, choices: LevelUpChoices): Character {
  const nextLevel = character.level + 1
  const advancement = getAdvancementRow(nextLevel)

  // Deep-clone (simple JSON approach — safe for our plain data)
  const updated: Character = JSON.parse(JSON.stringify(character)) as Character

  updated.level = nextLevel

  // Attribute increase
  if (advancement.attributeIncrease && choices.attributeIncrease) {
    updated.attributes[choices.attributeIncrease] =
      updated.attributes[choices.attributeIncrease] + 1
  }

  // Skill ranks
  for (const [skillId, added] of Object.entries(choices.skillRanks)) {
    if (added <= 0) continue
    const existing = updated.skills.find(s => s.skillId === skillId)
    if (existing) {
      existing.ranks += added
    } else {
      updated.skills.push({ skillId, ranks: added })
    }
  }

  // Talent
  if (choices.talentName) {
    updated.talents.push({
      id: `talent-${Date.now()}`,
      name: choices.talentName,
      source: choices.talentSource ?? 'level',
      activationType: (choices.talentActivationType ?? 'always-active') as
        'action' | 'reaction' | 'free-action' | 'always-active' | 'special',
      prerequisites: '',
      description: choices.talentDescription ?? '',
    })
  }

  // Ancestry bonus talent
  if (advancement.ancestryBonusTalent && choices.ancestryBonusTalentName) {
    updated.talents.push({
      id: `talent-ancestry-${Date.now()}`,
      name: choices.ancestryBonusTalentName,
      source: 'ancestry',
      activationType: 'always-active',
      prerequisites: '',
      description: choices.ancestryBonusTalentDescription ?? '',
    })
  }

  // Update health current to reflect new max (top up if previously at max)
  const oldMaxHealth = 10 + character.attributes.str +
    Array.from({ length: character.level - 1 }, (_, i) => healthGainForLevel(i + 2))
      .reduce((a, b) => a + b, 0)
  const wasAtMax = updated.resources.healthCurrent >= oldMaxHealth
  if (wasAtMax) {
    updated.resources.healthCurrent = updated.resources.healthCurrent + advancement.healthGain
  }

  // Log the level-up
  updated.levelHistory.push({
    level: nextLevel,
    attributeIncreased: choices.attributeIncrease,
    skillRanksAllocated: Object.entries(choices.skillRanks)
      .filter(([, v]) => v > 0)
      .map(([skillId, added]) => ({ skillId, added })),
    talentAdded: choices.talentName,
    ancestryBonusTalent: choices.ancestryBonusTalentName,
    healthGained: advancement.healthGain,
  })

  updated.updatedAt = Date.now()
  return updated
}

function healthGainForLevel(level: number): number {
  if (level <= 5)  return 5
  if (level <= 10) return 4
  if (level <= 15) return 3
  if (level <= 20) return 2
  return 1
}
