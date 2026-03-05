import type { Encounter, CombatantSlot, TurnPhase } from '@/types/combat'

const PHASE_ORDER: TurnPhase[] = ['fast-pc', 'fast-npc', 'slow-pc', 'slow-npc']

/** Return combatants belonging to the given phase, in their list order. */
export function getCombatantsForPhase(
  encounter: Encounter,
  phase: TurnPhase,
): CombatantSlot[] {
  return encounter.combatants.filter(c => {
    if (phase === 'fast-pc')  return c.isPC && c.isFast
    if (phase === 'fast-npc') return !c.isPC && c.isFast
    if (phase === 'slow-pc')  return c.isPC && !c.isFast
    return !c.isPC && !c.isFast
  })
}

/** Return the ordered list of all combatants across phases for this round. */
export function getPhaseOrder(encounter: Encounter): CombatantSlot[] {
  return PHASE_ORDER.flatMap(phase => getCombatantsForPhase(encounter, phase))
}

/**
 * Advance to the next combatant's turn.
 * When the last combatant in the last phase has acted, starts a new round.
 */
export function advanceTurn(encounter: Encounter): Encounter {
  const ordered = getPhaseOrder(encounter)
  const currentIdx = encounter.currentCombatantIndex

  // Mark current combatant as having acted
  const updated: Encounter = {
    ...encounter,
    combatants: encounter.combatants.map((c, i) =>
      i === currentIdx ? { ...c, hasActed: true } : c,
    ),
  }

  // Find next combatant who hasn't acted
  const next = findNextCombatantIndex(ordered, updated.combatants)
  if (next === -1) {
    // All combatants have acted — start new round
    return startNewRound(updated)
  }

  // Update phase if necessary
  const nextCombatant = updated.combatants[next]
  if (!nextCombatant) return startNewRound(updated)

  const nextPhase = phaseForCombatant(nextCombatant)
  return {
    ...updated,
    currentCombatantIndex: next,
    currentPhase: nextPhase,
  }
}

export function startNewRound(encounter: Encounter): Encounter {
  return {
    ...encounter,
    roundNumber: encounter.roundNumber + 1,
    currentPhase: 'fast-pc',
    currentCombatantIndex: 0,
    combatants: encounter.combatants.map(c => ({
      ...c,
      hasActed: false,
      // Remove Surprised after first round
      conditions: c.conditions.filter(cond => cond.conditionId !== 'surprised'),
    })),
  }
}

function phaseForCombatant(c: CombatantSlot): TurnPhase {
  if (c.isPC && c.isFast)  return 'fast-pc'
  if (!c.isPC && c.isFast) return 'fast-npc'
  if (c.isPC && !c.isFast) return 'slow-pc'
  return 'slow-npc'
}

function findNextCombatantIndex(
  ordered: CombatantSlot[],
  allCombatants: CombatantSlot[],
): number {
  for (const slot of ordered) {
    const idx = allCombatants.findIndex(c => c.id === slot.id)
    if (idx !== -1 && !allCombatants[idx]!.hasActed) {
      return idx
    }
  }
  return -1
}
