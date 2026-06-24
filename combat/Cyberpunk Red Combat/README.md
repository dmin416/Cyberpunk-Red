# Cyberpunk Red Combat

Deterministic Cyberpunk RED combat scaffold. **Mechanics live only in `js/rules/`** as explicit if/else functions.

## Architecture

```
PlayerCommand  →  RuleEngine  →  RuleOutcome  →  GameState + NarrativeLog
```

| Module | Role |
|--------|------|
| `GameState` | Single source of truth (combatants, phase, initiative, flags) |
| `PlayerCommand` | Typed player/NPC intents — never raw strings |
| `RuleEngine` | Switchboard; only place that dispatches rules |
| `RuleInitiative`, `RuleRangedAttack`, … | One file per rule domain; returns `RuleOutcome` |
| `RuleOutcome` | `{ accepted, nextState, narrativeLines, ruleTraceLines }` |
| `GameLoop` | Read state → dispatch → render |
| `NarrativeLog` | Append-only text output (facts from rules, not invented) |
| `UIController` | Buttons → commands; never applies damage directly |

## Run locally

ES modules require a local server (not `file://`):

```bash
cd "combat/Cyberpunk Red Combat"
npx --yes serve .
```

Open **Cyberpunk Red Combat.html** (or the URL ending in `/Cyberpunk%20Red%20Combat.html`).

## Data sources

- **Enemies:** `js/data/EnemyCatalog.js` — CP:R Screamsheets mooks, Interface RED Vol 2 Hardened Mooks, Danger Gal Dossier NPCs
- **Gear:** `js/data/GearCatalog.js` — Night Market Encyclopedia weapons, armor, grenades, ammunition

- Demo encounter (Runner vs Boosterganger)
- Initiative: REF + 1d10
- Ranged attack with range DV or opposed dodge (REF ≥ 8)
- Melee attack opposed roll, half armor
- Simplified armor ablation
- NPC auto-turn after player ends turn

## Not yet implemented

- Move / Run actions, autofire, wound states, critical injuries
- Full range tables, ROF 2 melee, shields, vehicles
- Loading stats from Night Market Encyclopedia

Add new behavior by **adding a rule function** and **wiring it in `RuleEngine.js`** — not in the UI.
