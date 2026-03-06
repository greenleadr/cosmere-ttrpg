/**
 * Schema migration pipeline.
 * Each record carries a `schemaVersion` field.
 * On load, run the migrator to bring it to the current version.
 *
 * Pattern: `type:fromVersion→toVersion`
 */

type MigrationFn = (record: Record<string, unknown>) => Record<string, unknown>

const MIGRATIONS: Record<string, MigrationFn> = {
  // Example placeholder — extend as schema evolves:
  // 'character:1→2': (r) => ({ ...r, newField: defaultValue }),
}

export const CURRENT_SCHEMA_VERSION = 1

export function migrateRecord(
  type: 'character' | 'campaign' | 'adversary' | 'encounter',
  record: Record<string, unknown>,
): Record<string, unknown> {
  let current = { ...record }
  const targetVersion = CURRENT_SCHEMA_VERSION

  while ((current.schemaVersion as number) < targetVersion) {
    const from = current.schemaVersion as number
    const key = `${type}:${from}→${from + 1}`
    const migrator = MIGRATIONS[key]
    if (migrator) {
      current = migrator(current)
    }
    current.schemaVersion = from + 1
  }

  return current
}
