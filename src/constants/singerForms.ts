import type { Attributes } from '@/types/character'

export interface SingerFormDefinition {
  id: string
  name: string
  attributeDeltas: Partial<Attributes>
  deflectBonus: number
  description: string
  ruleTooltip: string
}

export const SINGER_FORMS: SingerFormDefinition[] = [
  {
    id: 'mateform',
    name: 'Mateform',
    attributeDeltas: { pre: 1 },
    deflectBonus: 0,
    description: 'A form of passion and connection.',
    ruleTooltip: 'Mateform: +1 Presence. A form associated with emotion and relationship.',
  },
  {
    id: 'artform',
    name: 'Artform',
    attributeDeltas: { awa: 1 },
    deflectBonus: 0,
    description: 'A form of creativity and perception.',
    ruleTooltip: 'Artform: +1 Awareness. A form that enhances creative and perceptive abilities.',
  },
  {
    id: 'scholarform',
    name: 'Scholarform',
    attributeDeltas: { int: 1 },
    deflectBonus: 0,
    description: 'A form of learning and intellect.',
    ruleTooltip: 'Scholarform: +1 Intellect. A form that sharpens the mind for study and analysis.',
  },
  {
    id: 'nimbleform',
    name: 'Nimbleform',
    attributeDeltas: { spd: 1 },
    deflectBonus: 0,
    description: 'A form of grace and speed.',
    ruleTooltip: 'Nimbleform: +1 Speed. A form that enhances agility and quickness.',
  },
  {
    id: 'warform',
    name: 'Warform',
    attributeDeltas: { str: 1 },
    deflectBonus: 1,
    description: 'A form of battle and strength.',
    ruleTooltip: 'Warform: +1 Strength, +1 Deflect. A form purpose-built for combat.',
  },
  {
    id: 'stormform',
    name: 'Stormform',
    attributeDeltas: { wil: 1 },
    deflectBonus: 0,
    description: 'A form of storm and Investiture.',
    ruleTooltip: 'Stormform: +1 Willpower. A form that channels the power of the highstorm.',
  },
  {
    id: 'workform',
    name: 'Workform',
    attributeDeltas: { str: 1 },
    deflectBonus: 0,
    description: 'A form of labour and endurance.',
    ruleTooltip: 'Workform: +1 Strength. A form built for sustained physical work.',
  },
  {
    id: 'slaveform',
    name: 'Dullform',
    attributeDeltas: {},
    deflectBonus: 0,
    description: 'A diminished form with no attribute bonuses.',
    ruleTooltip: 'Dullform: No attribute bonuses. A suppressed state imposed on captive singers.',
  },
]

export function getSingerFormById(id: string): SingerFormDefinition | undefined {
  return SINGER_FORMS.find(f => f.id === id)
}
