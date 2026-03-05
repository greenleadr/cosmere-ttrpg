import { SKILLS, getSkillRankCap } from '@/constants/skills'
import type { DerivedStats } from '@/types/character'
import { NumberStepper } from '@/components/ui/NumberStepper'
import { Tooltip } from '@/components/ui/Tooltip'

interface SkillsPanelProps {
  derived: DerivedStats
  level: number
  isRadiant: boolean
  unlockedSurgePaths: string[]
  readOnly?: boolean
  onRanksChange?: (skillId: string, ranks: number) => void
}

export function SkillsPanel({
  derived,
  level,
  isRadiant,
  unlockedSurgePaths,
  readOnly = false,
  onRanksChange,
}: SkillsPanelProps) {
  const rankCap = getSkillRankCap(level)
  const visibleSkills = SKILLS.filter(s => {
    if (!s.isSurge) return true
    if (!isRadiant) return false
    if (!s.unlockPath) return false
    return unlockedSurgePaths.includes(s.unlockPath)
  })

  const categories = [
    { label: 'Physical', filter: (id: string) => {
      const sk = SKILLS.find(s => s.id === id)
      return sk?.category === 'physical'
    }},
    { label: 'Cognitive', filter: (id: string) => {
      const sk = SKILLS.find(s => s.id === id)
      return sk?.category === 'cognitive'
    }},
    { label: 'Spiritual', filter: (id: string) => {
      const sk = SKILLS.find(s => s.id === id)
      return sk?.category === 'spiritual'
    }},
  ]

  if (isRadiant && unlockedSurgePaths.length > 0) {
    categories.push({
      label: 'Surge Skills',
      filter: (id: string) => {
        const sk = SKILLS.find(s => s.id === id)
        return sk?.category === 'surge'
      },
    })
  }

  return (
    <div
      className="rounded-lg p-4"
      style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: 'var(--color-gold)' }}>
          Skills
        </h3>
        <span className="text-xs" style={{ color: 'var(--color-fog)' }}>
          Rank cap: {rankCap}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {categories.map(cat => (
          <div key={cat.label}>
            <div
              className="text-xs uppercase tracking-wider mb-2 pb-1"
              style={{ color: 'var(--color-gold-dim)', borderBottom: '1px solid var(--color-storm-mid)' }}
            >
              {cat.label}
            </div>
            <div className="flex flex-col gap-1.5">
              {visibleSkills
                .filter(s => cat.filter(s.id))
                .map(skillDef => {
                  const entry = derived.skills[skillDef.id]
                  if (!entry) return null
                  return (
                    <Tooltip key={skillDef.id} content={skillDef.ruleTooltip}>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-xs flex-1 truncate"
                          style={{ color: 'var(--color-pale)' }}
                        >
                          {skillDef.name}
                        </span>
                        {readOnly ? (
                          <span
                            className="text-sm font-mono font-bold w-8 text-right derived-field px-1 rounded"
                            style={{ color: 'var(--color-stormlight)' }}
                          >
                            {entry.total}
                          </span>
                        ) : (
                          <>
                            <NumberStepper
                              value={entry.ranks}
                              min={0}
                              max={rankCap}
                              onChange={v => onRanksChange?.(skillDef.id, v)}
                              size="sm"
                            />
                            <Tooltip
                              content={`Modifier = ${entry.ranks} ranks + ${entry.attributeBonus} (${skillDef.governingAttribute.toUpperCase()}) = ${entry.total}`}
                            >
                              <span
                                className="text-sm font-mono font-bold w-6 text-right derived-field px-1 rounded cursor-default"
                                style={{ color: 'var(--color-stormlight)' }}
                              >
                                {entry.total}
                              </span>
                            </Tooltip>
                          </>
                        )}
                      </div>
                    </Tooltip>
                  )
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
