# COSMERE RPG — Stormlight Campaign Webtool
**Product Requirements Document**
Version 1.0 · Draft · 2025
---
| Field | Value |
|---|---|
| **Status** | Draft — For Review |
| **Version** | 1.0 |
| **System** | Cosmere RPG / Stormlight Handbook (Brotherwise Games / Dragonsteel, 2025) |
| **Scope** | Character Management + Combat Tracker + GM Tools |
| **Primary Users** | GM (Game Master) and Players — multi-user, browser-based |
| **Platform** | Web application (desktop/laptop browser) |
| **Author** | — |
| **Last Updated** | 2025 |
---
## 1. Product Overview
*What we're building and why*
### 1.1 Problem Statement
The Cosmere RPG (Stormlight Handbook edition) features a rich and layered character system built on the Plotweaver™ engine. Managing characters at the table using printed sheets creates friction: tracking dynamic resources like Health, Focus, and Investiture mid-combat is error-prone; the interplay between Attributes, Skill Modifiers, and Defenses requires recalculation on the fly; and the GM has no centralised view of the party's state when running combat or adversary stat blocks.
Players need a digital character sheet that mirrors the full structure of the Stormlight Handbook ruleset — from origin and path selection through to surge skills, conditions, and injuries. The GM needs a lightweight layer on top: a combat tracker, NPC/adversary manager, and session tools — all in the same shared environment.
### 1.2 Product Vision
> *A browser-based campaign companion for the Cosmere RPG that lets players build, maintain, and play their characters digitally while giving the GM a real-time view of the party and a set of tools to run combat and sessions without leaving the screen.*
### 1.3 Goals
- Faithfully implement the Stormlight Handbook character sheet — all attributes, skills, defenses, resources, and derived statistics — with automatic calculation wherever the rules mandate it.
- Provide real-time, editable character state (Health, Focus, Investiture, conditions, injuries) suitable for use during a live session.
- Give the GM a dedicated view: full party overview, combat turn tracker, and adversary stat block management.
- Enable players to create and manage their own characters independently, with the GM able to view (but not edit) player sheets.
- Support the full character advancement lifecycle from Level 1 through Tier 5 (Level 21+).
- Design for desktop/laptop browser use at the table — no mobile-first constraints, no native app requirement.
### 1.4 Non-Goals (Out of Scope for v1)
- No dice rolling engine (physical dice remain at the table).
- No real-time multiplayer sync / WebSocket infrastructure — page refresh or manual save is acceptable for v1.
- No integrated map, VTT canvas, or miniature positioning system.
- No published adventure content, lore databases, or world guides.
- No mobile or tablet optimisation (desktop only).
- No account authentication system (local storage or simple session-based persistence is acceptable for v1).
---
## 2. Users & Roles
*Who uses the tool and what they need*
### 2.1 User Roles
**Game Master (GM)**
- Runs the session and has oversight of all characters and combat.
- Can view all player character sheets in read-only mode.
- Has exclusive access to GM Tools: combat tracker, adversary manager, session notes.
- Can create and manage NPC/adversary stat blocks for encounters.
- Controls whose turn it is in the combat tracker and can modify NPC health/focus.
**Player**
- Creates and owns their own character (one character per player in v1).
- Can edit all fields on their own character sheet including resource tracking.
- Can view other players' characters in read-only mode if the GM enables party sharing.
- Cannot access GM Tools or adversary blocks.
### 2.2 Access Model
For v1, the tool operates as a single-session or persistent local-storage application. Users self-identify as GM or Player when creating a session. A GM session code can be shared with players to join the same 'campaign.' No password authentication is required in v1, but the GM/Player role distinction must be enforced in the UI (the GM view is a separate interface from the Player view).
---
## 3. Rules System Reference
*Core Cosmere RPG mechanics the tool must implement*
> *All mechanics in this section are derived from the Stormlight Handbook (Brotherwise Games / Dragonsteel Entertainment, 2025). The tool must implement these faithfully. Any deviation requires explicit GM override.*
### 3.1 Attributes
Six core attributes drive most derived statistics. Each ranges from 0–5 at character creation (max 12 distributed points, max 3 per attribute at Level 1). Attributes increase at levels 3, 6, 9, 12, 15, and 18 (+1 per instance, cap of 5 via advancement — some talents may temporarily exceed this).
| Attribute | Abbreviation | Primary Derived Effect |
|---|---|---|
| Strength | STR | Lifting capacity; contributes to Physical Defense and base Health (10 + STR) |
| Speed | SPD | Movement rate (see Movement Rate table); contributes to Physical Defense |
| Intellect | INT | Number of bonus expertises (equal to INT score); contributes to Cognitive Defense |
| Willpower | WIL | Recovery die size; maximum Focus (2 × WIL); contributes to Cognitive Defense |
| Awareness | AWA | Senses range when primary sense obscured; contributes to Spiritual Defense |
| Presence | PRE | Contributes to Spiritual Defense and Investiture (if applicable) |
### 3.2 Defenses
Three defenses are fully derived from attributes. The tool must auto-calculate and update these whenever a relevant attribute changes. Bonuses and penalties from talents or conditions may temporarily modify them.
- Physical Defense = 10 + STR + SPD + bonuses/penalties
- Cognitive Defense = 10 + INT + WIL + bonuses/penalties
- Spiritual Defense = 10 + AWA + PRE + bonuses/penalties
### 3.3 Resources
**Health**
- Maximum Health = 10 + STR at Level 1. Increases by a tier-dependent amount each level (see Character Advancement table: +5/level in Tier 1, +4 in Tier 2, +3 in Tier 3, +2 in Tier 4, +1 in Tier 5). Some levels add STR again.
- Current Health is tracked separately; cannot go below 0.
- At 0 Health: character becomes Unconscious and suffers an Injury (see §3.7).
**Focus**
- Maximum Focus = 2 × WIL (base, before talents).
- Focus is spent to activate certain talents and abilities; recovered during rests.
- Some talents (e.g., Composed) permanently increase maximum Focus.
**Investiture**
- Only available once a character has bonded a spren and begun a Radiant path.
- Maximum Investiture is determined by Awareness or Presence (per the relevant Radiant path rules).
- Used to fuel surges. Recoverable by breathing in Stormlight from infused spheres.
- Characters without a spren bond have Investiture = 0; the field should be hidden or greyed out until unlocked.
### 3.4 Skills & Skill Modifiers
There are 18 standard skills, each linked to an attribute. Skill Modifier = Skill Ranks + Associated Attribute Score + bonuses/penalties. The tool must auto-calculate modifiers whenever ranks or attributes change.
| Physical Skills (STR / SPD) | Cognitive Skills (INT / WIL) | Spiritual Skills (AWA / PRE) |
|---|---|---|
| Agility (SPD) | Crafting (INT) | Deception (PRE) |
| Athletics (STR) | Deduction (INT) | Insight (AWA) |
| Heavy Weaponry (STR) | Discipline (WIL) | Leadership (PRE) |
| Light Weaponry (SPD) | Intimidation (WIL) | Perception (AWA) |
| Stealth (SPD) | Lore (INT) | Persuasion (PRE) |
| Thievery (SPD) | Medicine (INT) | Survival (AWA) |
*Additional surge skills (e.g., Abrasion, Gravitation, Illumination) are gained when a character unlocks a Radiant path. These appear as extra rows in the skill list, hidden until unlocked.*
### 3.5 Expertises
- Expertises are freeform text tags representing specialised knowledge (weapon types, cultures, subjects, utility areas).
- Characters gain 2 expertises from their Culture at creation. Additional expertises equal to INT score are chosen at creation.
- More expertises may be gained from talents. If a talent grants a duplicate expertise category, the player may substitute another from the same category.
- The tool should allow players to add/edit expertise tags freely, with a note field for each.
### 3.6 Heroic Paths & Talents
**Heroic Paths**
Six heroic paths are available: Agent, Envoy, Hunter, Leader, Scholar, Warrior. Each has a Key Talent that unlocks three specialties. Characters may multi-path over time.
**Singer Ancestry — Unique Talent Tree**
Singer characters access an additional talent tree. Singer forms grant temporary attribute bonuses (e.g., Artform: +1 AWA; Warform: +1 STR, +1 Deflect). The tool must support singers changing forms and applying/removing the associated temporary attribute modifiers and bonuses.
**Talent Tracking Requirements**
- Each talent must be recorded with its name, path/specialty source, prerequisites, and activation type (action, reaction, free action, always-active, special activation).
- Prerequisites must be visible to the player when browsing potential talents.
- The tool does NOT need to enforce prerequisite gating in v1 — players self-manage with GM oversight.
### 3.7 Conditions & Injuries
**Conditions (Temporary Effects)**
The following standard conditions must be trackable on a character sheet. Each condition modifies gameplay in specific ways. The tool should allow any condition to be applied, with a note field for duration.
- Blinded, Confused, Dazed, Disoriented, Exhausted [−N], Frightened, Grabbed, Immobilized, Invisible, Obscured, Prone, Slowed, Stunned, Surprised, Unconscious
Exhausted is stacking (Exhausted [−1] through [−10]; at [−10] or lower = death). The tool must support numeric stacking for Exhausted specifically.
**Injuries**
Injuries result from reaching 0 Health and making an Injury Roll (d20 + Deflect + bonuses − 5 per existing injury). Duration categories: Death, Permanent Injury, Vicious (6d6 days), Shallow (1d6 days), Flesh Wound (until long rest).
- The tool must allow injuries to be logged with: name/description, duration type, remaining days, and the mechanical effect chosen from the Injury Effects table.
- Permanent injuries persist indefinitely and should be visually distinguished from temporary ones.
### 3.8 Character Advancement
The tool must support level-up events that trigger the correct advancement choices per the Character Advancement table (levels 1–21+), including:
- Attribute point increases at levels 3, 6, 9, 12, 15, 18 (recalculate derived stats automatically).
- Health increases per level and tier.
- Skill rank gains per level (2 ranks/level through level 20; choice of 1 rank OR 1 talent at level 21+).
- Talent selection per level (1 talent/level through level 20).
- Ancestry bonus talents at tiers 1, 2, 3, 4, 5 (levels 1, 6, 11, 16, 21).
- Maximum skill rank cap increasing by tier (2 → 3 → 4 → 5 → 5).
### 3.9 Deflect
Deflect value reduces incoming impact, keen, and energy damage (not spirit or vital). It comes from equipped armour and/or talents. The tool must track Deflect as a derived value, updateable when armour is equipped/unequipped or form changes (for singers).
### 3.10 Combat Turn Structure (for GM Tools)
Combat follows a strict phase sequence each round:
- Phase 1 — Fast PC Turns: PCs who choose fast turns act first, gaining 2 actions + 1 reaction.
- Phase 2 — Fast NPC Turns: GM-chosen adversaries act fast, gaining 2 actions + 1 reaction.
- Phase 3 — Slow PC Turns: Remaining PCs act, gaining 3 actions + 1 reaction.
- Phase 4 — Slow NPC Turns: Remaining adversaries act, gaining 3 actions + 1 reaction.
The combat tracker must reflect this phase structure. Surprised characters lose reactions and gain 1 fewer action on their first turn.
---
## 4. Feature Requirements
*What the tool must do — prioritised*
> *Priority key — P0: Must ship in v1 (launch blocker). P1: High value, ship if feasible in v1. P2: Nice to have, defer to v1.1+.*
### 4.1 Character Creation & Sheet
| ID | Feature | Description | Priority | Notes |
|---|---|---|---|---|
| CC-01 | Character Identity Fields | Name, player name, level, ancestry (Human/Singer), culture(s), heroic path(s), Radiant path (if applicable), occupation, appearance notes. | P0 | All freeform text except ancestry/path (select from defined lists). |
| CC-02 | Attribute Score Entry | Input fields for all 6 attributes. Enforce 12-point budget and max 3/attribute at level 1 creation. Remove constraints after creation (level-up rules apply). | P0 | Show running point total during creation. |
| CC-03 | Auto-Calculate Defenses | Physical, Cognitive, and Spiritual Defense auto-update when attributes change. Display calculated values prominently. | P0 | Allow manual bonus/penalty override field per defense for talent/condition effects. |
| CC-04 | Auto-Calculate Health Max | Health maximum auto-derives from level + STR + tier formula. Show formula breakdown on hover. | P0 | Trigger recalculation on attribute change or level-up. |
| CC-05 | Auto-Calculate Focus Max | Focus maximum = 2 × WIL + talent bonuses. Recalculate on WIL change or talent addition. | P0 | Talent bonus tracked as a separate editable field. |
| CC-06 | Investiture Field | Hidden/greyed by default. Unlocked when player marks character as 'Radiant bonded.' Max value determined by AWA or PRE per path. | P0 | Simple unlock toggle; manual max input. |
| CC-07 | Current Resource Tracking | Editable current values for Health, Focus, and Investiture. +/− buttons for quick adjustment in play. | P0 | Visual health bar optional in v1; numeric is sufficient. |
| CC-08 | Skill Rank Inputs | Checkbox-style rank entry for all 18 skills (max 2 ranks at creation; tier-based caps thereafter). Auto-calculate modifier = ranks + attribute. | P0 | Show modifier prominently next to each skill. |
| CC-09 | Surge Skill Rows | Hidden additional skill rows for surge skills (Abrasion, Adhesion, Cohesion, Division, Gravitation, Illumination, Progression, Tension, Transformation, Transportation). Revealed per Radiant path. | P0 | Unlock individually as paths are gained. |
| CC-10 | Expertise List | Add/remove freeform expertise tags. Display as a tag list. Note field per expertise. | P0 | No enforcement needed; purely informational. |
| CC-11 | Talent List | Add/remove talents. Each entry: name, path/specialty, activation type, prerequisites, full description text (freeform). Display as a collapsible list. | P0 | No auto-enforcement of prerequisites in v1. |
| CC-12 | Equipment & Armour | Track weapons (name, bonus, damage type, dice, special), armour (name, deflect value, weight), and general equipment (name, quantity, weight, price). | P0 | Auto-update Deflect when armour is added/removed. |
| CC-13 | Currency | Track marks (and denominations: chips, marks, broams). Simple numeric fields. | P0 | |
| CC-14 | Derived Stats Display | Lifting capacity, movement rate, recovery die size, senses range — all derived from attributes per Handbook tables. Display as read-only calculated fields. | P0 | Show lookup table values; not complex math. |
| CC-15 | Deflect Display | Show current Deflect value (from armour + singer form + talents). Auto-update. | P0 | |
| CC-16 | Condition Tracker | Apply/remove conditions from a defined list. Exhausted supports a stacking numeric value. Duration notes field per condition. | P0 | Visual badge/tag display. |
| CC-17 | Injury Log | Add injuries with: description, duration type (permanent/vicious/shallow/flesh wound), days remaining, mechanical effect. Permanent injuries visually flagged. | P0 | |
| CC-18 | Goals & Rewards Log | Freeform text list for active Goals (purpose/obstacle structure) and earned Rewards. Notes field. | P0 | No mechanical enforcement needed. |
| CC-19 | Connections Log | List of NPC/faction connections with relationship description and status. | P0 | Freeform text. |
| CC-20 | Singer Form Management | For singer characters: track current form. Apply/remove temporary attribute modifiers associated with that form automatically. Show base vs. modified attributes clearly. | P0 | One active form at a time. |
| CC-21 | Character Sheet PDF Export | Export the complete character sheet as a printable PDF. | P0 | Low priority; physical sheets remain fallback. |
| CC-22 | Character Import / JSON | Export and import character data as JSON for backup and sharing. | P2 | |
### 4.2 Character Advancement (Level-Up Flow)
| ID | Feature | Description | Priority | Notes |
|---|---|---|---|---|
| LU-01 | Level-Up Trigger | GM or player manually triggers a level-up event for a character. Increments level by 1 and opens a guided level-up flow. | P0 | GM triggers; player executes choices. |
| LU-02 | Attribute Increase Step | At levels 3, 6, 9, 12, 15, 18: player selects +1 to one attribute. Tool updates all derived stats automatically. | P0 | Show which levels grant an increase. |
| LU-03 | Health Increase | Auto-apply the correct Health increase for the current level/tier per the Character Advancement table. | P0 | |
| LU-04 | Skill Rank Allocation | Grant the correct number of new skill ranks (2 per level through 20; 1 per level at 21+). Player distributes. Enforce tier-based max rank cap. | P0 | Show remaining ranks to allocate. |
| LU-05 | Talent Selection | Grant 1 talent choice per level (through 20). At 21+, grant choice of 1 talent OR 1 skill rank. Player records selected talent. | P0 | No automated prerequisite enforcement in v1. |
| LU-06 | Ancestry Bonus Talent | Flag ancestry bonus talent milestone at tier starts (levels 1, 6, 11, 16, 21). Prompt player to record their bonus talent. | P0 | |
| LU-07 | Level History Log | Record what was chosen at each level-up for reference. | P1 | Simple read-only log. |
### 4.3 GM Dashboard & Party View
| ID | Feature | Description | Priority | Notes |
|---|---|---|---|---|
| GM-01 | Party Overview Panel | Single-screen view of all player characters: name, level, path, current/max Health, Focus, Investiture, active conditions. Read-only. | P0 | Card or table layout; updates on player changes. |
| GM-02 | Character Sheet Drill-Down | GM can click any PC card to view their full character sheet in read-only mode. | P0 | |
| GM-03 | Session Notes | Freeform GM notepad, persisted per campaign session. Rich text optional; plain text acceptable in v1. | P0 | |
| GM-04 | Level-Up Control | GM button to trigger a level-up event for a specific PC. The player then completes the level-up flow. | P0 | |
| GM-05 | Campaign Management | Create a campaign, assign a GM session code for players to join, name the campaign, track current session number. | P1 | Minimal — just enough to link GM and player sessions. |
### 4.4 Combat Tracker
| ID | Feature | Description | Priority | Notes |
|---|---|---|---|---|
| CT-01 | Encounter Setup | GM creates an encounter: names it, adds participants (PCs pulled from party roster + manually entered NPCs/adversaries). | P0 | |
| CT-02 | Fast/Slow Turn Selection | At the start of each round, GM marks each participant as Fast or Slow. Tool organises turn order into the 4 phases: Fast PC → Fast NPC → Slow PC → Slow NPC. | P0 | Simple toggle per participant each round. |
| CT-03 | Active Turn Highlight | Visual indicator of whose turn it is. GM manually advances turns. | P0 | No automation — GM clicks 'next turn'. |
| CT-04 | Round Counter | Display current round number. Increment automatically when all turns in a round are complete. | P0 | |
| CT-05 | PC Resource Tracking in Combat | Health, Focus, and Investiture for PCs shown inline in the tracker. Editable by the player (or GM for NPC turns). | P0 | Pull live values from character sheets. |
| CT-06 | NPC Health & Focus Tracking | Track current Health and Focus for each NPC in the encounter. GM-editable. | P0 | Separate from character sheet system — encounter-local values. |
| CT-07 | Condition Application in Tracker | Apply/remove conditions to any participant directly from the combat tracker. | P0 | Mirror to character sheet for PCs. |
| CT-08 | Surprised Condition Handling | Mark participants as Surprised at encounter start. Tool reminds GM of the mechanical effects (no reactions, −1 action) and removes condition after their first turn. | P1 | Informational prompt; GM resolves manually. |
| CT-09 | Adversary Stat Block Display | GM can view adversary stat blocks inline in the combat tracker during an encounter. | P1 | See Feature 4.5 for stat block management. |
| CT-10 | Plot Die Tracker | Visual reminder of whose test has stakes raised; simple toggle per test — no dice rolling. | P2 | Purely informational. |
| CT-11 | Encounter History Log | Log of key events per encounter (damage dealt, conditions applied, characters downed). GM-writable notes. | P2 | |
### 4.5 Adversary & NPC Management
| ID | Feature | Description | Priority | Notes |
|---|---|---|---|---|
| NPC-01 | Adversary Stat Block Library | GM can create and save adversary stat blocks: name, role (Minion/Rival/Boss), tier, attributes, defenses, Health range, Focus, Investiture, deflect, movement, senses, skills, features, actions, reactions. | P0 | Freeform text for features/actions in v1. |
| NPC-02 | Stat Block Templates | Pre-populated templates matching the Handbook's stat block structure. GM fills in values. | P0 | No pre-filled official stat blocks in v1 (copyright). |
| NPC-03 | Add NPC to Encounter | GM selects a saved stat block to add one or more instances to an encounter. Each instance tracks current HP/Focus independently. | P0 | Support multiple instances of the same stat block. |
| NPC-04 | Boss Feature Reminder | For Boss-role adversaries: display the standard Boss feature text inline ('can take fast and slow turn; spend 1 focus for extra action; spend 1 focus to remove condition'). | P1 | Read-only reminder block. |
| NPC-05 | NPC Import/Export | Export adversary library as JSON; import from JSON. | P2 | |
---
## 5. UX & Design Requirements
*How the tool should feel*
### 5.1 Layout Principles
- Two distinct interface modes: Player View and GM View. These are separate layouts, not tabs within the same screen.
- Player View is centred on a single character sheet, designed to be read and edited at a glance during a session.
- GM View is a multi-panel dashboard: party overview on the left, active encounter/combat tracker on the right, with drill-down into individual sheets and adversary blocks.
- Desktop-first: optimise for 1280px+ width. No mobile breakpoints required in v1.
### 5.2 In-Session Usability
- Resource fields (Health, Focus, Investiture) must be adjustable in 2 clicks or fewer — a +/− stepper is the minimum; a click-to-edit inline input is preferred.
- Condition badges should be visible without scrolling on the main character sheet view.
- The GM combat tracker must be operable with one hand (single click to advance turns).
- Auto-saved state — no 'Save' button. Changes persist immediately to local/session storage.
### 5.3 Clarity & Readability
- Derived stats (Defenses, Modifiers, Max Health, Max Focus) must be visually distinguished from manually entered fields — e.g., different background colour or a lock icon.
- Every auto-calculated value should show its formula on hover or in a tooltip.
- The Stormlight Handbook uses specific terminology throughout (e.g., 'Investiture,' 'Deflect,' 'surge,' 'Ideal'). The tool must use this terminology verbatim — no generic TTRPG language substitutions.
### 5.4 Thematic Aesthetic
- Visual design should evoke the world of Roshar — use of dark blues, storm greys, gold/amber accents. No generic fantasy or D&D styling.
- Stormlight/glowing effects are appropriate for Investiture and Radiant elements.
- Typography: clean and legible at all font sizes above 12px. Avoid decorative fonts in data-heavy areas.
---
## 6. Technical Requirements
*Constraints and architecture notes*
### 6.1 Platform
- Web application. Browser-based. No native app.
- Target browsers: Chrome and Firefox, latest stable versions.
- Minimum viewport: 1280 × 800px.
### 6.2 Data Persistence (v1)
- Local storage or IndexedDB for persisting character and campaign data on the client.
- Data must survive page refresh.
- JSON export/import is the backup and portability mechanism (no cloud sync required in v1).
- If a simple backend is introduced for multi-user session linking, it must not store any personally identifiable information.
### 6.3 Multi-User Session Linking (v1)
- GM generates a session code. Players enter the code to join and see the GM's party view.
- In v1, this can be simulated via shared URL parameters or a lightweight session ID with polling — full WebSocket real-time sync is a v2 concern.
- Player data is stored locally; the GM receives a read-only snapshot on request.
### 6.4 Calculation Engine
- All derived statistics (Defenses, Skill Modifiers, Health Max, Focus Max, Deflect, Movement Rate, Senses Range, Recovery Die, Lifting Capacity) must recalculate reactively on any input change.
- Singer form temporary bonuses must be tracked as a separate layer atop base attributes — the base attributes must not be mutated.
- Stacking rules: talent/condition bonuses with the same name do not stack. The tool may flag duplicate bonus names but does not need to enforce resolution in v1.
### 6.5 Rule Lookup Tables
The following lookup tables from the Handbook must be hardcoded into the calculation engine:
- Movement Rate table (Speed score → feet per action)
- Recovery Die table (Willpower score → die size)
- Senses Range table (Awareness score → feet when primary sense obscured)
- Lifting Capacity table (Strength score → pounds)
- Character Advancement table (Level → attribute points, health gain, skill rank cap, talents)
- Injury Duration table (Injury Roll result → duration category)
---
## 7. Scope, Milestones & Open Questions
*What ships when, and what needs decisions*
### 7.1 v1 Scope Summary
| In Scope (v1) | Out of Scope (v1 — defer to v1.1+) |
|---|---|
| Full character sheet (all P0 CC features) | Dice rolling engine |
| Level-up flow (all P0 LU features) | Real-time WebSocket sync |
| GM party dashboard (P0 GM features) | Mobile / tablet layout |
| Combat tracker with fast/slow phases | Character sheet PDF export |
| Adversary stat block library | Integrated map / grid / VTT |
| Condition & injury tracking | Published stat block database |
| Local persistence (no cloud) | Account authentication |
| Session code for GM/player linking | Cloud save / cross-device sync |
### 7.2 Suggested Milestones
- **Milestone 1 — Character Sheet Alpha:** Static character sheet with manual field entry, basic auto-calculation (defenses, modifiers, health max). No GM tools. Player can create and save a character locally.
- **Milestone 2 — Session-Ready Sheet:** Resource tracking (+/− buttons), condition tracker, injury log, singer form support, full level-up flow. Character is fully playable.
- **Milestone 3 — GM Dashboard:** Party overview, level-up trigger, character drill-down, session notes.
- **Milestone 4 — Combat Tracker:** Encounter setup, fast/slow phase management, per-participant resource and condition tracking, round counter.
- **Milestone 5 — Adversary Management:** Stat block library, encounter integration, Boss feature display.
- **Milestone 6 — Multi-User Linking:** Session code generation, player join flow, GM read-only party sync.
### 7.3 Open Questions
| # | Question | Decision Needed From |
|---|---|---|
| 1 | Should players be able to see each other's character sheets by default, or is that GM-controlled? | GM / table preference |
| 2 | How many characters per player does v1 need to support? One per player, or multiple (e.g., backup characters)? | Product owner |
| 3 | Should the combat tracker also display PC character sheet data live, or show a simplified combat card only? | UX decision |
| 4 | Do we need a 'downtime' activity tracker (see Handbook Chapter 9) in v1? | Product owner |
| 5 | Should the tool include reference tooltips for rule text (e.g., hover over 'Deflect' to read the rule), or is the Handbook the reference? | **Decided: YES — rule reference tooltips are in scope for v1** |
| 6 | What is the hosting environment? Self-hosted local server, GitHub Pages, or cloud deployment? | Product owner / technical lead |
| 7 | Should goals and rewards have a structured format (purpose/obstacle/reward type fields), or is freeform text sufficient? | Product owner |
