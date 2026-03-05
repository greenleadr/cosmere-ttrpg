export type UserRole = 'gm' | 'player' | 'solo'

export interface SessionState {
  sessionCode: string | null
  role: UserRole
  linkedCharacterId: string | null
  lastSyncTimestamp: number
}
