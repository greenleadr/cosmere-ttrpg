import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { nanoid } from 'nanoid'
import type { Campaign, SessionNote } from '@/types/campaign'

const ACTIVE_CAMPAIGN_KEY = 'cosmere-active-campaign'

function createDefaultCampaign(overrides?: Partial<Campaign>): Campaign {
  const now = Date.now()
  return {
    id: nanoid(10),
    schemaVersion: 1,
    name: 'New Campaign',
    playerCharacterIds: [],
    sessionNotes: [],
    currentSessionNumber: 1,
    gmSessionCode: nanoid(6),
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

interface CampaignState {
  campaigns: Record<string, Campaign>
  activeCampaignId: string | null

  addCampaign: (overrides?: Partial<Campaign>) => string
  removeCampaign: (id: string) => void
  setActiveCampaign: (id: string) => void
  updateCampaign: (id: string, updates: Partial<Pick<Campaign, 'name' | 'currentSessionNumber'>>) => void

  addCharacterToCampaign: (campaignId: string, characterId: string) => void
  removeCharacterFromCampaign: (campaignId: string, characterId: string) => void

  addSessionNote: (campaignId: string, content: string) => void
  updateSessionNote: (campaignId: string, noteId: string, content: string) => void
  removeSessionNote: (campaignId: string, noteId: string) => void

  hydrate: (campaigns: Campaign[]) => void
}

export const useCampaignStore = create<CampaignState>()(
  immer((set) => ({
    campaigns: {},
    activeCampaignId: localStorage.getItem(ACTIVE_CAMPAIGN_KEY) ?? null,

    addCampaign: (overrides) => {
      const campaign = createDefaultCampaign(overrides)
      set(state => {
        state.campaigns[campaign.id] = campaign
        if (!state.activeCampaignId) {
          state.activeCampaignId = campaign.id
          localStorage.setItem(ACTIVE_CAMPAIGN_KEY, campaign.id)
        }
      })
      return campaign.id
    },

    removeCampaign: (id) => set(state => {
      delete state.campaigns[id]
      if (state.activeCampaignId === id) {
        const remaining = Object.keys(state.campaigns)
        const next = remaining[0] ?? null
        state.activeCampaignId = next
        if (next) localStorage.setItem(ACTIVE_CAMPAIGN_KEY, next)
        else localStorage.removeItem(ACTIVE_CAMPAIGN_KEY)
      }
    }),

    setActiveCampaign: (id) => {
      localStorage.setItem(ACTIVE_CAMPAIGN_KEY, id)
      set(state => { state.activeCampaignId = id })
    },

    updateCampaign: (id, updates) => set(state => {
      const c = state.campaigns[id]
      if (!c) return
      Object.assign(c, updates)
      c.updatedAt = Date.now()
    }),

    addCharacterToCampaign: (campaignId, characterId) => set(state => {
      const c = state.campaigns[campaignId]
      if (!c || c.playerCharacterIds.includes(characterId)) return
      c.playerCharacterIds.push(characterId)
      c.updatedAt = Date.now()
    }),

    removeCharacterFromCampaign: (campaignId, characterId) => set(state => {
      const c = state.campaigns[campaignId]
      if (!c) return
      c.playerCharacterIds = c.playerCharacterIds.filter(id => id !== characterId)
      c.updatedAt = Date.now()
    }),

    addSessionNote: (campaignId, content) => set(state => {
      const c = state.campaigns[campaignId]
      if (!c) return
      const note: SessionNote = {
        id: nanoid(8),
        sessionNumber: c.currentSessionNumber,
        content,
        timestamp: Date.now(),
      }
      c.sessionNotes.unshift(note)
      c.updatedAt = Date.now()
    }),

    updateSessionNote: (campaignId, noteId, content) => set(state => {
      const c = state.campaigns[campaignId]
      if (!c) return
      const note = c.sessionNotes.find(n => n.id === noteId)
      if (note) {
        note.content = content
        c.updatedAt = Date.now()
      }
    }),

    removeSessionNote: (campaignId, noteId) => set(state => {
      const c = state.campaigns[campaignId]
      if (!c) return
      c.sessionNotes = c.sessionNotes.filter(n => n.id !== noteId)
      c.updatedAt = Date.now()
    }),

    hydrate: (campaigns) => set(state => {
      for (const c of campaigns) {
        state.campaigns[c.id] = c
      }
      if (!state.activeCampaignId && campaigns.length > 0) {
        const id = campaigns[0]!.id
        state.activeCampaignId = id
        localStorage.setItem(ACTIVE_CAMPAIGN_KEY, id)
      }
    }),
  })),
)
