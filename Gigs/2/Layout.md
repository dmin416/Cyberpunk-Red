# Layout — Gig 2

Rough building map for Cleric. Abandoned mid-rise (old cube hotel / walk-up apartments). Psycho has been here long enough to wire the approaches; child is hiding upstairs.

**Scale:** ~3 floors + roof access. Interior corridors ~2–3m wide. Treat each numbered room as a combat zone / encounter beat.

```
STREET
  │
  ▼
[1] Lobby / Front Door ──► [2] Stairwell A (main)
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
           FLOOR 1         FLOOR 2         FLOOR 3
        [3] Hall         [6] Hall        [9] Hall
        [4] Apt A        [7] Apt nest    [10] Child hide
        [5] Apt B        [8] Kill box    [11] Roof hatch
                              │
                              └── psycho patrols 7↔8↔9
```

---

## Floors

### Ground — Approach

| # | Area | Notes |
|---|------|-------|
| **1** | Lobby / front door | Barricaded. Secondary entry: fire exit alley (still trapped). |
| **2** | Stairwell A | Main vertical spine. Most traps stack here — psycho expects frontal assault. |
| **3** | F1 hall | Dark, littered. Leads to empty apts used as decoys. |
| **4** | Apt A | Cleared / looted. Safe-ish once traps on door are handled. |
| **5** | Apt B | Same; optional side loot, not on critical path. |

### Floor 2 — Psycho nest

| # | Area | Notes |
|---|------|-------|
| **6** | F2 hall | Chokepoint into nest. |
| **7** | Nest / lair | Psycho's rest / chrome stash. Grenades, ammo, scrap. |
| **8** | Kill box | Opened wall between two apts; prepared fields of fire + last-line traps. Boss fight likely starts here or spills from 7. |

### Floor 3 — Survivor

| # | Area | Notes |
|---|------|-------|
| **9** | F3 hall | Quieter; psycho doesn't patrol constantly. |
| **10** | Child hide | Closet / bathroom / under debris in a rear apt. Child: Stealth 8, MOVE 4, HP 15. |
| **11** | Roof hatch | Optional exfil. Hatch itself may be trapped; roof is clear. |

**Split objective:** Fastest path to the psycho is **1→2→6→7/8**. Child is **up one more flight** (9→10). Rushing the boss leaves the kid in a building that may still be wired — or the psycho may retreat upstairs if pressured.

---

## Trap budget

**8 traps** total (Hazardous — traps replace Mooks/Lieutenants). Roughly:

- **4** on the main approach (lobby + stairwell + F2 hall)
- **2** in the kill box / nest
- **1** near the child (cruel, not lethal by default — or lethal if you want teeth)
- **1** on the "smart" alternate path (alley / fire exit / roof) so clever routes aren't free

**Passive notice:** When the Crew enters a trapped zone, call for Perception (or let them declare a search). Failure = they trigger it unless someone is specifically sweeping.

**No Demolitions?** Allow Electronics/Security Tech, Weaponstech, or Basic Tech at **+2 DV**, or complimentary checks — same guidance as *Real Estate Rumble*.

---

## Trap table

| ID | Location | Type | Spot (Perception) | Disarm | Trigger / Effect |
|----|----------|------|-------------------|--------|------------------|
| **T1** | Front door / lobby threshold | Tripwire → shotgun shell / nailbomb | **DV13** | Demolitions **DV13** | 3d6 AP in doorway (2m). Loud — psycho knows you're in. |
| **T2** | Lobby → stairwell door | Pressure plate → grenade (AP) | **DV15** | Demolitions **DV15** | AP Grenade blast. Plate under debris; easy to miss if rushing. |
| **T3** | Stairwell A, mid-flight | Wire at ankle height → falling scrap / rebar | **DV13** | Athletics **DV13** to step over *or* Basic Tech **DV13** to cut/secure | 2d6 (ignores armor if scrap falls on head — GM call). Knocks prone on fail. |
| **T4** | Stairwell A, F2 landing | Monofilament / razor wire across landing | **DV17** | Basic Tech **DV15** (or Demolitions **DV13** if explosive-backed) | 4d6 to first through; Aimed-Shot / careful crawl bypasses if spotted. |
| **T5** | F2 hall outside nest | Jar / bottle bomb on string (incendiary or frag) | **DV15** | Demolitions **DV13** | 4d6 or Incendiary in hall. Blocks retreat. |
| **T6** | Kill box (8) entry | Dual trip: SMG panji *or* popup-style claymore facing door | **DV15** | Demolitions **DV17** | 5d6 cone into doorway. Psycho's favorite — leave armed if fighting here. |
| **T7** | Nest (7) chrome stash | Deadman / "don't touch my shit" charge | **DV17** (or automatic if they loot without searching) | Demolitions **DV15** | 4d6 AP. Optional: EMP grenade instead if you want chrome drama. |
| **T8** | F3 — outside child room **or** roof hatch | Needle / noise trap (cans, bells) **or** small charge | **DV13** noise / **DV15** charge | Basic Tech **DV13** / Demolitions **DV13** | **Noise:** psycho hears, starts moving toward F3. **Charge:** 2d6 — enough to hurt the kid if they're adjacent. Pick one tone. |

### Alternate entry (pick one if they bypass the front)

| ID | Location | Type | Spot | Disarm | Effect |
|----|----------|------|------|--------|--------|
| **T1b** | Alley fire exit | Same as T1, cruder | **DV13** | Demolitions **DV13** | Same as T1; replaces T1 if they never use the front. |
| **T8b** | Roof hatch from outside | Hatch wired to grenade | **DV15** | Demolitions **DV15** | Use instead of T8 if they roof-drop. |

Don't run **both** T1 and T1b unless the Crew splits and hits both doors.

---

## DV cheat sheet

| Task | Typical DV |
|------|------------|
| Spot crude trap (wire, cans, obvious plate) | **13** |
| Spot careful trap (hidden plate, mono, stash charge) | **15–17** |
| Disarm simple / cut wire / secure scrap | **13** (Basic Tech or Athletics) |
| Disarm grenade / bottle bomb | **13–15** Demolitions |
| Disarm kill-box claymore / dual setup | **17** Demolitions |
| Bypass spotted trap without disarming | Athletics / Contortionist **DV13–15**, or go around |

**Crit fail on disarm:** Trap goes off on the disarmer (and anyone in blast).  
**Success by 1:** Disarmed but noisy / takes an extra Round.  
**Success by 5+:** Quiet, reusable components (GM fiat — AP grenade salvage, etc.).

---

## Suggested flow

1. **Breach** → T1/T2 → psycho alerted if anything loud.
2. **Climb** → T3/T4 attrition on the stairs.
3. **Choice:** push nest (T5/T6, boss fight) **or** race upstairs for the child (T8 noise risk).
4. **Extract** with MOVE 4 kid — stairwell traps still live if not cleared; psycho may hunt the sound of rescue.

**Timer (optional):** After first loud trap or gunshot, psycho is active. Every **1d6 Rounds** he isn't in combat, he moves one zone toward the loudest noise (or toward the child if he hears T8).
