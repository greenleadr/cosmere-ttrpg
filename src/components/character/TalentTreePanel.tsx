import type { Character } from '@/types/character'
import { HEROIC_PATH_TREES } from '@/constants/talentTrees'
import type { TalentNode, HeroicPathTree } from '@/constants/talentTrees'
import { useCharacterStore } from '@/store/characterStore'

interface TalentTreePanelProps {
  character: Character
  readOnly?: boolean
}

const ACTIVATION_LABELS: Record<string, string> = {
  'action': 'Action',
  'reaction': 'Reaction',
  'free-action': 'Free Action',
  'always-active': 'Passive',
  'special': 'Special',
}

const ACTIVATION_COLORS: Record<string, string> = {
  'action': 'var(--color-gold)',
  'reaction': 'var(--color-stormlight)',
  'free-action': '#6bbf6b',
  'always-active': 'var(--color-fog)',
  'special': '#c97ef0',
}

function TalentCard({
  talent,
  isAcquired,
  prerequisitesMet,
  readOnly,
  onAcquire,
  onRemove,
}: {
  talent: TalentNode
  isAcquired: boolean
  prerequisitesMet: boolean
  readOnly: boolean
  onAcquire: () => void
  onRemove: () => void
}) {
  const dim = !isAcquired && !prerequisitesMet

  return (
    <div
      className="rounded p-3 flex flex-col gap-1.5 transition-all"
      style={{
        background: isAcquired ? 'rgba(212,160,23,0.12)' : 'var(--color-storm)',
        border: `1px solid ${isAcquired ? 'var(--color-gold)' : 'var(--color-storm-light)'}`,
        opacity: dim ? 0.45 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-sm font-semibold leading-tight"
          style={{ color: isAcquired ? 'var(--color-gold-bright)' : 'var(--color-pale)' }}
        >
          {talent.name}
        </span>
        <span
          className="text-xs px-1.5 py-0.5 rounded shrink-0"
          style={{
            background: 'var(--color-storm-mid)',
            color: ACTIVATION_COLORS[talent.activationType] ?? 'var(--color-fog)',
          }}
        >
          {ACTIVATION_LABELS[talent.activationType] ?? talent.activationType}
        </span>
      </div>

      {talent.prerequisites.length > 0 && (
        <p className="text-xs" style={{ color: 'var(--color-fog)' }}>
          Requires: {talent.prerequisites.join(', ')}
        </p>
      )}

      <p className="text-xs leading-relaxed" style={{ color: 'var(--color-pale)' }}>
        {talent.description}
      </p>

      {!readOnly && (
        <div className="mt-1">
          {isAcquired ? (
            <button
              type="button"
              onClick={onRemove}
              className="text-xs hover:opacity-80 transition-opacity"
              style={{ color: 'var(--color-health)' }}
            >
              Remove
            </button>
          ) : (
            <button
              type="button"
              onClick={onAcquire}
              className="text-xs px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
              style={{
                background: prerequisitesMet ? 'rgba(212,160,23,0.15)' : 'transparent',
                border: `1px solid ${prerequisitesMet ? 'var(--color-gold)' : 'var(--color-storm-light)'}`,
                color: prerequisitesMet ? 'var(--color-gold-bright)' : 'var(--color-fog)',
              }}
            >
              {prerequisitesMet ? 'Acquire' : 'Locked'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function PathTree({
  tree,
  character,
  readOnly,
}: {
  tree: HeroicPathTree
  character: Character
  readOnly: boolean
}) {
  const store = useCharacterStore()
  const id = character.id

  const acquiredIds = new Set(character.talents.map(t => t.id))

  function isPrereqMet(talent: TalentNode): boolean {
    return talent.prerequisites.every(pid => acquiredIds.has(pid))
  }

  function handleAcquire(talent: TalentNode, specialtyName: string) {
    store.addTalent(id, {
      name: talent.name,
      source: `${tree.pathName} · ${specialtyName}`,
      activationType: talent.activationType,
      prerequisites: talent.prerequisites.join(', '),
      description: talent.description,
    })
  }

  function handleRemove(talentId: string) {
    store.removeTalent(id, talentId)
  }

  const keyAcquired = acquiredIds.has(tree.keyTalent.id)

  return (
    <div className="flex flex-col gap-6">
      {/* Flavor */}
      <p className="text-sm italic" style={{ color: 'var(--color-fog)' }}>
        {tree.flavorText}
      </p>

      {/* Key Talent */}
      <div>
        <div
          className="text-xs font-bold uppercase tracking-widest mb-2"
          style={{ color: 'var(--color-gold)' }}
        >
          Key Talent
        </div>
        <div className="max-w-sm">
          <TalentCard
            talent={tree.keyTalent}
            isAcquired={keyAcquired}
            prerequisitesMet
            readOnly={readOnly}
            onAcquire={() => handleAcquire(tree.keyTalent, 'Key Talent')}
            onRemove={() => handleRemove(tree.keyTalent.id)}
          />
        </div>
      </div>

      {/* Specialties */}
      <div>
        <div
          className="text-xs font-bold uppercase tracking-widest mb-3"
          style={{ color: 'var(--color-gold)' }}
        >
          Specialties
        </div>
        <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          {tree.specialties.map(specialty => (
            <div key={specialty.id} className="flex flex-col gap-2">
              {/* Specialty header */}
              <div
                className="px-3 py-2 rounded text-center"
                style={{
                  background: 'var(--color-deep-storm)',
                  border: '1px solid var(--color-storm-mid)',
                }}
              >
                <div className="text-sm font-bold" style={{ color: 'var(--color-stormlight)' }}>
                  {specialty.name}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--color-fog)' }}>
                  {specialty.description}
                </div>
              </div>

              {/* Talent cards */}
              {specialty.talents.map(talent => (
                <TalentCard
                  key={talent.id}
                  talent={talent}
                  isAcquired={acquiredIds.has(talent.id)}
                  prerequisitesMet={isPrereqMet(talent)}
                  readOnly={readOnly}
                  onAcquire={() => handleAcquire(talent, specialty.name)}
                  onRemove={() => handleRemove(talent.id)}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TalentTreePanel({ character, readOnly = false }: TalentTreePanelProps) {
  const paths = character.heroicPaths

  if (paths.length === 0) {
    return (
      <div
        className="rounded-lg p-6 text-center"
        style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
      >
        <p className="text-sm" style={{ color: 'var(--color-fog)' }}>
          No heroic path selected. Go to the <strong style={{ color: 'var(--color-gold)' }}>Details</strong> tab to choose a heroic path.
        </p>
      </div>
    )
  }

  // For now show the first path (multipathing deferred per user request)
  const pathName = paths[0]
  const tree = HEROIC_PATH_TREES[pathName]

  if (!tree) {
    return (
      <div
        className="rounded-lg p-6"
        style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
      >
        <p className="text-sm" style={{ color: 'var(--color-fog)' }}>
          No talent tree data found for &quot;{pathName}&quot;.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Path header */}
      <div
        className="rounded-lg px-5 py-4"
        style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
      >
        <h3
          className="text-base font-bold uppercase tracking-widest"
          style={{ color: 'var(--color-gold-bright)' }}
        >
          {tree.pathName} Path
        </h3>
        {paths.length > 1 && (
          <p className="text-xs mt-1" style={{ color: 'var(--color-fog)' }}>
            Showing primary path. Additional paths: {paths.slice(1).join(', ')}.
          </p>
        )}
      </div>

      {/* Tree content */}
      <div
        className="rounded-lg p-5"
        style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
      >
        <PathTree tree={tree} character={character} readOnly={readOnly} />
      </div>
    </div>
  )
}
