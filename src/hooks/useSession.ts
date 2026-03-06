/**
 * Session linking via BroadcastChannel.
 * The GM broadcasts character state; players receive and display it read-only.
 * Players broadcast their own resource/condition changes back to the GM.
 */

import { useEffect, useRef, useCallback } from 'react'
import { useSessionStore } from '@/store/sessionStore'
import { useCharacterStore } from '@/store/characterStore'
import type { Character } from '@/types/character'

type BroadcastMessage =
  | { type: 'CHAR_UPDATE'; characterId: string; payload: Character }
  | { type: 'PING'; role: string }
  | { type: 'PONG'; role: string }

export function useSession() {
  const { role, sessionCode } = useSessionStore()
  const channelRef = useRef<BroadcastChannel | null>(null)

  // Open channel when sessionCode is set
  useEffect(() => {
    if (!sessionCode) return
    const channel = new BroadcastChannel(`cosmere-session-${sessionCode}`)
    channelRef.current = channel

    channel.onmessage = (event: MessageEvent<BroadcastMessage>) => {
      const msg = event.data
      if (msg.type === 'CHAR_UPDATE') {
        // Apply received character state (GM → player or player → GM)
        const store = useCharacterStore.getState()
        // Only apply if we don't own this character (role: player) or GM receives from player
        if (role === 'gm' || (role === 'player' && msg.characterId !== useSessionStore.getState().linkedCharacterId)) {
          store.applyUpdatedCharacter(msg.payload)
          useSessionStore.getState().updateSyncTimestamp()
        }
      }
    }

    // Announce presence
    channel.postMessage({ type: 'PING', role } satisfies BroadcastMessage)

    return () => {
      channel.close()
      channelRef.current = null
    }
  }, [sessionCode, role])

  // GM: broadcast on every character store mutation
  useEffect(() => {
    if (role !== 'gm' || !sessionCode) return

    const unsub = useCharacterStore.subscribe(state => {
      const channel = channelRef.current
      if (!channel) return
      for (const char of Object.values(state.characters)) {
        channel.postMessage({
          type: 'CHAR_UPDATE',
          characterId: char.id,
          payload: char,
        } satisfies BroadcastMessage)
      }
    })

    return unsub
  }, [role, sessionCode])

  const broadcastCharacter = useCallback((char: Character) => {
    channelRef.current?.postMessage({
      type: 'CHAR_UPDATE',
      characterId: char.id,
      payload: char,
    } satisfies BroadcastMessage)
  }, [])

  return { broadcastCharacter }
}
