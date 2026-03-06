import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type SessionRole = 'solo' | 'gm' | 'player'

interface SessionState {
  role: SessionRole
  sessionCode: string | null
  linkedCharacterId: string | null
  lastSyncTimestamp: number

  initSoloMode: () => void
  initGMSession: () => void
  initPlayerSession: (code: string, characterId: string) => void
  setRole: (role: SessionRole) => void
  updateSyncTimestamp: () => void
}

export const useSessionStore = create<SessionState>()((set) => ({
  role: 'solo',
  sessionCode: null,
  linkedCharacterId: null,
  lastSyncTimestamp: 0,

  initSoloMode: () => set({ role: 'solo', sessionCode: null, linkedCharacterId: null }),

  initGMSession: () => set({
    role: 'gm',
    sessionCode: nanoid(6),
    linkedCharacterId: null,
  }),

  initPlayerSession: (code, characterId) => set({
    role: 'player',
    sessionCode: code,
    linkedCharacterId: characterId,
  }),

  setRole: (role) => set({ role }),

  updateSyncTimestamp: () => set({ lastSyncTimestamp: Date.now() }),
}))
