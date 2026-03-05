export interface SessionNote {
  id: string
  sessionNumber: number
  content: string
  timestamp: number
}

export interface Campaign {
  id: string
  schemaVersion: number
  name: string
  playerCharacterIds: string[]
  sessionNotes: SessionNote[]
  currentSessionNumber: number
  gmSessionCode: string
  createdAt: number
  updatedAt: number
}
