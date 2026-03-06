/**
 * Heroic path talent trees for the Cosmere RPG (Stormlight Handbook).
 * Structure: each path has one Key Talent and three Specialties,
 * each specialty containing 4 talents.
 */

export type ActivationType = 'action' | 'reaction' | 'free-action' | 'always-active' | 'special'

export interface TalentNode {
  id: string
  name: string
  activationType: ActivationType
  prerequisites: string[]   // ids of talents that must be acquired first
  description: string
}

export interface PathSpecialty {
  id: string
  name: string
  description: string
  talents: TalentNode[]
}

export interface HeroicPathTree {
  pathName: string
  flavorText: string
  keyTalent: TalentNode
  specialties: PathSpecialty[]
}

// ─── AGENT ───────────────────────────────────────────────────────────────────

const AGENT: HeroicPathTree = {
  pathName: 'Agent',
  flavorText: 'Spies, infiltrators, and covert operatives. Agents move unseen, learn secrets, and strike without warning.',
  keyTalent: {
    id: 'agent-operative',
    name: 'Operative',
    activationType: 'always-active',
    prerequisites: [],
    description: 'You are trained in covert operations. You gain +1 to Stealth and Thievery tests. This unlocks the Infiltrator, Saboteur, and Spy specialties.',
  },
  specialties: [
    {
      id: 'agent-infiltrator',
      name: 'Infiltrator',
      description: 'Masters of disguise and social deception.',
      talents: [
        {
          id: 'agent-social-camouflage',
          name: 'Social Camouflage',
          activationType: 'always-active',
          prerequisites: ['agent-operative'],
          description: 'You blend into unfamiliar social situations naturally. You may make a Deception test to appear as though you belong in any setting. On a success, NPCs do not question your presence.',
        },
        {
          id: 'agent-master-of-disguise',
          name: 'Master of Disguise',
          activationType: 'action',
          prerequisites: ['agent-operative'],
          description: 'You can don or create a convincing disguise in minutes rather than hours. While disguised, you have advantage on Deception tests to maintain the disguise.',
        },
        {
          id: 'agent-social-mimic',
          name: 'Social Mimic',
          activationType: 'special',
          prerequisites: ['agent-social-camouflage'],
          description: 'After observing a person for at least 10 minutes, you can mimic their mannerisms, speech, and social behaviors. Characters who know the target must succeed on an opposed Insight vs. your Deception to see through it.',
        },
        {
          id: 'agent-assumed-identity',
          name: 'Assumed Identity',
          activationType: 'always-active',
          prerequisites: ['agent-master-of-disguise'],
          description: 'You have prepared a fully-documented false identity with papers, contacts, and backstory. You cannot be identified as your true self through normal investigation while using this identity.',
        },
      ],
    },
    {
      id: 'agent-saboteur',
      name: 'Saboteur',
      description: 'Specialists in disabling, disrupting, and destroying from the shadows.',
      talents: [
        {
          id: 'agent-disable-device',
          name: 'Disable Device',
          activationType: 'action',
          prerequisites: ['agent-operative'],
          description: 'You can disable mechanical devices, fabrials, or traps with a Thievery test against a difficulty set by the GM. On a success, the device is rendered non-functional until repaired.',
        },
        {
          id: 'agent-sabotage',
          name: 'Sabotage',
          activationType: 'action',
          prerequisites: ['agent-disable-device'],
          description: 'When sabotaging a device or structure, you can set it to fail at a specific trigger of your choosing — after a number of uses, at a certain time, or under specific conditions — rather than immediately.',
        },
        {
          id: 'agent-exploit-weakness',
          name: 'Exploit Weakness',
          activationType: 'free-action',
          prerequisites: ['agent-operative'],
          description: 'You instinctively identify structural weaknesses in objects, fabrials, and defenses. When attacking or manipulating a constructed object or device, you ignore its Deflect value.',
        },
        {
          id: 'agent-strike-and-vanish',
          name: 'Strike and Vanish',
          activationType: 'reaction',
          prerequisites: ['agent-exploit-weakness'],
          description: 'Immediately after making a successful attack, you can make a Stealth test as a reaction. On a success, you become hidden until the start of your next turn.',
        },
      ],
    },
    {
      id: 'agent-spy',
      name: 'Spy',
      description: 'Information brokers and network builders who deal in secrets.',
      talents: [
        {
          id: 'agent-ear-to-ground',
          name: 'Ear to the Ground',
          activationType: 'always-active',
          prerequisites: ['agent-operative'],
          description: 'In any settlement you have spent at least one day in, you can make an Awareness test to learn the current rumors, notable factions, power players, and unusual events.',
        },
        {
          id: 'agent-read-the-room',
          name: 'Read the Room',
          activationType: 'free-action',
          prerequisites: ['agent-operative'],
          description: 'At the start of any social encounter, you may make an Insight test as a free action to discern the general emotional state and immediate goals of up to three participants.',
        },
        {
          id: 'agent-shadow-tail',
          name: 'Shadow Tail',
          activationType: 'action',
          prerequisites: ['agent-read-the-room'],
          description: 'You can follow a target through a crowd undetected. Make a Stealth test opposed by their Perception. On a success, you shadow them undetected for up to one hour.',
        },
        {
          id: 'agent-dead-drop',
          name: 'Dead Drop',
          activationType: 'special',
          prerequisites: ['agent-ear-to-ground'],
          description: 'You maintain a network of hidden contacts and dead-drop locations. Once per session, you may request specific information or a small service from your network. The GM determines availability and reliability.',
        },
      ],
    },
  ],
}

// ─── ENVOY ───────────────────────────────────────────────────────────────────

const ENVOY: HeroicPathTree = {
  pathName: 'Envoy',
  flavorText: 'Diplomats, negotiators, and agitators. Envoys shape opinion, open doors, and move nations through words alone.',
  keyTalent: {
    id: 'envoy-diplomat',
    name: 'Diplomat',
    activationType: 'always-active',
    prerequisites: [],
    description: 'You are a skilled intermediary and voice of reason. You gain +1 to Persuasion and Insight tests. This unlocks the Ambassador, Negotiator, and Agitator specialties.',
  },
  specialties: [
    {
      id: 'envoy-ambassador',
      name: 'Ambassador',
      description: 'Cultural liaisons who open doors across borders and social strata.',
      talents: [
        {
          id: 'envoy-cultural-attunement',
          name: 'Cultural Attunement',
          activationType: 'always-active',
          prerequisites: ['envoy-diplomat'],
          description: 'Your understanding of other cultures is deep and instinctive. You never suffer disadvantage on social tests due to cultural misunderstandings, unfamiliar customs, or language barriers.',
        },
        {
          id: 'envoy-open-doors',
          name: 'Open Doors',
          activationType: 'special',
          prerequisites: ['envoy-diplomat'],
          description: 'Your reputation and connections precede you. In any major settlement, you can request an audience with local leaders or officials without needing to establish credentials. The GM determines timing.',
        },
        {
          id: 'envoy-formal-address',
          name: 'Formal Address',
          activationType: 'free-action',
          prerequisites: ['envoy-cultural-attunement'],
          description: 'When you address someone using their proper title and customs, your next Persuasion test against that person has advantage. Requires knowing their correct form of address.',
        },
        {
          id: 'envoy-treaty-of-trust',
          name: 'Treaty of Trust',
          activationType: 'action',
          prerequisites: ['envoy-open-doors'],
          description: 'After at least 10 minutes of genuine conversation, you can make a Persuasion test to establish provisional trust with a character. Until that trust is broken, they treat you as a friendly contact.',
        },
      ],
    },
    {
      id: 'envoy-negotiator',
      name: 'Negotiator',
      description: 'Deal-makers who find agreement where none seemed possible.',
      talents: [
        {
          id: 'envoy-find-common-ground',
          name: 'Find Common Ground',
          activationType: 'action',
          prerequisites: ['envoy-diplomat'],
          description: 'You can identify a shared interest or mutual concern between two opposed parties. Make an Insight test; on a success, the next Persuasion test by anyone in the negotiation has advantage.',
        },
        {
          id: 'envoy-hard-bargain',
          name: 'Hard Bargain',
          activationType: 'action',
          prerequisites: ['envoy-diplomat'],
          description: 'When finalising terms of a deal or agreement, you can make a Persuasion test to shift one element of the terms in your favor by one step without the other party walking away.',
        },
        {
          id: 'envoy-concession-play',
          name: 'Concession Play',
          activationType: 'reaction',
          prerequisites: ['envoy-hard-bargain'],
          description: 'When a negotiation is about to break down entirely, you can offer a calculated concession as a reaction to prevent it from failing and reset the discussion to a neutral footing.',
        },
        {
          id: 'envoy-contract-memory',
          name: 'Contract Memory',
          activationType: 'always-active',
          prerequisites: ['envoy-find-common-ground'],
          description: 'You have perfect recall of every agreement, promise, and commitment made in your presence. You can invoke these with precision in future dealings, and you always know when someone is breaking a prior arrangement.',
        },
      ],
    },
    {
      id: 'envoy-agitator',
      name: 'Agitator',
      description: 'Rabble-rousers and rabble-rousers who shape moods, stoke passions, and ignite change.',
      talents: [
        {
          id: 'envoy-incite-passion',
          name: 'Incite Passion',
          activationType: 'action',
          prerequisites: ['envoy-diplomat'],
          description: 'You stoke a target\'s existing emotional state to provoke action. Make a Persuasion test opposed by their Willpower. On a success, they act on their strongest current emotion at the earliest opportunity.',
        },
        {
          id: 'envoy-sow-doubt',
          name: 'Sow Doubt',
          activationType: 'action',
          prerequisites: ['envoy-diplomat'],
          description: 'You undermine confidence in a source or ally. Make a Deception test against the target\'s Cognitive Defense. On a success, they treat that source with suspicion for the rest of the scene.',
        },
        {
          id: 'envoy-rally-cry',
          name: 'Rally Cry',
          activationType: 'action',
          prerequisites: ['envoy-incite-passion'],
          description: 'You deliver a rousing speech to up to ten people who can hear you. Make a Persuasion test; on a success, all targets have advantage on their next test before the end of the scene.',
        },
        {
          id: 'envoy-revolutionary-words',
          name: 'Revolutionary Words',
          activationType: 'special',
          prerequisites: ['envoy-sow-doubt'],
          description: 'Over days or weeks of public speaking and quiet persuasion, you can shift the sentiment of a community. The GM tracks your accumulated Persuasion successes to determine the scope and permanence of the change.',
        },
      ],
    },
  ],
}

// ─── HUNTER ──────────────────────────────────────────────────────────────────

const HUNTER: HeroicPathTree = {
  pathName: 'Hunter',
  flavorText: 'Trackers, stalkers, and precision combatants. Hunters excel in wilderness survival and bringing down prey swiftly.',
  keyTalent: {
    id: 'hunter-tracker',
    name: 'Tracker',
    activationType: 'always-active',
    prerequisites: [],
    description: 'Your senses and instincts are honed for pursuit. You gain +1 to Perception and Survival tests. This unlocks the Stalker, Trapper, and Marksman specialties.',
  },
  specialties: [
    {
      id: 'hunter-stalker',
      name: 'Stalker',
      description: 'Patient hunters who move silently and strike from concealment.',
      talents: [
        {
          id: 'hunter-silent-movement',
          name: 'Silent Movement',
          activationType: 'always-active',
          prerequisites: ['hunter-tracker'],
          description: 'You can move at full speed without any penalty to Stealth tests. Difficult terrain that would normally require concentration does not break your focus on remaining hidden.',
        },
        {
          id: 'hunter-patient-predator',
          name: 'Patient Predator',
          activationType: 'free-action',
          prerequisites: ['hunter-tracker'],
          description: 'When you have not moved during this round, your next attack test has advantage. Patience and stillness make you deadlier than speed.',
        },
        {
          id: 'hunter-fade-into-shadow',
          name: 'Fade into Shadow',
          activationType: 'action',
          prerequisites: ['hunter-silent-movement'],
          description: 'While in dim light or darkness, you can attempt to hide even while you are being actively observed, as long as you are not the sole focus of attention.',
        },
        {
          id: 'hunter-unseen-predator',
          name: 'Unseen Predator',
          activationType: 'always-active',
          prerequisites: ['hunter-patient-predator'],
          description: 'Attacks you make while hidden deal additional damage equal to your Awareness score, as your prey never sees the killing blow coming.',
        },
      ],
    },
    {
      id: 'hunter-trapper',
      name: 'Trapper',
      description: 'Experts at controlling terrain and setting ambushes.',
      talents: [
        {
          id: 'hunter-set-snare',
          name: 'Set Snare',
          activationType: 'action',
          prerequisites: ['hunter-tracker'],
          description: 'You prepare a trap in your current space using available materials. The next creature to enter triggers it, making a Speed test against your Survival result or falling Prone and losing 1 action on their next turn.',
        },
        {
          id: 'hunter-environmental-advantage',
          name: 'Environmental Advantage',
          activationType: 'free-action',
          prerequisites: ['hunter-tracker'],
          description: 'You exploit terrain instinctively. While in a natural environment, you can make a Survival test to identify a feature granting advantage on one attack or defense roll.',
        },
        {
          id: 'hunter-improved-snare',
          name: 'Improved Snare',
          activationType: 'always-active',
          prerequisites: ['hunter-set-snare'],
          description: 'Your traps are expertly concealed. Detecting one of your prepared traps requires a Perception test against your Survival result. On a failure, the creature has no idea the trap is there.',
        },
        {
          id: 'hunter-ambush-predator',
          name: 'Ambush Predator',
          activationType: 'free-action',
          prerequisites: ['hunter-environmental-advantage'],
          description: 'When all opponents are unaware of your group at the start of an encounter, you and all allies have advantage on every attack made during the first round.',
        },
      ],
    },
    {
      id: 'hunter-marksman',
      name: 'Marksman',
      description: 'Precision ranged specialists who place every shot with deadly intent.',
      talents: [
        {
          id: 'hunter-steady-aim',
          name: 'Steady Aim',
          activationType: 'action',
          prerequisites: ['hunter-tracker'],
          description: 'You spend your action aiming rather than attacking. Your next ranged attack this turn or on your next turn has advantage. Moving before firing cancels the benefit.',
        },
        {
          id: 'hunter-called-shot',
          name: 'Called Shot',
          activationType: 'action',
          prerequisites: ['hunter-steady-aim'],
          description: 'You target a specific location — a weapon, limb, or key piece of equipment. On a successful hit, in addition to normal damage, apply one additional narrative effect: disarm, hobble, or break armor.',
        },
        {
          id: 'hunter-pinning-shot',
          name: 'Pinning Shot',
          activationType: 'action',
          prerequisites: ['hunter-called-shot'],
          description: 'When you hit a target with a ranged attack, you can choose to pin them in place — a bolt through a sleeve, a javelin in the ground. They gain the Immobilized condition until they spend an action to free themselves.',
        },
        {
          id: 'hunter-lethal-precision',
          name: 'Lethal Precision',
          activationType: 'always-active',
          prerequisites: ['hunter-steady-aim'],
          description: 'When you have advantage on an attack and both dice would hit, you may treat the result as a critical hit, maximizing one damage die of your choice.',
        },
      ],
    },
  ],
}

// ─── LEADER ──────────────────────────────────────────────────────────────────

const LEADER: HeroicPathTree = {
  pathName: 'Leader',
  flavorText: 'Commanders, warlords, and inspirations. Leaders make everyone around them stronger, turning a group into a force.',
  keyTalent: {
    id: 'leader-commander',
    name: 'Commander',
    activationType: 'always-active',
    prerequisites: [],
    description: 'You inspire those around you and read the battlefield with clarity. You gain +1 to Leadership and Persuasion tests. This unlocks the Tactician, Warlord, and Inspiration specialties.',
  },
  specialties: [
    {
      id: 'leader-tactician',
      name: 'Tactician',
      description: 'Analytical leaders who control positioning and exploit tactical opportunities.',
      talents: [
        {
          id: 'leader-battlefield-assessment',
          name: 'Battlefield Assessment',
          activationType: 'free-action',
          prerequisites: ['leader-commander'],
          description: 'At the start of combat, make a Deduction test. On a success, the GM identifies one tactical advantage or threat that your character would recognize — a choke point, exposed flank, or concealed enemy.',
        },
        {
          id: 'leader-flanking-orders',
          name: 'Flanking Orders',
          activationType: 'action',
          prerequisites: ['leader-commander'],
          description: 'You direct an ally to a superior position. That ally may immediately move up to their full speed without provoking opportunity effects, repositioning to wherever you indicate.',
        },
        {
          id: 'leader-tactical-retreat',
          name: 'Tactical Retreat',
          activationType: 'reaction',
          prerequisites: ['leader-flanking-orders'],
          description: 'When an ally within 30 feet is targeted by an attack, you call out a warning as a reaction. That ally may move up to half their speed before the attack resolves, potentially moving out of range.',
        },
        {
          id: 'leader-coordinated-strike',
          name: 'Coordinated Strike',
          activationType: 'free-action',
          prerequisites: ['leader-battlefield-assessment'],
          description: 'When you and at least one ally both attack the same target during the same round, all attacks against that target have advantage this round.',
        },
      ],
    },
    {
      id: 'leader-warlord',
      name: 'Warlord',
      description: 'Aggressive commanders who lead from the front and break enemy morale.',
      talents: [
        {
          id: 'leader-rally',
          name: 'Rally',
          activationType: 'action',
          prerequisites: ['leader-commander'],
          description: 'You call out to a struggling ally within 60 feet who can hear you. They may immediately spend a Recovery Die and add your Leadership modifier to the result.',
        },
        {
          id: 'leader-lead-the-charge',
          name: 'Lead the Charge',
          activationType: 'action',
          prerequisites: ['leader-commander'],
          description: 'You move up to your speed toward an enemy and make an attack. All allies who can see you may use their reaction to follow, moving up to half their speed toward the same enemy.',
        },
        {
          id: 'leader-break-their-spirit',
          name: 'Break Their Spirit',
          activationType: 'action',
          prerequisites: ['leader-rally'],
          description: 'You unleash a commanding shout at a group of visible enemies. Each must make a Willpower test against your Leadership result or gain the Disoriented condition until the end of their next turn.',
        },
        {
          id: 'leader-unbreakable-line',
          name: 'Unbreakable Line',
          activationType: 'always-active',
          prerequisites: ['leader-lead-the-charge'],
          description: 'Allies within 10 feet of you cannot be moved, pushed, or knocked Prone against their will by any external effect while you are conscious.',
        },
      ],
    },
    {
      id: 'leader-inspiration',
      name: 'Inspiration',
      description: 'Motivators who lift the spirits and abilities of those around them.',
      talents: [
        {
          id: 'leader-by-example',
          name: 'By Example',
          activationType: 'always-active',
          prerequisites: ['leader-commander'],
          description: 'When you succeed on a test with a result of 18 or higher, one ally who witnessed the feat gains advantage on the same type of test before the end of the scene.',
        },
        {
          id: 'leader-motivating-words',
          name: 'Motivating Words',
          activationType: 'action',
          prerequisites: ['leader-commander'],
          description: 'You spend a moment encouraging one ally. Until the start of your next turn, that ally has advantage on the next test of their choice.',
        },
        {
          id: 'leader-steadfast-presence',
          name: 'Steadfast Presence',
          activationType: 'always-active',
          prerequisites: ['leader-by-example'],
          description: 'Allies within 30 feet of you who can see or hear you cannot gain the Frightened condition while you are conscious.',
        },
        {
          id: 'leader-heros-inspiration',
          name: "Hero's Inspiration",
          activationType: 'special',
          prerequisites: ['leader-motivating-words'],
          description: 'Once per session, you can deliver a speech that affects all allies who can hear you. Each gains advantage on all tests for the next hour, or until they fail a test, whichever comes first.',
        },
      ],
    },
  ],
}

// ─── SCHOLAR ─────────────────────────────────────────────────────────────────

const SCHOLAR: HeroicPathTree = {
  pathName: 'Scholar',
  flavorText: 'Physicians, artifabrians, and researchers. Scholars solve problems with knowledge that others do not possess.',
  keyTalent: {
    id: 'scholar-academic',
    name: 'Academic',
    activationType: 'always-active',
    prerequisites: [],
    description: 'Your knowledge spans many disciplines. You gain +1 to Lore and Deduction tests. This unlocks the Physician, Artifabrian, and Researcher specialties.',
  },
  specialties: [
    {
      id: 'scholar-physician',
      name: 'Physician',
      description: 'Trained healers who can save lives in even the most desperate situations.',
      talents: [
        {
          id: 'scholar-field-medicine',
          name: 'Field Medicine',
          activationType: 'action',
          prerequisites: ['scholar-academic'],
          description: 'You can treat wounds and stabilize the dying in the field. Make a Medicine test — on a success, the target recovers Health equal to your result and you may downgrade one injury by one severity step.',
        },
        {
          id: 'scholar-triage',
          name: 'Triage',
          activationType: 'free-action',
          prerequisites: ['scholar-academic'],
          description: 'At a glance, you can assess the medical state of any creature you can see: their approximate current Health, whether they are dying, and the nature of any obvious injuries.',
        },
        {
          id: 'scholar-expert-surgeon',
          name: 'Expert Surgeon',
          activationType: 'action',
          prerequisites: ['scholar-field-medicine'],
          description: 'With proper supplies and time, you can remove one Shallow or Flesh Wound injury without a roll. Vicious injuries require a successful Medicine test but can be treated in the field.',
        },
        {
          id: 'scholar-miraculous-recovery',
          name: 'Miraculous Recovery',
          activationType: 'special',
          prerequisites: ['scholar-triage'],
          description: 'Once per scene, when a character you can touch would die, you can immediately stabilize them. They survive with 1 Health and the Unconscious condition. No roll required.',
        },
      ],
    },
    {
      id: 'scholar-artifabrian',
      name: 'Artifabrian',
      description: 'Engineers and inventors who understand and manipulate fabrials.',
      talents: [
        {
          id: 'scholar-fabrial-knowledge',
          name: 'Fabrial Knowledge',
          activationType: 'always-active',
          prerequisites: ['scholar-academic'],
          description: 'You understand the principles of fabrial construction. You can identify the function of any fabrial with a successful Lore test and can operate complex fabrials without a manual or instruction.',
        },
        {
          id: 'scholar-jury-rig',
          name: 'Jury-Rig',
          activationType: 'action',
          prerequisites: ['scholar-academic'],
          description: 'You can temporarily repair or improvise a damaged or makeshift fabrial. Make a Crafting test — on a success, it functions at reduced capacity for the remainder of the scene.',
        },
        {
          id: 'scholar-modify-device',
          name: 'Modify Device',
          activationType: 'action',
          prerequisites: ['scholar-fabrial-knowledge'],
          description: 'Given proper tools and materials, you can alter an existing fabrial\'s function or enhance its output. The GM determines the complexity of the modification and the time required.',
        },
        {
          id: 'scholar-improvised-fabrial',
          name: 'Improvised Fabrial',
          activationType: 'special',
          prerequisites: ['scholar-jury-rig'],
          description: 'With available materials and an hour of work, you can construct a simple single-use fabrial. Define its effect — the GM sets Crafting difficulty and determines what components are required.',
        },
      ],
    },
    {
      id: 'scholar-researcher',
      name: 'Researcher',
      description: 'Brilliant theorists who apply academic knowledge to any problem.',
      talents: [
        {
          id: 'scholar-perfect-recall',
          name: 'Perfect Recall',
          activationType: 'always-active',
          prerequisites: ['scholar-academic'],
          description: 'You remember anything you have read, studied, or been taught. You can make a Lore test to recall specific details from any text you have previously encountered.',
        },
        {
          id: 'scholar-cross-reference',
          name: 'Cross-Reference',
          activationType: 'free-action',
          prerequisites: ['scholar-perfect-recall'],
          description: 'When making any knowledge-based test, you can invoke relevant information from another field of study as a free action. On a success, you gain advantage on the test.',
        },
        {
          id: 'scholar-theoretical-application',
          name: 'Theoretical Application',
          activationType: 'action',
          prerequisites: ['scholar-academic'],
          description: 'You can apply academic knowledge to hands-on problems. When facing a challenge outside your direct experience, make a Lore test — on a success, treat the situation as if you had 1 rank in any relevant skill.',
        },
        {
          id: 'scholar-breakthrough-insight',
          name: 'Breakthrough Insight',
          activationType: 'special',
          prerequisites: ['scholar-cross-reference'],
          description: 'Once per session, when all other options seem exhausted, you may make a Deduction test to identify a solution or connection the GM confirms is accurate and actionable.',
        },
      ],
    },
  ],
}

// ─── WARRIOR ─────────────────────────────────────────────────────────────────

const WARRIOR: HeroicPathTree = {
  pathName: 'Warrior',
  flavorText: 'Combat veterans who have mastered the art of violence. Warriors fight harder, last longer, and protect those around them.',
  keyTalent: {
    id: 'warrior-combat-expertise',
    name: 'Combat Expertise',
    activationType: 'always-active',
    prerequisites: [],
    description: 'You are a trained and disciplined fighter. You gain +1 to your choice of Heavy Weaponry or Light Weaponry tests (chosen when this talent is acquired). This unlocks the Duelist, Guardian, and Berserker specialties.',
  },
  specialties: [
    {
      id: 'warrior-duelist',
      name: 'Duelist',
      description: 'Skilled individual combatants who fight with precision and cunning.',
      talents: [
        {
          id: 'warrior-parry-riposte',
          name: 'Parry and Riposte',
          activationType: 'reaction',
          prerequisites: ['warrior-combat-expertise'],
          description: 'When a melee attack misses you, you can make a single melee attack against that attacker as a reaction. This attack uses your normal attack roll.',
        },
        {
          id: 'warrior-read-the-fighter',
          name: 'Read the Fighter',
          activationType: 'free-action',
          prerequisites: ['warrior-combat-expertise'],
          description: 'At the start of your turn, choose one opponent. Your next attack against them has advantage, and you may reroll one defense die against their attacks until the start of your next turn.',
        },
        {
          id: 'warrior-flowing-strikes',
          name: 'Flowing Strikes',
          activationType: 'free-action',
          prerequisites: ['warrior-parry-riposte'],
          description: 'When you hit with a melee attack, you may immediately make a second attack at −2 to the result as a free action. This second attack cannot trigger Flowing Strikes again.',
        },
        {
          id: 'warrior-master-duelist',
          name: 'Master Duelist',
          activationType: 'always-active',
          prerequisites: ['warrior-read-the-fighter'],
          description: 'Once per round when you make a successful melee attack, you may force the target to reroll one die on their next attack or defense roll, taking the worse result.',
        },
      ],
    },
    {
      id: 'warrior-guardian',
      name: 'Guardian',
      description: 'Defensive fighters who put themselves between danger and their allies.',
      talents: [
        {
          id: 'warrior-interpose',
          name: 'Interpose',
          activationType: 'reaction',
          prerequisites: ['warrior-combat-expertise'],
          description: 'When an ally within 5 feet is targeted by a melee attack, you can interpose yourself as a reaction, becoming the target of the attack instead.',
        },
        {
          id: 'warrior-shield-wall',
          name: 'Shield Wall',
          activationType: 'always-active',
          prerequisites: ['warrior-combat-expertise'],
          description: 'While you have a shield equipped and an ally is directly adjacent to you, that ally benefits from your Deflect value against attacks that would reach them from your direction.',
        },
        {
          id: 'warrior-take-the-hit',
          name: 'Take the Hit',
          activationType: 'reaction',
          prerequisites: ['warrior-interpose'],
          description: 'When an ally within 30 feet takes damage, you can spend 1 Focus as a reaction to reduce that damage by your Strength score. You feel the impact but redirect the worst of it.',
        },
        {
          id: 'warrior-living-fortress',
          name: 'Living Fortress',
          activationType: 'always-active',
          prerequisites: ['warrior-shield-wall'],
          description: 'While you are conscious and adjacent to at least one ally, you cannot be moved, pushed, or knocked Prone against your will by any external effect.',
        },
      ],
    },
    {
      id: 'warrior-berserker',
      name: 'Berserker',
      description: 'Ferocious fighters who trade safety for devastating offensive power.',
      talents: [
        {
          id: 'warrior-reckless-attack',
          name: 'Reckless Attack',
          activationType: 'free-action',
          prerequisites: ['warrior-combat-expertise'],
          description: 'Before making an attack, you can declare it Reckless. Your attack has advantage, but attacks against you also have advantage until the start of your next turn.',
        },
        {
          id: 'warrior-pain-is-power',
          name: 'Pain is Power',
          activationType: 'always-active',
          prerequisites: ['warrior-combat-expertise'],
          description: 'While your Health is below half your maximum, your attacks deal additional damage equal to your Strength score. Injury strengthens your resolve rather than diminishing it.',
        },
        {
          id: 'warrior-unstoppable',
          name: 'Unstoppable',
          activationType: 'always-active',
          prerequisites: ['warrior-reckless-attack'],
          description: 'The Stunned and Dazed conditions do not cause you to lose actions. You still suffer any other effects of those conditions, but nothing can stop your offensive momentum.',
        },
        {
          id: 'warrior-into-the-storm',
          name: 'Into the Storm',
          activationType: 'special',
          prerequisites: ['warrior-pain-is-power'],
          description: 'Once per scene, as an action, you enter a battle fury. For the rest of the scene, all your attacks gain the benefits of Reckless Attack without the defensive penalty, and you deal maximum damage on any hit that exceeds the target\'s defense by 5 or more.',
        },
      ],
    },
  ],
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const HEROIC_PATH_TREES: Record<string, HeroicPathTree> = {
  Agent:   AGENT,
  Envoy:   ENVOY,
  Hunter:  HUNTER,
  Leader:  LEADER,
  Scholar: SCHOLAR,
  Warrior: WARRIOR,
}

export function getTalentById(id: string): TalentNode | undefined {
  for (const tree of Object.values(HEROIC_PATH_TREES)) {
    if (tree.keyTalent.id === id) return tree.keyTalent
    for (const spec of tree.specialties) {
      const found = spec.talents.find(t => t.id === id)
      if (found) return found
    }
  }
  return undefined
}
