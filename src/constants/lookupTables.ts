/**
 * Hardcoded lookup tables from the Stormlight Handbook.
 * Attribute scores above 5 are possible via some talents/singer forms;
 * tables extend to 8 as a safe upper bound.
 */

/** Speed score → feet per action */
export const MOVEMENT_RATE: Record<number, number> = {
  0: 15,
  1: 20,
  2: 25,
  3: 30,
  4: 35,
  5: 40,
  6: 50,
  7: 60,
  8: 70,
}

/** Willpower score → recovery die size */
export const RECOVERY_DIE: Record<number, string> = {
  0: 'd4',
  1: 'd4',
  2: 'd6',
  3: 'd8',
  4: 'd10',
  5: 'd12',
  6: 'd12',
  7: 'd12',
  8: 'd12',
}

/** Awareness score → feet when primary sense is obscured */
export const SENSES_RANGE: Record<number, number> = {
  0: 10,
  1: 20,
  2: 30,
  3: 40,
  4: 50,
  5: 60,
  6: 75,
  7: 90,
  8: 120,
}

/** Strength score → lifting capacity in pounds */
export const LIFTING_CAPACITY: Record<number, number> = {
  0: 50,
  1: 100,
  2: 200,
  3: 400,
  4: 800,
  5: 1600,
  6: 3200,
  7: 6400,
  8: 12800,
}

export function getMovementRate(spd: number): number {
  return MOVEMENT_RATE[Math.min(Math.max(spd, 0), 8)] ?? 40
}

export function getRecoveryDie(wil: number): string {
  return RECOVERY_DIE[Math.min(Math.max(wil, 0), 8)] ?? 'd12'
}

export function getSensesRange(awa: number): number {
  return SENSES_RANGE[Math.min(Math.max(awa, 0), 8)] ?? 60
}

export function getLiftingCapacity(str: number): number {
  return LIFTING_CAPACITY[Math.min(Math.max(str, 0), 8)] ?? 1600
}
