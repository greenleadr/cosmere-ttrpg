/**
 * Character Advancement table from the Stormlight Handbook.
 * Each entry describes what a character gains at that level.
 */

export type Tier = 1 | 2 | 3 | 4 | 5

export interface AdvancementRow {
  level: number
  tier: Tier
  healthGain: number
  skillRanksGained: number
  talentsGained: number
  /** True if this level grants an attribute point increase */
  attributeIncrease: boolean
  /** True if this level grants an ancestry bonus talent */
  ancestryBonusTalent: boolean
  /** At level 21+: player chooses 1 talent OR 1 skill rank instead of both */
  talentOrRankChoice: boolean
  skillRankCap: number
}

const TIER_HEALTH_GAINS: Record<Tier, number> = {
  1: 5,
  2: 4,
  3: 3,
  4: 2,
  5: 1,
}

function tierFor(level: number): Tier {
  if (level <= 5)  return 1
  if (level <= 10) return 2
  if (level <= 15) return 3
  if (level <= 20) return 4
  return 5
}

const SKILL_RANK_CAP: Record<Tier, number> = { 1: 2, 2: 3, 3: 4, 4: 5, 5: 5 }
const ATTRIBUTE_INCREASE_LEVELS = new Set([3, 6, 9, 12, 15, 18])
const ANCESTRY_BONUS_TALENT_LEVELS = new Set([1, 6, 11, 16, 21])

function buildTable(): AdvancementRow[] {
  const rows: AdvancementRow[] = []
  for (let level = 1; level <= 25; level++) {
    const tier = tierFor(level)
    rows.push({
      level,
      tier,
      healthGain: TIER_HEALTH_GAINS[tier],
      skillRanksGained: level <= 20 ? 2 : 1,
      talentsGained: level <= 20 ? 1 : 0,
      attributeIncrease: ATTRIBUTE_INCREASE_LEVELS.has(level),
      ancestryBonusTalent: ANCESTRY_BONUS_TALENT_LEVELS.has(level),
      talentOrRankChoice: level >= 21,
      skillRankCap: SKILL_RANK_CAP[tier],
    })
  }
  return rows
}

export const ADVANCEMENT_TABLE = buildTable()

export function getAdvancementRow(level: number): AdvancementRow {
  return (
    ADVANCEMENT_TABLE.find(r => r.level === level) ??
    // beyond level 25 — use tier 5 values
    {
      level,
      tier: 5,
      healthGain: 1,
      skillRanksGained: 1,
      talentsGained: 0,
      attributeIncrease: false,
      ancestryBonusTalent: false,
      talentOrRankChoice: true,
      skillRankCap: 5,
    }
  )
}

/** Cumulative health gained from levelling 1 → targetLevel */
export function cumulativeHealthGain(strAtLevel1: number, targetLevel: number): number {
  let total = 10 + strAtLevel1
  for (let lvl = 2; lvl <= targetLevel; lvl++) {
    total += getAdvancementRow(lvl).healthGain
  }
  return total
}
