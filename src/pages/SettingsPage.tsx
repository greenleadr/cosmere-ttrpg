import { useRef, useState } from 'react'
import { useCharacterStore } from '@/store/characterStore'
import { useCampaignStore } from '@/store/campaignStore'
import { useAdversaryStore } from '@/store/adversaryStore'
import { useSessionStore } from '@/store/sessionStore'
import { buildExportBundle, downloadJSON, parseImportBundle } from '@/utils/exportImport'
import { Button } from '@/components/ui/Button'

export function SettingsPage() {
  const charStore = useCharacterStore()
  const campaignStore = useCampaignStore()
  const adversaryStore = useAdversaryStore()
  const { role, sessionCode, initGMSession, initSoloMode, initPlayerSession } = useSessionStore()

  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)
  const [playerCode, setPlayerCode] = useState('')
  const [playerCharId, setPlayerCharId] = useState(
    Object.keys(charStore.characters)[0] ?? ''
  )

  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleExport() {
    const bundle = buildExportBundle(
      Object.values(charStore.characters),
      Object.values(campaignStore.campaigns),
      Object.values(adversaryStore.templates),
    )
    const dateStr = new Date().toISOString().slice(0, 10)
    downloadJSON(bundle, `cosmere-ttrpg-backup-${dateStr}.json`)
  }

  function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const bundle = parseImportBundle(reader.result as string)
        // Import characters
        for (const char of bundle.characters) {
          charStore.applyUpdatedCharacter(char)
        }
        // Import campaigns
        campaignStore.hydrate(bundle.campaigns)
        // Import adversaries
        adversaryStore.hydrate(bundle.adversaries)
        setImportSuccess(true)
        setImportError(null)
      } catch (err) {
        setImportError(err instanceof Error ? err.message : 'Import failed.')
        setImportSuccess(false)
      }
    }
    reader.readAsText(file)
    // Reset file input so same file can be re-imported
    e.target.value = ''
  }

  const sectionStyle = {
    background: 'var(--color-deep-storm)',
    border: '1px solid var(--color-storm-mid)',
  }

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: 'var(--color-void)', color: 'var(--color-pale)' }}
    >
      <div
        className="px-6 py-4"
        style={{ background: 'var(--color-deep-storm)', borderBottom: '1px solid var(--color-storm-mid)' }}
      >
        <h1 className="text-xl font-bold" style={{ color: 'var(--color-gold-bright)' }}>
          Settings
        </h1>
      </div>

      <div className="p-6 flex flex-col gap-6 max-w-2xl">
        {/* Export / Import */}
        <section className="rounded-lg p-5" style={sectionStyle}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--color-gold)' }}>
            Data Export & Import
          </h2>

          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm mb-2" style={{ color: 'var(--color-fog)' }}>
                Export all characters, campaigns, and adversary templates as a JSON backup file.
              </p>
              <Button variant="primary" onClick={handleExport}>
                Export All Data
              </Button>
            </div>

            <div style={{ borderTop: '1px solid var(--color-storm-mid)', paddingTop: '16px' }}>
              <p className="text-sm mb-2" style={{ color: 'var(--color-fog)' }}>
                Import from a previously exported backup. Existing records with the same ID will be overwritten.
              </p>
              <input
                type="file"
                accept=".json,application/json"
                ref={fileInputRef}
                onChange={handleImportFile}
                className="hidden"
              />
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                Import from File
              </Button>

              {importSuccess && (
                <p className="text-sm mt-2" style={{ color: 'var(--color-stormlight)' }}>
                  ✓ Import successful.
                </p>
              )}
              {importError && (
                <p className="text-sm mt-2" style={{ color: 'var(--color-health)' }}>
                  ✕ {importError}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Session Linking */}
        <section className="rounded-lg p-5" style={sectionStyle}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-gold)' }}>
            Session Linking
          </h2>
          <p className="text-xs mb-4" style={{ color: 'var(--color-fog)' }}>
            Link your browser tab to a GM session (same device) using BroadcastChannel. The GM broadcasts all
            character states; players can see GM-controlled views in their own tab.
          </p>

          {/* Current role */}
          <div
            className="mb-4 px-3 py-2 rounded flex items-center gap-2"
            style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)' }}
          >
            <span className="text-xs" style={{ color: 'var(--color-fog)' }}>Current Role:</span>
            <span className="text-sm font-bold capitalize" style={{ color: 'var(--color-gold-bright)' }}>
              {role}
            </span>
            {sessionCode && (
              <>
                <span className="text-xs" style={{ color: 'var(--color-fog)' }}>· Code:</span>
                <span className="text-sm font-mono font-bold" style={{ color: 'var(--color-stormlight)' }}>
                  {sessionCode}
                </span>
              </>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {/* Solo mode */}
            <Button
              variant={role === 'solo' ? 'primary' : 'ghost'}
              onClick={initSoloMode}
            >
              Solo Mode (no linking)
            </Button>

            {/* GM mode */}
            <Button
              variant={role === 'gm' ? 'primary' : 'secondary'}
              onClick={initGMSession}
            >
              Start GM Session
            </Button>
            {role === 'gm' && sessionCode && (
              <p className="text-xs" style={{ color: 'var(--color-fog)' }}>
                Share code <strong style={{ color: 'var(--color-stormlight)' }}>{sessionCode}</strong> with
                players so they can link their tabs.
              </p>
            )}

            {/* Player mode */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-medium" style={{ color: 'var(--color-fog)' }}>
                Join as Player
              </p>
              <div className="flex gap-2 flex-wrap">
                <input
                  type="text"
                  value={playerCode}
                  onChange={e => setPlayerCode(e.target.value)}
                  placeholder="Session code"
                  className="text-sm rounded px-2.5 py-1.5"
                  style={{
                    background: 'var(--color-storm)',
                    border: '1px solid var(--color-storm-light)',
                    color: 'var(--color-pale)',
                    outline: 'none',
                    width: 120,
                  }}
                />
                <select
                  value={playerCharId}
                  onChange={e => setPlayerCharId(e.target.value)}
                  className="text-sm rounded px-2 py-1.5"
                  style={{
                    background: 'var(--color-storm)',
                    border: '1px solid var(--color-storm-light)',
                    color: 'var(--color-pale)',
                    flex: 1,
                  }}
                >
                  {Object.values(charStore.characters).map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={!playerCode.trim() || !playerCharId}
                  onClick={() => initPlayerSession(playerCode.trim(), playerCharId)}
                >
                  Join
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Data summary */}
        <section className="rounded-lg p-5" style={sectionStyle}>
          <h2 className="text-sm font-bold uppercase tracking-widest mb-3" style={{ color: 'var(--color-gold)' }}>
            Data Summary
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              ['Characters', Object.keys(charStore.characters).length],
              ['Campaigns', Object.keys(campaignStore.campaigns).length],
              ['Adversaries', Object.keys(adversaryStore.templates).length],
            ].map(([label, count]) => (
              <div
                key={label}
                className="flex flex-col items-center p-3 rounded"
                style={{ background: 'var(--color-storm)', border: '1px solid var(--color-storm-light)' }}
              >
                <span className="text-2xl font-bold" style={{ color: 'var(--color-gold-bright)' }}>
                  {count}
                </span>
                <span className="text-xs" style={{ color: 'var(--color-fog)' }}>{label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
