/**
 * Export/import utilities for campaign data.
 * Produces a single JSON bundle containing all characters, campaigns,
 * adversaries, and encounters for backup or cross-device transfer.
 */

import type { Character } from '@/types/character'
import type { Campaign } from '@/types/campaign'
import type { AdversaryTemplate } from '@/types/adversary'

export interface ExportBundle {
  version: 1
  exportedAt: number
  characters: Character[]
  campaigns: Campaign[]
  adversaries: AdversaryTemplate[]
}

export function buildExportBundle(
  characters: Character[],
  campaigns: Campaign[],
  adversaries: AdversaryTemplate[],
): ExportBundle {
  return {
    version: 1,
    exportedAt: Date.now(),
    characters,
    campaigns,
    adversaries,
  }
}

export function downloadJSON(data: unknown, filename: string): void {
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function parseImportBundle(json: string): ExportBundle {
  const parsed = JSON.parse(json) as unknown
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    (parsed as ExportBundle).version !== 1
  ) {
    throw new Error('Invalid export bundle format.')
  }
  return parsed as ExportBundle
}
