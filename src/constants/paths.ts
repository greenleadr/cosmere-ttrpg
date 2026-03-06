/**
 * Heroic paths, radiant paths (Radiant Orders / Surgebinders),
 * and singer ancestry constants.
 */

export const HEROIC_PATHS = [
  'Agent',
  'Envoy',
  'Hunter',
  'Leader',
  'Scholar',
  'Warrior',
] as const

export type HeroicPath = typeof HEROIC_PATHS[number]

/** Radiant Orders / Surgebinding Paths (from the Stormlight Handbook) */
export const RADIANT_PATHS = [
  'Windrunner',
  'Skybreaker',
  'Dustbringer',
  'Edgedancer',
  'Truthwatcher',
  'Lightweaver',
  'Elsecaller',
  'Willshaper',
  'Stoneward',
  'Bondsmith',
] as const

export type RadiantPath = typeof RADIANT_PATHS[number]

/** Surge skills unlocked per Radiant path */
export const RADIANT_PATH_SURGES: Record<string, string[]> = {
  Windrunner:   ['Gravitation', 'Adhesion'],
  Skybreaker:   ['Gravitation', 'Division'],
  Dustbringer:  ['Division', 'Abrasion'],
  Edgedancer:   ['Abrasion', 'Progression'],
  Truthwatcher: ['Progression', 'Illumination'],
  Lightweaver:  ['Illumination', 'Transformation'],
  Elsecaller:   ['Transformation', 'Transportation'],
  Willshaper:   ['Transportation', 'Cohesion'],
  Stoneward:    ['Cohesion', 'Tension'],
  Bondsmith:    ['Tension', 'Adhesion'],
}

/** Human cultures from the Stormlight setting */
export const CULTURES = [
  'Alethi',
  'Azish',
  'Horneater',
  'Herdazian',
  'Thaylen',
  'Reshi',
  'Natanan',
  'Shin',
  'Veden',
  'Unkalaki',
  'Other / Custom',
] as const

export type Culture = typeof CULTURES[number]
