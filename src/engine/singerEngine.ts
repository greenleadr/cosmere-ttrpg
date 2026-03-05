import type { Attributes } from '@/types/character'
import { getSingerFormById } from '@/constants/singerForms'

/**
 * Apply an active singer form's attribute deltas on top of base attributes.
 * Returns a new Attributes object — base attributes are never mutated.
 * Singers may temporarily exceed the normal 0-5 cap; we do not clamp here.
 */
export function applyActiveSingerForm(
  base: Attributes,
  singerFormId: string | null,
): Attributes {
  if (!singerFormId) return { ...base }
  const form = getSingerFormById(singerFormId)
  if (!form) return { ...base }

  return {
    str: base.str + (form.attributeDeltas.str ?? 0),
    spd: base.spd + (form.attributeDeltas.spd ?? 0),
    int: base.int + (form.attributeDeltas.int ?? 0),
    wil: base.wil + (form.attributeDeltas.wil ?? 0),
    awa: base.awa + (form.attributeDeltas.awa ?? 0),
    pre: base.pre + (form.attributeDeltas.pre ?? 0),
  }
}

/**
 * Return the Deflect bonus granted by the active singer form.
 */
export function getSingerFormDeflectBonus(singerFormId: string | null): number {
  if (!singerFormId) return 0
  return getSingerFormById(singerFormId)?.deflectBonus ?? 0
}
