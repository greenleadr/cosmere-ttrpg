import type { Character, DerivedStats, Attributes, SkillDerivedEntry } from '@/types/character'
import { SKILLS } from '@/constants/skills'
import {
  getMovementRate,
  getRecoveryDie,
  getSensesRange,
  getLiftingCapacity,
} from '@/constants/lookupTables'
import { applyActiveSingerForm, getSingerFormDeflectBonus } from './singerEngine'

/**
 * Compute all derived statistics from a Character record.
 * This is a pure function — no side effects, no React dependencies.
 * Call it via useDerivedStats for memoized rendering.
 */
export function computeDerivedStats(character: Character): DerivedStats {
  // Step 1: apply singer form modifiers (or identity if not a singer / no active form)
  const effectiveAttributes: Attributes = applyActiveSingerForm(
    character.attributes,
    character.ancestry === 'Singer' ? character.activeSingerForm : null,
  )

  // Step 2: defenses = 10 + two governing attributes + manual overrides
  const physicalDefense =
    10 +
    effectiveAttributes.str +
    effectiveAttributes.spd +
    character.defenseOverrides.physicalBonus

  const cognitiveDefense =
    10 +
    effectiveAttributes.int +
    effectiveAttributes.wil +
    character.defenseOverrides.cognitiveBonus

  const spiritualDefense =
    10 +
    effectiveAttributes.awa +
    effectiveAttributes.pre +
    character.defenseOverrides.spiritualBonus

  // Step 3: resources
  const maxHealth = computeMaxHealth(character, effectiveAttributes)
  const maxFocus = 2 * effectiveAttributes.wil + character.focusBonus
  const maxInvestiture = character.isRadiant ? character.investitureMax : 0

  // Step 4: deflect = sum of equipped armour + singer form bonus
  const armourDeflect = character.armour
    .filter(a => a.isEquipped)
    .reduce((sum, a) => sum + a.deflectBonus, 0)
  const deflect = armourDeflect + getSingerFormDeflectBonus(
    character.ancestry === 'Singer' ? character.activeSingerForm : null,
  )

  // Step 5: lookup table derived stats
  const movement = getMovementRate(effectiveAttributes.spd)
  const recoveryDie = getRecoveryDie(effectiveAttributes.wil)
  const sensesRange = getSensesRange(effectiveAttributes.awa)
  const liftingCapacity = getLiftingCapacity(effectiveAttributes.str)

  // Step 6: skill modifiers = ranks + governing attribute
  const skillMap: Record<string, SkillDerivedEntry> = {}
  for (const skillDef of SKILLS) {
    const entry = character.skills.find(s => s.skillId === skillDef.id)
    const ranks = entry?.ranks ?? 0
    const attributeBonus = effectiveAttributes[skillDef.governingAttribute]
    skillMap[skillDef.id] = {
      ranks,
      attributeBonus,
      total: ranks + attributeBonus,
    }
  }

  return {
    effectiveAttributes,
    physicalDefense,
    cognitiveDefense,
    spiritualDefense,
    maxHealth,
    maxFocus,
    maxInvestiture,
    deflect,
    movement,
    recoveryDie,
    sensesRange,
    liftingCapacity,
    skills: skillMap,
  }
}

/**
 * Max Health = 10 + STR (level 1 base) + cumulative tier-based gains per level.
 * Tier 1 (levels 1-5): +5/level, Tier 2 (6-10): +4, Tier 3 (11-15): +3,
 * Tier 4 (16-20): +2, Tier 5 (21+): +1.
 *
 * Note: The PRD mentions "some levels add STR again" — this is currently
 * represented as the STR contribution to the base value only. Revisit when
 * the exact Handbook table is available.
 */
function computeMaxHealth(character: Character, effective: Attributes): number {
  const base = 10 + effective.str
  let gain = 0
  for (let lvl = 2; lvl <= character.level; lvl++) {
    gain += healthGainAtLevel(lvl)
  }
  return base + gain
}

function healthGainAtLevel(level: number): number {
  if (level <= 5)  return 5
  if (level <= 10) return 4
  if (level <= 15) return 3
  if (level <= 20) return 2
  return 1
}
