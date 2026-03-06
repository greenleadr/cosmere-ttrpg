import { create } from 'zustand'
import { nanoid } from 'nanoid'

export type SessionRole = 'solo' | 'gm' | 'player'

const SS_ROLE = 'session-role'
const SS_CODE = 'session-code'
const SS_CHAR = 'session-char'

function readFromStorage(): Pick<SessionState, 'role' | 'sessionCode' | 'linkedCharacterId'> {
  const role = (sessionStorage.getItem(SS_ROLE) as SessionRole | null) ?? 'solo'
  const sessionCode = sessionStorage.getItem(SS_CODE) ?? null
  const linkedCharacterId = sessionStorage.getItem(SS_CHAR) ?? null
  return { role, sessionCode, linkedCharacterId }
}

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
  ...readFromStorage(),
  lastSyncTimestamp: 0,

  initSoloMode: () => {
    sessionStorage.removeItem(SS_ROLE)
    sessionStorage.removeItem(SS_CODE)
    sessionStorage.removeItem(SS_CHAR)
    set({ role: 'solo', sessionCode: null, linkedCharacterId: null })
  },

  initGMSession: () => {
    const code = nanoid(6)
    sessionStorage.setItem(SS_ROLE, 'gm')
    sessionStorage.setItem(SS_CODE, code)
    sessionStorage.removeItem(SS_CHAR)
    set({ role: 'gm', sessionCode: code, linkedCharacterId: null })
  },

  initPlayerSession: (code, characterId) => {
    sessionStorage.setItem(SS_ROLE, 'player')
    sessionStorage.setItem(SS_CODE, code)
    sessionStorage.setItem(SS_CHAR, characterId)
    set({ role: 'player', sessionCode: code, linkedCharacterId: characterId })
  },

  setRole: (role) => set({ role }),

  updateSyncTimestamp: () => set({ lastSyncTimestamp: Date.now() }),
}))
