import type { TurnPhase } from '@/types/combat'

interface RoundCounterProps {
  roundNumber: number
  currentPhase: TurnPhase
}

const PHASE_LABELS: Record<TurnPhase, string> = {
  'fast-pc': 'Fast PC',
  'fast-npc': 'Fast NPC',
  'slow-pc': 'Slow PC',
  'slow-npc': 'Slow NPC',
}

const PHASE_ORDER: TurnPhase[] = ['fast-pc', 'fast-npc', 'slow-pc', 'slow-npc']

export function RoundCounter({ roundNumber, currentPhase }: RoundCounterProps) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-lg"
      style={{ background: 'var(--color-deep-storm)', border: '1px solid var(--color-storm-mid)' }}
    >
      <div className="flex items-center gap-3">
        <span className="text-xs uppercase tracking-widest" style={{ color: 'var(--color-fog)' }}>
          Round
        </span>
        <span className="text-2xl font-bold" style={{ color: 'var(--color-gold-bright)' }}>
          {roundNumber}
        </span>
      </div>

      {/* Phase bar */}
      <div className="flex gap-1">
        {PHASE_ORDER.map(phase => (
          <div
            key={phase}
            className="px-2.5 py-1 rounded text-xs font-medium"
            style={{
              background: phase === currentPhase ? 'var(--color-stormlight)' : 'var(--color-storm)',
              border: `1px solid ${phase === currentPhase ? 'var(--color-stormlight)' : 'var(--color-storm-light)'}`,
              color: phase === currentPhase ? '#fff' : 'var(--color-fog)',
            }}
          >
            {PHASE_LABELS[phase]}
          </div>
        ))}
      </div>
    </div>
  )
}
