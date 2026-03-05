export type InjuryDurationCategory = 'death' | 'permanent' | 'vicious' | 'shallow' | 'flesh-wound'

export interface InjuryDurationDefinition {
  category: InjuryDurationCategory
  label: string
  duration: string
  description: string
}

export const INJURY_DURATIONS: InjuryDurationDefinition[] = [
  {
    category: 'death',
    label: 'Death',
    duration: 'Permanent (character dies)',
    description: 'The character has died from their injuries.',
  },
  {
    category: 'permanent',
    label: 'Permanent Injury',
    duration: 'Indefinite',
    description: 'A lasting injury that never fully heals. The mechanical effect persists until explicitly cured.',
  },
  {
    category: 'vicious',
    label: 'Vicious Injury',
    duration: '6d6 days',
    description: 'A severe injury requiring extended recovery. Roll 6d6 for days remaining.',
  },
  {
    category: 'shallow',
    label: 'Shallow Injury',
    duration: '1d6 days',
    description: 'A moderate wound that heals with rest. Roll 1d6 for days remaining.',
  },
  {
    category: 'flesh-wound',
    label: 'Flesh Wound',
    duration: 'Until long rest',
    description: 'A minor injury that clears after a good night\'s rest.',
  },
]

/** Injury roll result → duration category */
export function getInjuryDurationByRoll(rollResult: number): InjuryDurationCategory {
  if (rollResult <= 1) return 'death'
  if (rollResult <= 5) return 'permanent'
  if (rollResult <= 10) return 'vicious'
  if (rollResult <= 15) return 'shallow'
  return 'flesh-wound'
}
