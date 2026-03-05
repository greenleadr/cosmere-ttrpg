import { useMemo } from 'react'
import type { Character, DerivedStats } from '@/types/character'
import { computeDerivedStats } from '@/engine/derivedStats'

/**
 * Memoized hook that computes all derived stats from a character record.
 * Re-runs only when the character object reference changes.
 */
export function useDerivedStats(character: Character): DerivedStats {
  return useMemo(() => computeDerivedStats(character), [character])
}
