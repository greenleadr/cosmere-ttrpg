/**
 * App-level DB sync hook.
 * Call once at app root: useDBSync()
 *
 * - On mount: loads all data from IndexedDB → Zustand stores
 * - Subscribes to store changes and writes back to DB (debounced 300ms)
 * - Dirty-checks updatedAt timestamps to skip redundant writes
 * - Syncs active combat encounter so it survives page refresh
 */

import { useEffect, useRef } from 'react'
import { create } from 'zustand'
import { useCharacterStore } from '@/store/characterStore'
import { useCampaignStore } from '@/store/campaignStore'
import { useAdversaryStore } from '@/store/adversaryStore'
import { useCombatStore } from '@/store/combatStore'

/** True once the initial IndexedDB bootstrap has finished. */
export const useDBReady = create<{ ready: boolean }>()(() => ({ ready: false }))
import {
  loadAllCharacters,
  loadAllCampaigns,
  loadAllAdversaries,
  loadAllEncounters,
  saveCharacter,
  saveCampaign,
  saveAdversary,
  saveEncounter,
  deleteEncounter,
  debouncedSave,
} from '@/db/sync'

export function useDBSync() {
  const bootstrapped = useRef(false)

  useEffect(() => {
    if (bootstrapped.current) return
    bootstrapped.current = true

    async function bootstrap() {
      try {
        // Load characters
        const chars = await loadAllCharacters()
        if (chars.length > 0) {
          const charStore = useCharacterStore.getState()
          for (const c of chars) {
            charStore.applyUpdatedCharacter(c)
          }
          // Restore last-active character; fall back to first
          const savedId = charStore.activeCharacterId
          if (savedId && chars.some(c => c.id === savedId)) {
            charStore.setActiveCharacter(savedId)
          } else if (!charStore.activeCharacterId && chars[0]) {
            charStore.setActiveCharacter(chars[0].id)
          }
        }

        // Load campaigns
        const campaigns = await loadAllCampaigns()
        if (campaigns.length > 0) {
          useCampaignStore.getState().hydrate(campaigns)
        }

        // Load adversary templates
        const adversaries = await loadAllAdversaries()
        if (adversaries.length > 0) {
          useAdversaryStore.getState().hydrate(adversaries)
        }

        // Load active encounter (if GM was mid-combat on last visit)
        const encounters = await loadAllEncounters()
        const activeEnc = encounters.find(e => e.isActive)
        if (activeEnc) {
          useCombatStore.getState().hydrate(activeEnc)
        }
      } catch (err) {
        console.error('[DB bootstrap error]', err)
      } finally {
        useDBReady.setState({ ready: true })
      }
    }

    void bootstrap()

    // ── Dirty-tracking maps (only write when updatedAt changes) ──────────────
    const charTimestamps = new Map<string, number>()
    const campaignTimestamps = new Map<string, number>()
    const adversaryTimestamps = new Map<string, number>()

    // Subscribe to character store mutations
    const unsubChars = useCharacterStore.subscribe(state => {
      for (const char of Object.values(state.characters)) {
        const last = charTimestamps.get(char.id) ?? 0
        if (char.updatedAt > last) {
          charTimestamps.set(char.id, char.updatedAt)
          debouncedSave(`char:${char.id}`, () => saveCharacter(char))
        }
      }
    })

    // Subscribe to campaign store mutations
    const unsubCampaigns = useCampaignStore.subscribe(state => {
      for (const campaign of Object.values(state.campaigns)) {
        const last = campaignTimestamps.get(campaign.id) ?? 0
        if (campaign.updatedAt > last) {
          campaignTimestamps.set(campaign.id, campaign.updatedAt)
          debouncedSave(`campaign:${campaign.id}`, () => saveCampaign(campaign))
        }
      }
    })

    // Subscribe to adversary store mutations
    const unsubAdversaries = useAdversaryStore.subscribe(state => {
      for (const template of Object.values(state.templates)) {
        const last = adversaryTimestamps.get(template.id) ?? 0
        if (template.updatedAt > last) {
          adversaryTimestamps.set(template.id, template.updatedAt)
          debouncedSave(`adversary:${template.id}`, () => saveAdversary(template))
        }
      }
    })

    // Subscribe to combat store — persist active encounter, delete when ended
    let lastEncounterId: string | null = null
    const unsubCombat = useCombatStore.subscribe(state => {
      const enc = state.encounter
      if (enc) {
        lastEncounterId = enc.id
        debouncedSave(`encounter:${enc.id}`, () => saveEncounter(enc))
      } else if (lastEncounterId) {
        void deleteEncounter(lastEncounterId)
        lastEncounterId = null
      }
    })

    return () => {
      unsubChars()
      unsubCampaigns()
      unsubAdversaries()
      unsubCombat()
    }
  }, [])
}
