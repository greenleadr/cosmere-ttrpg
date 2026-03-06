import { create } from 'zustand'

const GM_PASSWORD = 'desmond'
const STORAGE_KEY = 'gm-auth'

interface GMAuthState {
  isAuthenticated: boolean
  authenticate: (password: string) => boolean
  deauthenticate: () => void
}

export const useGMAuthStore = create<GMAuthState>()((set) => ({
  isAuthenticated: sessionStorage.getItem(STORAGE_KEY) === '1',

  authenticate: (password) => {
    if (password !== GM_PASSWORD) return false
    sessionStorage.setItem(STORAGE_KEY, '1')
    set({ isAuthenticated: true })
    return true
  },

  deauthenticate: () => {
    sessionStorage.removeItem(STORAGE_KEY)
    set({ isAuthenticated: false })
  },
}))
