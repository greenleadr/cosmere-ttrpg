export interface ConditionDefinition {
  id: string
  name: string
  isStacking: boolean   // only Exhausted is stacking
  color: string         // CSS color token for badge
  ruleTooltip: string
}

export const CONDITIONS: ConditionDefinition[] = [
  {
    id: 'blinded',
    name: 'Blinded',
    isStacking: false,
    color: '#7a6020',
    ruleTooltip: 'You cannot see. You automatically fail tests requiring sight. Ranged attacks against you have advantage.',
  },
  {
    id: 'confused',
    name: 'Confused',
    isStacking: false,
    color: '#6040a0',
    ruleTooltip: 'Your actions are unpredictable. At the start of your turn, roll to determine if you act normally or randomly.',
  },
  {
    id: 'dazed',
    name: 'Dazed',
    isStacking: false,
    color: '#204080',
    ruleTooltip: 'You lose 1 action on your turn.',
  },
  {
    id: 'disoriented',
    name: 'Disoriented',
    isStacking: false,
    color: '#403060',
    ruleTooltip: 'You suffer a −2 penalty to all tests and defenses.',
  },
  {
    id: 'exhausted',
    name: 'Exhausted',
    isStacking: true,
    color: '#803020',
    ruleTooltip: 'Each stack of Exhausted [−N] imposes a −N penalty to all tests and defenses. At [−10] or lower, you die.',
  },
  {
    id: 'frightened',
    name: 'Frightened',
    isStacking: false,
    color: '#602040',
    ruleTooltip: 'You must move away from the source of your fear. You cannot willingly move closer to it.',
  },
  {
    id: 'grabbed',
    name: 'Grabbed',
    isStacking: false,
    color: '#406020',
    ruleTooltip: 'Your speed becomes 0. You cannot move unless you break the grab.',
  },
  {
    id: 'immobilized',
    name: 'Immobilized',
    isStacking: false,
    color: '#503010',
    ruleTooltip: 'Your speed becomes 0 and you cannot take movement actions.',
  },
  {
    id: 'invisible',
    name: 'Invisible',
    isStacking: false,
    color: '#304050',
    ruleTooltip: 'You cannot be seen. Attacks against you are made at disadvantage.',
  },
  {
    id: 'obscured',
    name: 'Obscured',
    isStacking: false,
    color: '#384050',
    ruleTooltip: 'You are partially hidden. Attackers suffer a −2 penalty to hit you.',
  },
  {
    id: 'prone',
    name: 'Prone',
    isStacking: false,
    color: '#503820',
    ruleTooltip: 'You are on the ground. Ranged attacks against you have disadvantage; melee attacks have advantage.',
  },
  {
    id: 'slowed',
    name: 'Slowed',
    isStacking: false,
    color: '#305040',
    ruleTooltip: 'Your movement rate is halved.',
  },
  {
    id: 'stunned',
    name: 'Stunned',
    isStacking: false,
    color: '#c04020',
    ruleTooltip: 'You lose all actions and reactions on your turn.',
  },
  {
    id: 'surprised',
    name: 'Surprised',
    isStacking: false,
    color: '#804010',
    ruleTooltip: 'On your first turn, you lose 1 action and cannot use reactions.',
  },
  {
    id: 'unconscious',
    name: 'Unconscious',
    isStacking: false,
    color: '#202030',
    ruleTooltip: 'You are incapacitated. You cannot take actions, reactions, or move. You are also Prone.',
  },
]

export function getConditionById(id: string): ConditionDefinition | undefined {
  return CONDITIONS.find(c => c.id === id)
}
