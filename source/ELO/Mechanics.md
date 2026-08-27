# Elflines Online: Mechanics

Rules reference for playing and running ELO. Sources: Interface RED Vol 1-3 (`Source/Full Text.md`). Campaign-specific enemy and loot detail: [`Enemies.md`](Enemies.md), [`Loot.md`](Loot.md), [`Campaign Plan.md`](Campaign%20Plan.md).

---

## Core loop

1. **Rank 0-10** elf on a Citinet server; **gp** economy; gear from the **Armory** and dungeon drops.
2. Most of the world is **Miasma** (harder healing, open **PvP**). **Major cities** and **Camps** are exceptions.
3. **Elflines** (guilds) run dungeons and raids; **death** costs **2000gp** and sends you to last **Camp**.
4. Combat uses CP:R Friday Night Firefight with the alterations below.

---

## Character creation

| Step | Rule |
|------|------|
| Package | Complete Package: **50 STAT**, **60 Skill** points |
| LUCK | **None** on ELO characters |
| STAT range | **3-8** at creation |
| Skills | ELO skill list only; max **6** per skill at creation; no required Basic Skills |
| Language (Elven) | **Level 4** free |
| Gear | **200gp** from Armory; keep leftover gp |
| Name | Elfname |

**Skill Base (PCs):** `STAT + Skill level` (+ modifiers). Max STAT or Skill **10** after all Rank-ups (nothing to 11+).

---

## Skills (ELO list)

Combined or retuned skills vs CP:R. **(x2)** = double cost to buy and improve.

| Skill | STAT | x2 | Notes |
|-------|------|-----|-------|
| Composition/Education | INT | | Lore, puzzles |
| Conceal/Reveal Object | INT | | vs Perception |
| Language (Elven) | INT | | Start at 4 |
| Perception | INT | | Traps, PK, hidden |
| Tracking | INT | | Trails, rare spawns |
| Wilderness Survival | INT | | **Camps** (see Miasma) |
| Archery | REF | yes | Bows; dragon breath uses Shotgun range |
| Pilot Sea Vehicle | REF | | Heart of Miasma boat |
| Athletics/Contortionist | DEX | | Climb, squeeze, swim |
| Brawling | DEX | | Unarmed |
| Evasion/Dance | DEX | yes | **All elves may dodge ranged** with Evasion |
| Melee Weapon | DEX | yes | Half SP on most ELO blades |
| Stealth | DEX | | Skip packs, PK ambush |
| Basic Tech/Weaponstech | TECH | | Repair (ELO timing/cost) |
| First Aid/Paramedic/Surgery | TECH | yes | Stabilize, treat (Miasma limits) |
| Pick Lock/Pick Pocket | TECH | | Combined CP:R skills |
| Play Instrument | TECH | | Social/RP |
| Persuasion/Trading | COOL | | NPCs use **ELO** base |
| Concentration | WILL | | Fear, long raids |
| Endurance/Resist Torture/Drugs | WILL | | Poison, grind |
| Animal Handling | EMP | | ELO uses EMP not INT |
| Riding | EMP | | Mounts; Elite Gremlin mounted rule |

Full blurbs: [`Source/Full Text.md`](Source/Full%20Text.md) → Skill List.

---

## Checks and dice

Same as CP:R unless noted:

| Roll | Formula |
|------|---------|
| Skill Check | Skill Base + 1d10 vs DV (beat; tie fails vs static DV) |
| Opposed | Both roll; **tie → defender** |
| Nat 10 | +1d10 add |
| Nat 1 | +1d10 subtract |
| Damage | Nd6; **≥2 sixes → Critical Injury** |
| Init | REF + 1d10 |

**Enemies:** often list **Skill Bases** already summed. Do not add STAT again.

**Hardened (ELO bosses):** +2 to all attacking and defending Skill Bases ([`Homebrew/GM Rules.md`](../Homebrew/GM%20Rules.md)).

**Dice in chat:** [`Homebrew/Dice.md`](../Homebrew/Dice.md) (PowerShell `Get-Random`).

**House LUCK:** [`Homebrew/Rules.md`](../Homebrew/Rules.md) (CP:R characters at the table; optional for ELO scenes).

---

## Miasma

**Where:** Everywhere except **Major Cities** and **Camps** (Wilderness Survival).

| In Miasma | Effect |
|-----------|--------|
| Healing | No accelerated heal after stabilize; **no Treatments** |
| PvP | Enabled vs players **not in your Elfline** |
| PK payout | Killer gets **1000gp** from victim's death tax / Revive Sickness payment (even weeks later) |

**Camp (Wilderness Survival):** Temporary bubble. Suppresses Miasma effects in that pocket (heal block + PvP flag). Required for solo leveling routes outside cities.

**Major cities (safe):** Elfhold, Autumn Palace, Port Treasure hubs inside walls, etc. See [`Locations.md`](Locations.md).

---

## Combat alterations

| Rule | ELO |
|------|-----|
| Dodge ranged | **Any character** may use Evasion/Dance vs ranged (not REF 8+ gate) |
| Fight pace | Encounters tuned **faster** than street CPR; run more combats |
| Repairs | **1 minute**; **half** CP:R gp cost |
| Aimed Shots | As CP:R (Cursed Head Head-only, mounted Gremlins, etc.) |
| Shield | 10 HP movable cover; interpose vs seen attacks; no dodge that attack |

**Half SP:** Most ELO melee ignores half defender SP (round up). Bows use normal ablation unless item says otherwise.

---

## Healing

| Situation | Rule |
|-----------|------|
| Out of combat, **not in Miasma** | Stabilized → **full HP in ~1 minute** |
| Out of combat, **in Miasma** | No accelerated post-stabilize healing |
| Quick Fixed crit, **not in Miasma** | Immediately **Treated** |
| Treatment skill | **Cannot** attempt inside Miasma |
| **Sacred Herbs** (50gp) | If not Mortally Wounded: heal **BODY + WILL** HP instantly; anyone; no cooldown |

Sacred Herbs are the main in-combat heal in Miasma zones.

---

## Death, tax, and Revive Sickness

| Event | Result |
|-------|--------|
| **0 HP** | Death; teleport to **last Camp** |
| **Death tax** | **2000gp** sacrificed on death |
| Can't pay 2000gp | **Revive Sickness**: MOVE **1** until you pay 2000gp |
| Buy gp | **1eb = 100gp** (Paying to Win); 2000gp = 20eb |
| **PK in Miasma** | Killer +1000gp when victim pays tax or clears Revive Sickness |

No CP:R Death Save loop for ELO characters at 0 HP: you die and respawn at camp.

---

## PvP and intel

| Item / rule | Effect |
|-------------|--------|
| **Shadow's Charm** | Hides you on map from **item scrying** |
| **Whispering Orb** | Every 5 min: direction to closest player outside your Elfline **without** Shadow's Charm |
| **Miasma** | PvP legal vs non-Elfline |
| **Duel Flag** (TCG promo) | Mutually agreed duel outside Miasma; loser to 1 HP, winner full heal |

Hotspots: Elfhold gate, Black Mountain Pass, Scorched Pass. See [`Locations.md`](Locations.md) PvP table.

---

## Character progression

| Rank | Improvement |
|------|-------------|
| **0** | Start |
| **1-3** | +1 STAT each (mandatory; only option these ranks) |
| **4-10** | Choose one: +2 to one **(x2)** skill, **or** +2 to two normal skills |
| Cap | No STAT or Skill above **10** |

**Rank 3 title** (most STAT increases):

| STAT raised most | Title |
|------------------|-------|
| INT | Sage |
| REF | Bowmaster |
| DEX | Bladedancer |
| TECH | Quickhand |
| COOL | Warmheart |
| WILL | Wildblood |
| MOVE | Windkin |
| BODY | Barkshield |
| EMP | Druid |
| Even spread | Wayfarer |

Rank-ups typically follow quests or dungeon clears (GM).

---

## Armory

Full vendor tables, poison rules, special gear, and loot catalog: [`Armory.md`](Armory.md).

Summary: **200gp** starting kit; vendor armor SP 4-15; melee **half SP**; **Sacred Herbs** heal BODY+WILL; poison bypasses ablation (DV13 or 2d6 direct HP). **Slime Cloak** = ELO poison immunity.

---

## Monsters (summary)

| Modifier | Effect |
|----------|--------|
| **Elite** | Per-type line (HP, SP, damage, ROF). See [`Enemies.md`](Enemies.md) |
| **Hardened** | +2 all attack/defend Skill Bases |
| **Pop! (Slime)** | On crit trigger, dies immediately (no crit table). Elite Slime only dies via Pop! |
| **Floating Head** | Cursed Head: Aimed Shots to Head only |
| **Bloodrage (Gremlin)** | +1 ROF all weapons while Seriously Wounded |
| **Reskin rule** | CP:R mook → Archery/Melee + themed gear = ELO type |

Full blocks: [`Enemies.md`](Enemies.md). Nine published types + Horned Rabbit (homebrew).

---

## Economy

| Topic | Rule |
|-------|------|
| **Subscription** | 20eb/month per character (Generic Prepak+ includes ELO) |
| **Headset + game** | Rush Revolution 500eb; ELO copy 50eb |
| **Buy gp** | 1eb = 100gp anytime |
| **Sell loot** | ELO items trade on The Street like any commodity; use Fixer |
| **Account sale** | Rank 10 character ~500eb (book flavor) |
| **Trash drops** | gp, Monster Part (50gp), Armory items (~5-10%) |
| **Boss drops** | Low %; final boss gp ≈ Job payout for dungeon tier |

Loot tables: [`Loot.md`](Loot.md). Published prose: [`Source/Full Text.md`](Source/Full%20Text.md) → Dungeon Loot.

---

## Elflines, raids, and locks

**Elfline:** Guild/party (up to raid size). Family unit for scheduling and loot drama.

| Content | Roster | Notes |
|---------|--------|-------|
| Most dungeons | 3+ recommended early | Old Hero's Point etc. |
| **Twisted Eldertree** | 7 | Prereq: Charred Grove clear |
| **Flooded Palace** | 7 | **2-hour** timer; boat from Port Treasure |
| **Pit of Dragons** | 7 | **1 attempt/week** on fail; charter needs Twisted clear |
| **Warlock's Tower** | 7 skilled | Elite trash + Hardened |
| **Heart of Miasma** | **4 Elflines** (alliances) | 1 chamber/Elfline/week; 3 hr; sync finale |

Travel gates: [`Campaign Plan.md`](Campaign%20Plan.md) → Travel & access.

---

## Meat world vs ELO

| Context | Which character |
|---------|-----------------|
| ELO NPC quest dialogue | **ELO** Skill Base |
| Persuading another **player** at the keyboard | **CP:R** Skill Base |
| Real-world theft, threats, braindance hardware | **Edgerunner** play |
| "Can't pause an online game" | GM intrusion hook |

GMs may run parallel scenes (job vs raid night, PK at the door).

---

## GM guidelines

1. **Steal CP:R statblocks;** reskin as ELO monsters ([`Enemies.md`](Enemies.md) reskin rule).
2. **Run more, shorter fights** than street CPR.
3. **Segotari stingy loot:** Excellent Quality armory weapons as boss template; weeks for bis.
4. **Green Dragon spike:** Pyro + flamethrower when party is comfortable (`Enemies.md`).
5. **Hardened** on dungeon/raid bosses; check if Skill Bases already include +2.
6. **Miasma** on unless city or camp.
7. **Real world intrudes:** calls, shifts, multiboxers, account bans (Expansion Pack flavor).

---

## Quick reference card

```
Check     = Skill Base + 1d10     (PC: STAT + Skill)
Dodge     = Everyone vs ranged via Evasion/Dance
Damage    = Nd6; 2+ sixes = Critical Injury
0 HP      = Die → Camp; 2000gp tax or Revive Sickness (MOVE 1)
Miasma    = No heal acceleration; no Treatments; PvP vs other Elflines
Camp      = Wilderness Survival; suppresses Miasma locally
Sacred Herbs = BODY+WILL heal; not Mortally Wounded
Repair    = 1 min; half gp
Rank 1-3  = +1 STAT; Rank 4-10 = +2 one x2 skill OR +2 two normals (max 10)
```

---

## Related files

| File | Contents |
|------|----------|
| [`Armory.md`](Armory.md) | Vendor gear, poison, special items |
| [`Loot.md`](Loot.md) | Drop tables, trash rolls, raid bundles |
| [`Source/Full Text.md`](Source/Full%20Text.md) | Published rules text, armory, loot, monsters |
| [`Enemies.md`](Enemies.md) | Stat blocks, legendary items |
| [`Campaign Plan.md`](Campaign%20Plan.md) | A-Z path, ranks, travel gates |
| [`Locations.md`](Locations.md) | Zones, Sylar blurbs, PvP |
| [`Homebrew Monsters.md`](Homebrew%20Monsters.md) | Horned Rabbit |
| [`Homebrew/Dice.md`](../Homebrew/Dice.md) | How to roll in chat |
| [`Homebrew/GM Rules.md`](../Homebrew/GM%20Rules.md) | Hardened definition |
