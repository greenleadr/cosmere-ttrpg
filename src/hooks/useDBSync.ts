/**
 * App-level DB sync hook.
 * Call once at app root: useDBSync()
 *
 * - On mount: loads all data from IndexedDB → Zustand stores
 * - Subscribes to store changes and writes back to DB (debounced 300ms)
 */

import { useEffect, useRef } from 'react'
import { useCharacterStore } from '@/store/characterStore'
import { useCampaignStore } from '@/store/campaignStore'
import { useAdversaryStore } from '@/store/adversaryStore'
import {
  loadAllCharacters,
  loadAllCampaigns,
  loadAllAdversaries,
  saveCharacter,
  saveCampaign,
  saveAdversary,
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
          // Set first as active if none set
          if (!charStore.activeCharacterId && chars[0]) {
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
      } catch (err) {
        console.error('[DB bootstrap error]', err)
      }
    }

    void bootstrap()

    // Subscribe to character store mutations
    const unsubChars = useCharacterStore.subscribe(state => {
      for (const char of Object.values(state.characters)) {
        debouncedSave(`char:${char.id}`, () => saveCharacter(char))
      }
    })

    // Subscribe to campaign store mutations
    const unsubCampaigns = useCampaignStore.subscribe(state => {
      for (const campaign of Object.values(state.campaigns)) {
        debouncedSave(`campaign:${campaign.id}`, () => saveCampaign(campaign))
      }
    })

    // Subscribe to adversary store mutations
    const unsubAdversaries = useAdversaryStore.subscribe(state => {
      for (const template of Object.values(state.templates)) {
        debouncedSave(`adversary:${template.id}`, () => saveAdversary(template))
      }
    })

    return () => {
      unsubChars()
      unsubCampaigns()
      unsubAdversaries()
    }
  }, [])
}
