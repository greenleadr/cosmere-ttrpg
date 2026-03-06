import { useState } from 'react'
import { useCharacterStore } from '@/store/characterStore'
import { useCampaignStore } from '@/store/campaignStore'
import { useSessionStore } from '@/store/sessionStore'
import { useDerivedStats } from '@/hooks/useDerivedStats'
import { CharacterCard } from './CharacterCard'
import { SessionNotes } from './SessionNotes'
import { CharacterSheet } from '@/components/character/CharacterSheet'
import { LevelUpModal } from '@/components/character/LevelUpModal'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import type { Character } from '@/types/character'

type GMTab = 'party' | 'notes'

export function GMDashboard() {
  const { characters, addCharacter, applyUpdatedCharacter } = useCharacterStore()
  const { campaigns, activeCampaignId, addCampaign, addCharacterToCampaign, addSessionNote, updateSessionNote, removeSessionNote } = useCampaignStore()
  const { role, sessionCode, initGMSession, initSoloMode } = useSessionStore()
  const [activeTab, setActiveTab] = useState<GMTab>('party')
  const [drillDownCharId, setDrillDownCharId] = useState<string | null>(null)
  const [levelUpCharId, setLevelUpCharId] = useState<string | null>(null)

  // Ensure there's a campaign
  const campaign = activeCampaignId ? campaigns[activeCampaignId] : null

  function handleEnsureCampaign() {
    if (!campaign) addCampaign()
  }

  function handleAddCharacter() {
    handleEnsureCampaign()
    const newId = addCharacter()
    const campaignId = activeCampaignId ?? useCampaignStore.getState().activeCampaignId
    if (campaignId) addCharacterToCampaign(campaignId, newId)
  }

  const campaignCharIds = campaign?.playerCharacterIds ?? []
  const partyChars = campaignCharIds
    .map(id => characters[id])
    .filter((c): c is Character => c !== undefined)

  // Characters not in campaign
  const allChars = Object.values(characters)

  const drillChar = drillDownCharId ? characters[drillDownCharId] : null
  const levelUpChar = levelUpCharId ? characters[levelUpCharId] : null

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: 'var(--color-void)', color: 'var(--color-pale)' }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center justify-between gap-4"
        style={{ background: 'var(--color-deep-storm)', borderBottom: '1px solid var(--color-storm-mid)' }}
      >
        <div className="min-w-0">
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-gold-bright)' }}>
            GM Dashboard
          </h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-fog)' }}>
            {campaign ? campaign.name : 'No active campaign'} · {partyChars.length} character{partyChars.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Session controls */}
          {role === 'gm' && sessionCode ? (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded"
              style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)' }}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#6bbf6b' }} />
              <span className="text-xs" style={{ color: 'var(--color-fog)' }}>Code:</span>
              <span className="text-sm font-mono font-bold" style={{ color: 'var(--color-stormlight)' }}>
                {sessionCode}
              </span>
              <button
                type="button"
                onClick={initSoloMode}
                className="text-xs hover:opacity-80 ml-1"
                style={{ color: 'var(--color-fog)' }}
                title="Stop session"
              >
                ✕
              </button>
            </div>
          ) : (
            <Button variant="secondary" size="sm" onClick={initGMSession}>
              ▶ Start Session
            </Button>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleAddCharacter}
            disabled={!sessionCode}
            title={!sessionCode ? 'Start a session first' : undefined}
          >
            + Add Character
          </Button>
          {campaign && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => useCampaignStore.getState().updateCampaign(campaign.id, {
                currentSessionNumber: campaign.currentSessionNumber + 1,
              })}
            >
              New Session →
            </Button>
          )}
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex" style={{ borderBottom: '1px solid var(--color-storm-mid)' }}>
        {([['party', 'Party'], ['notes', 'Session Notes']] as const).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className="px-4 py-2.5 text-sm font-medium"
            style={{
              color: activeTab === key ? 'var(--color-gold-bright)' : 'var(--color-fog)',
              borderBottom: activeTab === key ? '2px solid var(--color-gold)' : '2px solid transparent',
              background: 'transparent',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'party' && (
          <div className="flex flex-col gap-4">
            {/* Party grid */}
            {partyChars.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm mb-4" style={{ color: 'var(--color-fog)' }}>
                  No characters in the campaign yet.
                </p>
                <Button
                  variant="primary"
                  onClick={handleAddCharacter}
                  disabled={!sessionCode}
                  title={!sessionCode ? 'Start a session first' : undefined}
                >
                  Create First Character
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {partyChars.map(char => (
                  <CharacterCardWrapper
                    key={char.id}
                    character={char}
                    onDrillDown={() => setDrillDownCharId(char.id)}
                    onLevelUp={() => setLevelUpCharId(char.id)}
                  />
                ))}
              </div>
            )}

            {/* Characters not in campaign (orphaned) */}
            {allChars.filter(c => !campaignCharIds.includes(c.id)).length > 0 && (
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--color-storm-light)' }}>
                  Other Characters
                </h3>
                <div className="flex flex-col gap-2">
                  {allChars
                    .filter(c => !campaignCharIds.includes(c.id))
                    .map(char => (
                      <div key={char.id} className="flex items-center gap-2 p-2 rounded" style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}>
                        <span className="text-sm flex-1" style={{ color: 'var(--color-pale)' }}>{char.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleEnsureCampaign()
                            const campaignId = activeCampaignId ?? useCampaignStore.getState().activeCampaignId
                            if (campaignId) addCharacterToCampaign(campaignId, char.id)
                          }}
                        >
                          Add to Campaign
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && campaign && (
          <SessionNotes
            notes={campaign.sessionNotes}
            currentSessionNumber={campaign.currentSessionNumber}
            onAdd={content => addSessionNote(campaign.id, content)}
            onUpdate={(id, content) => updateSessionNote(campaign.id, id, content)}
            onRemove={id => removeSessionNote(campaign.id, id)}
          />
        )}

        {activeTab === 'notes' && !campaign && (
          <div className="text-center py-12">
            <p className="text-sm mb-4" style={{ color: 'var(--color-fog)' }}>
              Create a campaign to keep session notes.
            </p>
            <Button variant="primary" onClick={() => addCampaign()}>
              Create Campaign
            </Button>
          </div>
        )}
      </div>

      {/* Character Drill-down slide-over */}
      {drillChar && (
        <Modal open={!!drillChar} onClose={() => setDrillDownCharId(null)} width="860px">
          <div style={{ height: '85vh' }}>
            <CharacterSheet character={drillChar} readOnly={false} />
          </div>
        </Modal>
      )}

      {/* Level-up modal */}
      {levelUpChar && (
        <LevelUpModal
          open={!!levelUpChar}
          character={levelUpChar}
          onClose={() => setLevelUpCharId(null)}
          onApply={updated => {
            applyUpdatedCharacter(updated)
            setLevelUpCharId(null)
          }}
        />
      )}
    </div>
  )
}

// Wrapper to get derived stats per card
function CharacterCardWrapper({
  character,
  onDrillDown,
  onLevelUp,
}: {
  character: Character
  onDrillDown: () => void
  onLevelUp: () => void
}) {
  const derived = useDerivedStats(character)
  return (
    <div className="flex flex-col gap-1">
      <CharacterCard character={character} derived={derived} onClick={onDrillDown} />
      <Button variant="ghost" size="sm" onClick={onLevelUp}>
        Level Up
      </Button>
    </div>
  )
}
