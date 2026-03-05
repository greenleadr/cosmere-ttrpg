import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { nanoid } from 'nanoid'
import type {
  Character,
  AttributeKey,
  ActiveCondition,
  InjuryEntry,
  TalentEntry,
  ExpertiseEntry,
  WeaponEntry,
  ArmourEntry,
  EquipmentEntry,
  GoalEntry,
  ConnectionEntry,
} from '@/types/character'
import { SKILLS } from '@/constants/skills'

export function createDefaultCharacter(overrides?: Partial<Character>): Character {
  const now = Date.now()
  return {
    id: nanoid(10),
    schemaVersion: 1,
    name: 'New Character',
    playerName: '',
    level: 1,
    ancestry: 'Human',
    cultures: [],
    heroicPaths: [],
    radiantPath: null,
    isRadiant: false,
    occupation: '',
    appearanceNotes: '',
    attributes: { str: 1, spd: 1, int: 1, wil: 1, awa: 1, pre: 1 },
    skills: SKILLS.map(s => ({ skillId: s.id, ranks: 0 })),
    expertises: [],
    talents: [],
    weapons: [],
    armour: [],
    equipment: [],
    currency: { broams: 0, marks: 0, chips: 0 },
    defenseOverrides: { physicalBonus: 0, cognitiveBonus: 0, spiritualBonus: 0 },
    investitureMax: 10,
    focusBonus: 0,
    resources: { healthCurrent: 11, focusCurrent: 2, investitureCurrent: 0 },
    activeConditions: [],
    injuries: [],
    activeSingerForm: null,
    goals: [],
    connections: [],
    rewards: '',
    levelHistory: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

interface CharacterState {
  characters: Record<string, Character>
  activeCharacterId: string | null

  // CRUD
  addCharacter: (char?: Partial<Character>) => string
  removeCharacter: (id: string) => void
  setActiveCharacter: (id: string) => void

  // Identity
  updateMeta: (id: string, updates: Partial<Pick<Character,
    'name' | 'playerName' | 'level' | 'ancestry' | 'cultures' |
    'heroicPaths' | 'radiantPath' | 'isRadiant' | 'occupation' | 'appearanceNotes' |
    'rewards' | 'focusBonus' | 'investitureMax'
  >>) => void

  // Attributes
  setAttribute: (id: string, key: AttributeKey, value: number) => void

  // Defense overrides
  setDefenseOverride: (id: string, key: 'physicalBonus' | 'cognitiveBonus' | 'spiritualBonus', value: number) => void

  // Skills
  setSkillRanks: (id: string, skillId: string, ranks: number) => void

  // Resources
  setHealthCurrent: (id: string, value: number) => void
  setFocusCurrent: (id: string, value: number) => void
  setInvestitureCurrent: (id: string, value: number) => void

  // Conditions
  addCondition: (id: string, condition: ActiveCondition) => void
  removeCondition: (id: string, conditionId: string) => void
  updateExhaustedStacks: (id: string, stacks: number) => void

  // Injuries
  addInjury: (id: string, injury: Omit<InjuryEntry, 'id' | 'createdAt'>) => void
  removeInjury: (id: string, injuryId: string) => void
  updateInjury: (id: string, injuryId: string, updates: Partial<InjuryEntry>) => void

  // Talents
  addTalent: (id: string, talent: Omit<TalentEntry, 'id'>) => void
  removeTalent: (id: string, talentId: string) => void
  updateTalent: (id: string, talentId: string, updates: Partial<TalentEntry>) => void

  // Expertises
  addExpertise: (id: string, expertise: Omit<ExpertiseEntry, 'id'>) => void
  removeExpertise: (id: string, expertiseId: string) => void
  updateExpertise: (id: string, expertiseId: string, updates: Partial<ExpertiseEntry>) => void

  // Equipment
  addWeapon: (id: string, weapon: Omit<WeaponEntry, 'id'>) => void
  removeWeapon: (id: string, weaponId: string) => void
  addArmour: (id: string, armour: Omit<ArmourEntry, 'id'>) => void
  removeArmour: (id: string, armourId: string) => void
  toggleArmourEquipped: (id: string, armourId: string) => void
  addEquipment: (id: string, item: Omit<EquipmentEntry, 'id'>) => void
  removeEquipment: (id: string, itemId: string) => void

  // Currency
  setCurrency: (id: string, currency: Partial<Character['currency']>) => void

  // Singer form
  setSingerForm: (id: string, formId: string | null) => void

  // Goals & connections
  addGoal: (id: string, goal: Omit<GoalEntry, 'id'>) => void
  removeGoal: (id: string, goalId: string) => void
  addConnection: (id: string, conn: Omit<ConnectionEntry, 'id'>) => void
  removeConnection: (id: string, connId: string) => void

  // Level-up (applied by levelUpEngine)
  applyUpdatedCharacter: (updated: Character) => void
}

export const useCharacterStore = create<CharacterState>()(
  immer((set) => ({
    characters: {},
    activeCharacterId: null,

    addCharacter: (overrides) => {
      const char = createDefaultCharacter(overrides)
      set(state => {
        state.characters[char.id] = char
        if (!state.activeCharacterId) state.activeCharacterId = char.id
      })
      return char.id
    },

    removeCharacter: (id) => set(state => {
      delete state.characters[id]
      if (state.activeCharacterId === id) {
        const remaining = Object.keys(state.characters)
        state.activeCharacterId = remaining[0] ?? null
      }
    }),

    setActiveCharacter: (id) => set(state => { state.activeCharacterId = id }),

    updateMeta: (id, updates) => set(state => {
      const c = state.characters[id]
      if (!c) return
      Object.assign(c, updates)
      c.updatedAt = Date.now()
    }),

    setAttribute: (id, key, value) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.attributes[key] = value
      c.updatedAt = Date.now()
    }),

    setDefenseOverride: (id, key, value) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.defenseOverrides[key] = value
      c.updatedAt = Date.now()
    }),

    setSkillRanks: (id, skillId, ranks) => set(state => {
      const c = state.characters[id]
      if (!c) return
      const skill = c.skills.find(s => s.skillId === skillId)
      if (skill) {
        skill.ranks = ranks
      } else {
        c.skills.push({ skillId, ranks })
      }
      c.updatedAt = Date.now()
    }),

    setHealthCurrent: (id, value) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.resources.healthCurrent = Math.max(0, value)
      c.updatedAt = Date.now()
    }),

    setFocusCurrent: (id, value) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.resources.focusCurrent = Math.max(0, value)
      c.updatedAt = Date.now()
    }),

    setInvestitureCurrent: (id, value) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.resources.investitureCurrent = Math.max(0, value)
      c.updatedAt = Date.now()
    }),

    addCondition: (id, condition) => set(state => {
      const c = state.characters[id]
      if (!c) return
      const exists = c.activeConditions.find(ac => ac.conditionId === condition.conditionId)
      if (!exists) {
        c.activeConditions.push(condition)
        c.updatedAt = Date.now()
      }
    }),

    removeCondition: (id, conditionId) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.activeConditions = c.activeConditions.filter(ac => ac.conditionId !== conditionId)
      c.updatedAt = Date.now()
    }),

    updateExhaustedStacks: (id, stacks) => set(state => {
      const c = state.characters[id]
      if (!c) return
      const cond = c.activeConditions.find(ac => ac.conditionId === 'exhausted')
      if (cond) {
        cond.stacks = stacks
      } else if (stacks > 0) {
        c.activeConditions.push({ conditionId: 'exhausted', stacks })
      }
      c.updatedAt = Date.now()
    }),

    addInjury: (id, injury) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.injuries.push({ ...injury, id: nanoid(8), createdAt: Date.now() })
      c.updatedAt = Date.now()
    }),

    removeInjury: (id, injuryId) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.injuries = c.injuries.filter(i => i.id !== injuryId)
      c.updatedAt = Date.now()
    }),

    updateInjury: (id, injuryId, updates) => set(state => {
      const c = state.characters[id]
      if (!c) return
      const injury = c.injuries.find(i => i.id === injuryId)
      if (injury) Object.assign(injury, updates)
      c.updatedAt = Date.now()
    }),

    addTalent: (id, talent) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.talents.push({ ...talent, id: nanoid(8) })
      c.updatedAt = Date.now()
    }),

    removeTalent: (id, talentId) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.talents = c.talents.filter(t => t.id !== talentId)
      c.updatedAt = Date.now()
    }),

    updateTalent: (id, talentId, updates) => set(state => {
      const c = state.characters[id]
      if (!c) return
      const talent = c.talents.find(t => t.id === talentId)
      if (talent) Object.assign(talent, updates)
      c.updatedAt = Date.now()
    }),

    addExpertise: (id, expertise) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.expertises.push({ ...expertise, id: nanoid(8) })
      c.updatedAt = Date.now()
    }),

    removeExpertise: (id, expertiseId) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.expertises = c.expertises.filter(e => e.id !== expertiseId)
      c.updatedAt = Date.now()
    }),

    updateExpertise: (id, expertiseId, updates) => set(state => {
      const c = state.characters[id]
      if (!c) return
      const exp = c.expertises.find(e => e.id === expertiseId)
      if (exp) Object.assign(exp, updates)
      c.updatedAt = Date.now()
    }),

    addWeapon: (id, weapon) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.weapons.push({ ...weapon, id: nanoid(8) })
      c.updatedAt = Date.now()
    }),

    removeWeapon: (id, weaponId) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.weapons = c.weapons.filter(w => w.id !== weaponId)
      c.updatedAt = Date.now()
    }),

    addArmour: (id, armour) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.armour.push({ ...armour, id: nanoid(8) })
      c.updatedAt = Date.now()
    }),

    removeArmour: (id, armourId) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.armour = c.armour.filter(a => a.id !== armourId)
      c.updatedAt = Date.now()
    }),

    toggleArmourEquipped: (id, armourId) => set(state => {
      const c = state.characters[id]
      if (!c) return
      const a = c.armour.find(a => a.id === armourId)
      if (a) a.isEquipped = !a.isEquipped
      c.updatedAt = Date.now()
    }),

    addEquipment: (id, item) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.equipment.push({ ...item, id: nanoid(8) })
      c.updatedAt = Date.now()
    }),

    removeEquipment: (id, itemId) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.equipment = c.equipment.filter(e => e.id !== itemId)
      c.updatedAt = Date.now()
    }),

    setCurrency: (id, currency) => set(state => {
      const c = state.characters[id]
      if (!c) return
      Object.assign(c.currency, currency)
      c.updatedAt = Date.now()
    }),

    setSingerForm: (id, formId) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.activeSingerForm = formId
      c.updatedAt = Date.now()
    }),

    addGoal: (id, goal) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.goals.push({ ...goal, id: nanoid(8) })
      c.updatedAt = Date.now()
    }),

    removeGoal: (id, goalId) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.goals = c.goals.filter(g => g.id !== goalId)
      c.updatedAt = Date.now()
    }),

    addConnection: (id, conn) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.connections.push({ ...conn, id: nanoid(8) })
      c.updatedAt = Date.now()
    }),

    removeConnection: (id, connId) => set(state => {
      const c = state.characters[id]
      if (!c) return
      c.connections = c.connections.filter(cn => cn.id !== connId)
      c.updatedAt = Date.now()
    }),

    applyUpdatedCharacter: (updated) => set(state => {
      state.characters[updated.id] = updated
    }),
  })),
)
