# Dice Cheat Sheet

How we roll in chat. No Python — PowerShell only. Look up the actor, resolve the formula, bash the die.

## Where to look

| Who | Path |
|-----|------|
| Player sheets (filled) | `Epics/Story */Players/*.md` |
| Character stubs | `Characters/*.md` (often empty — prefer Epics) |
| Gig enemies | `Gigs/<n>/Enemies.md` |
| House LUCK / combat house rules | `Homebrew/Rules.md` |
| Hardened NPC bonus | `Homebrew/GM Rules.md` |

**Skill Base**

- **PCs:** `STAT + Skill level` (skills listed as levels; add the linked STAT yourself).
- **Enemies:** often already listed as **Skill Bases** (pre-summed). Use that number as the base — do not add STAT again.
- **Hardened** enemies: **+2** to attacking and defending Skill Bases (already applied on some sheets; check the gig header).

## Chat shorthand

Say any of these; the roller looks up the named character/enemy and rolls.

| You say | What happens |
|---------|----------------|
| `roll skill Handgun Cleric` / `Cleric Handgun` | `REF + Handgun + 1d10` (vs DV if given) |
| `roll Evasion Specter` / `Specter dodge` | `DEX + Evasion + 1d10` |
| `roll Perception vs DV15` | named actor’s Perception base + 1d10 vs DV |
| `1d10+14` / `d10+14` | roll 1d10, add 14 (base already known) |
| `1d10+#` | same — `#` is the Skill Base or STAT+Skill |
| `5d6` / `3d6` / `Nd6` | damage dice; flag Critical Injury if **≥2 sixes** |
| `init Cleric` / `initiative REF 8` | `REF + 1d10` |
| `death save BODY 12 pen 2` | 1d10 ≤ (BODY − penalty) to live |
| `opposed Cleric Athletics vs psycho Athletics` | both roll; **tie → defender** |
| `luck +2 after` / `spend 2 luck before` | apply house LUCK (see below) |
| `roll SMG autofire` / weapon name | use that weapon’s attack skill + listed DMG |

If the actor or skill is ambiguous, ask once — otherwise pick the open gig / recently mentioned sheet.

## Core formulas (CP:R)

```
Check     = STAT + Skill + 1d10     vs DV  (must beat; tie = fail vs DV / defender wins opposed)
Init      = REF + 1d10
Ranged    = REF + weapon skill + 1d10  vs range DV or dodge
Melee     = DEX + melee skill + 1d10   vs DEX + Evasion + 1d10
Damage    = Nd6; Critical Injury if two or more dice show 6
Death Save= 1d10 ≤ BODY − Death Save Penalty
```

**Nat 10:** roll another 1d10 and **add** (no further explode).  
**Nat 1:** roll another 1d10 and **subtract**.

### DV ladder

| Simple | Everyday | Difficult | Professional | Heroic | Incredible | Legendary |
|--------|----------|-----------|--------------|--------|------------|-----------|
| 9 | 13 | 15 | 17 | 21 | 24 | 29 |

### House LUCK (`Homebrew/Rules.md`)

- Spend **after** seeing the result: **+1 per point**
- Spend **before** the roll (**during a gig only**): **+2 per point**
- Pool refills at gig start/end and weekly XP reset; mid-gig refill from session break is spendable

## PowerShell (instant)

`Get-Random -Maximum` is **exclusive**.

```powershell
# single dice
Get-Random -Minimum 1 -Maximum 11   # 1d10
Get-Random -Minimum 1 -Maximum 7    # 1d6

# helpers (paste once per shell session)
function d10 { Get-Random -Minimum 1 -Maximum 11 }
function d6  { Get-Random -Minimum 1 -Maximum 7 }
function Roll($n, $sides) {
  $dice = 1..$n | ForEach-Object { Get-Random -Minimum 1 -Maximum ($sides + 1) }
  [pscustomobject]@{
    dice  = ($dice -join '+')
    total = ($dice | Measure-Object -Sum).Sum
    crit  = (@($dice | Where-Object { $_ -eq 6 }).Count -ge 2)
  }
}
function Check($base, $dv = $null) {
  $r = d10; $t = $base + $r
  $extra = ''
  if ($r -eq 10) { $x = d10; $t += $x; $extra = " explode+$x" }
  if ($r -eq 1)  { $x = d10; $t -= $x; $extra = " fumble-$x" }
  $vs = if ($null -ne $dv) { " vs DV$dv $(if ($t -gt $dv) { 'HIT' } elseif ($t -eq $dv) { 'TIE (def)' } else { 'MISS' })" } else { '' }
  "1d10=$r$extra  base=$base  total=$t$vs"
}

Check 14 15          # Skill Base 14 vs DV15
Roll 5 6             # 5d6 damage (+ crit flag)
"init=$(8 + (d10))"  # REF 8 initiative
```

### One-liners without helpers

```powershell
# 1d10+14
14 + (Get-Random -Minimum 1 -Maximum 11)

# 5d6
(1..5 | ForEach-Object { Get-Random -Minimum 1 -Maximum 7 } | Measure-Object -Sum).Sum

# NdX
$n=3; $x=6; (1..$n | ForEach-Object { Get-Random -Minimum 1 -Maximum ($x+1) } | Measure-Object -Sum).Sum
```

## Worked examples

**PC skill (levels on sheet)** — Cleric Handgun vs DV15  
`REF 8 + Handgun 2 = base 10` → `Check 10 15`

**Enemy skill base (pre-summed)** — Gig 2 Hardened Cyberpsycho Melee  
Skill Base **19** (Hardened already in sheet) → `Check 19` vs target’s Evasion roll

**Shorthand** — `1d10+19` same as Check base 19 with no DV printed until you add `vs DV#` or opposed roll

**Damage** — Popup Heavy SMG `3d6` → `Roll 3 6`; if `crit: True`, roll Critical Injury table

## Reply format (in chat)

Keep it tight:

1. Actor + formula (with looked-up numbers)
2. Dice result (show faces on damage)
3. Total vs DV / opposed / effect
4. Nat 1/10 or crit injury callout if relevant
