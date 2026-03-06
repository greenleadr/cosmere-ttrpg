import { useRef, useState } from 'react'
import { useCharacterStore } from '@/store/characterStore'
import { useCampaignStore } from '@/store/campaignStore'
import { useAdversaryStore } from '@/store/adversaryStore'
import { buildExportBundle, downloadJSON, parseImportBundle } from '@/utils/exportImport'
import { Button } from '@/components/ui/Button'

export function SettingsPage() {
  const charStore = useCharacterStore()
  const campaignStore = useCampaignStore()
  const adversaryStore = useAdversaryStore()

  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState(false)

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
