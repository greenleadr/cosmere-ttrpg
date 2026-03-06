/**
 * Store ↔ IndexedDB sync.
 *
 * Pattern:
 * - On app init: load all records from DB → populate Zustand stores
 * - On store mutation: debounced write to DB (300ms)
 *
 * The in-memory Zustand store is always the source of truth;
 * IndexedDB is the persistence layer.
 */

import { db } from './database'
import { migrateRecord } from './migrations'
import type { Character } from '@/types/character'
import type { Campaign } from '@/types/campaign'
import type { AdversaryTemplate } from '@/types/adversary'
import type { Encounter } from '@/types/combat'

// ─── Characters ──────────────────────────────────────────────────────────────

export async function loadAllCharacters(): Promise<Character[]> {
  const raw = await db.characters.toArray()
  return raw.map(r =>
    migrateRecord('character', r as unknown as Record<string, unknown>) as unknown as Character
  )
}

export async function saveCharacter(character: Character): Promise<void> {
  await db.characters.put(character)
}

export async function deleteCharacter(id: string): Promise<void> {
  await db.characters.delete(id)
}

// ─── Campaigns ───────────────────────────────────────────────────────────────

export async function loadAllCampaigns(): Promise<Campaign[]> {
  const raw = await db.campaigns.toArray()
  return raw.map(r =>
    migrateRecord('campaign', r as unknown as Record<string, unknown>) as unknown as Campaign
  )
}

export async function saveCampaign(campaign: Campaign): Promise<void> {
  await db.campaigns.put(campaign)
}

export async function deleteCampaign(id: string): Promise<void> {
  await db.campaigns.delete(id)
}

// ─── Adversaries ─────────────────────────────────────────────────────────────

export async function loadAllAdversaries(): Promise<AdversaryTemplate[]> {
  const raw = await db.adversaries.toArray()
  return raw.map(r =>
    migrateRecord('adversary', r as unknown as Record<string, unknown>) as unknown as AdversaryTemplate
  )
}

export async function saveAdversary(adversary: AdversaryTemplate): Promise<void> {
  await db.adversaries.put(adversary)
}

export async function deleteAdversary(id: string): Promise<void> {
  await db.adversaries.delete(id)
}

// ─── Encounters ──────────────────────────────────────────────────────────────

export async function loadAllEncounters(): Promise<Encounter[]> {
  const raw = await db.encounters.toArray()
  return raw.map(r =>
    migrateRecord('encounter', r as unknown as Record<string, unknown>) as unknown as Encounter
  )
}

export async function saveEncounter(encounter: Encounter): Promise<void> {
  await db.encounters.put(encounter)
}

export async function deleteEncounter(id: string): Promise<void> {
  await db.encounters.delete(id)
}

// ─── Debounce utility ────────────────────────────────────────────────────────

const pendingWrites = new Map<string, ReturnType<typeof setTimeout>>()

export function debouncedSave(
  key: string,
  fn: () => Promise<void>,
  delayMs = 300,
): void {
  const existing = pendingWrites.get(key)
  if (existing) clearTimeout(existing)
  const handle = setTimeout(() => {
    fn().catch(err => console.error('[DB sync error]', err))
    pendingWrites.delete(key)
  }, delayMs)
  pendingWrites.set(key, handle)
}
