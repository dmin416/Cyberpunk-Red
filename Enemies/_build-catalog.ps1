# Build Enemies/ catalog from source combat sheets.
# Run from repo root: powershell -File Enemies/_build-catalog.ps1
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
Set-Location $root

$outDir = Join-Path $root 'Enemies'
$sheetsDir = Join-Path $outDir 'Sheets'
New-Item -ItemType Directory -Force -Path $sheetsDir | Out-Null

$script:TriOpen = [char]0x25B6   # ▶
$script:TriClose = [char]0x25C0  # ◀
$script:RxTriHeader = '^### ' + [regex]::Escape([string]$script:TriOpen) + ' (.+) ' + [regex]::Escape([string]$script:TriClose) + '\s*$'
$script:RxTriAny = '^### ' + [regex]::Escape([string]$script:TriOpen) + ' .+ ' + [regex]::Escape([string]$script:TriClose) + '\s*$'

function Get-Utf8([string]$Path) {
  return Get-Content -LiteralPath $Path -Encoding UTF8
}

function Extract-TriangleSheets {
  param([string]$Path, [string]$SourceLabel, [string]$FactionHint = '')
  if (-not (Test-Path -LiteralPath $Path)) {
    Write-Host ("SKIP missing: " + $Path)
    return ,[object[]]@()
  }
  $lines = Get-Utf8 $Path
  $sheets = [System.Collections.Generic.List[object]]::new()
  $i = 0
  while ($i -lt $lines.Count) {
    if ($lines[$i] -match $script:RxTriHeader) {
      $name = $Matches[1].Trim()
      $start = $i
      $i++
      while ($i -lt $lines.Count -and $lines[$i] -notmatch $script:RxTriAny -and $lines[$i] -notmatch '^## [^#]') {
        $i++
      }
      $blockLines = $lines[$start..($i - 1)]
      $block = ($blockLines -join "`n")
      if ($block -match 'Skill Bases' -or $block -match '\| HP \|' -or $block -match '\*\*HP') {
        $faction = $FactionHint
        for ($j = $start; $j -ge 0; $j--) {
          if ($lines[$j] -match '^## (.+)$' -and $lines[$j] -notmatch '^## Contents') {
            $candidate = $Matches[1].Trim()
            if ($candidate -match 'Street|Bozo|Maelstrom|Tyger|Puma|Trauma|NCPD|Zoner|Piranha|Sightseer|Monster|Network|Digital|Generation|Edgerunner|Inquisitor|Philharmonic|Corporate|Fixer') {
              $faction = $candidate
              break
            }
            if ($candidate.Length -lt 40 -and $candidate -notmatch '^(Welcome|Introduction|Contents|Goals|Turf|Members|Incident|List|Table)') {
              $faction = $candidate
              break
            }
          }
        }
        $clean = ($blockLines | Where-Object { $_ -notmatch '^\*Art by' }) -join "`n"
        $sheets.Add([pscustomobject]@{
            Name    = $name
            Faction = $faction
            Source  = $SourceLabel
            Path    = $Path
            Block   = $clean
          })
      }
      continue
    }
    $i++
  }
  Write-Host ("  " + $SourceLabel + ": " + $sheets.Count + " from " + $Path)
  return ,$sheets.ToArray()
}

function Extract-StatHeaders {
  param(
    [string]$Path,
    [string]$SourceLabel,
    [string]$HeaderPattern = '^### (.+)$',
    [string]$FactionHint = ''
  )
  if (-not (Test-Path -LiteralPath $Path)) {
    Write-Host ("SKIP missing: " + $Path)
    return ,[object[]]@()
  }
  $lines = Get-Utf8 $Path
  $sheets = [System.Collections.Generic.List[object]]::new()
  $skipName = '^(Contents|Mooks and Grunts|Encounters|Regional|The Rest of the Story|The Setting|The Opposition|The Hook|Beat Chart|Downtime|Resolution|Rumors|Obstacles|Frequency|Who Runs It|What Does It Sell|Where Is It Held|How Do You Score|Getting In On the Action|Security|Booth Map|Base of Operations|Recent History|Resources|Goals|NPC Tokens|New Cyberware|The Next Gen|Keeping a Cyberpet|Training a Cyberpet|Cybering a Cyberpet|Four Cyberpet Hooks|Cyberpet|NET Architecture|Bloodhound Notes|The Shroomers)$'
  $skipPrefix = '^(Dev |Cliff |OpDev |OpCliff |Climax |Resolution |Downtime)'
  $i = 0
  while ($i -lt $lines.Count) {
    if ($lines[$i] -match $HeaderPattern) {
      $name = $Matches[1].Trim()
      # Normalize "Name — NPC Stat Block"
      $name = ($name -replace '\s*[—–-]\s*NPC Stat Block\s*$','').Trim()
      if ($name -match $skipName -or $name -match $skipPrefix) { $i++; continue }
      if ($name -match 'Sheet Layout|Make Your Own|▶') { $i++; continue }
      if ($lines[$i] -match $script:RxTriAny) { $i++; continue } # handled elsewhere
      $start = $i
      $i++
      while ($i -lt $lines.Count -and $lines[$i] -notmatch $HeaderPattern -and $lines[$i] -notmatch '^## [^#]' -and $lines[$i] -notmatch $script:RxTriAny) {
        # For ## extractor, stop at next ## only (HeaderPattern already ##)
        $i++
      }
      # If HeaderPattern is ###, also stop at ##
      # already handled by '^## [^#]' in while for ### case - but HeaderPattern for ## is '^## (.+)$' so '^## [^#]' would stop immediately... 
      # Fix: only stop on ## when extracting ###
      $blockLines = $lines[$start..($i - 1)]
      $block = $blockLines -join "`n"
      $isCombat = ($block -match 'Skill Bases') -or ($block -match '(?i)\*\*Skills?:\*\*') -or ($block -match '(?i)^Skills:') -or ($block -match 'Seriously Wounded' -and $block -match '\| INT \|') -or ($block -match 'Combat #' -and $block -match '(?i)Evasion')
      if (-not $isCombat) { continue }
      # Require some combat signal beyond flavor
      if ($block -match 'Seriously Wounded' -or $block -match 'Skill Bases' -or $block -match '(?i)Evasion\s+\d+') {
        $cleanName = $name -replace '™','' -replace '®',''
        $sheets.Add([pscustomobject]@{
            Name    = $cleanName
            Faction = $FactionHint
            Source  = $SourceLabel
            Path    = $Path
            Block   = ($blockLines | Where-Object { $_ -notmatch '^\*Art by' }) -join "`n"
          })
      }
      continue
    }
    $i++
  }
  Write-Host ("  " + $SourceLabel + ": " + $sheets.Count + " from " + $Path)
  return ,$sheets.ToArray()
}

function Extract-StatH3 {
  param([string]$Path, [string]$SourceLabel, [string]$FactionHint = '')
  # Custom loop so ## stops ### sections correctly
  if (-not (Test-Path -LiteralPath $Path)) {
    Write-Host ("SKIP missing: " + $Path)
    return ,[object[]]@()
  }
  $lines = Get-Utf8 $Path
  $sheets = [System.Collections.Generic.List[object]]::new()
  $skipName = '^(Contents|Mooks and Grunts|Encounters|Regional Variation|The Rest of the Story|The Setting|The Opposition|The Hook|Beat Chart|Downtime|Rumors|Obstacles|Frequency|Who Runs It\?|What Does It Sell\?|Where Is It Held\?|How Do You Score An Invite\?|Getting In On the Action|Security|Booth Map|NPC Tokens|New Cyberware|The Next Gen of Cyberpets|Keeping a Cyberpet|Training a Cyberpet|Cybering a Cyberpet|Four Cyberpet Hooks|Cyberpet® Line|Cyberpet\+® Line|NET Architecture & NPC Stat Blocks|The Shroomers|Mrs\. Suzuki — NPC Stat Block|Sweetbriar — NPC Stat Block)$'
  $i = 0
  while ($i -lt $lines.Count) {
    if ($lines[$i] -match '^### (.+)$') {
      $raw = $Matches[1].Trim()
      if ($lines[$i] -match $script:RxTriAny) { $i++; continue }
      $name = ($raw -replace '\s*[—–-]\s*NPC Stat Block\s*$','').Trim()
      if ($raw -match $skipName -or $name -match '^(Dev |Cliff |OpDev |OpCliff |Climax |Resolution |Downtime)') { $i++; continue }
      if ($name -match 'Sheet Layout|Make Your Own') { $i++; continue }
      $start = $i
      $i++
      while ($i -lt $lines.Count -and $lines[$i] -notmatch '^### ' -and $lines[$i] -notmatch '^## [^#]') { $i++ }
      $blockLines = $lines[$start..($i - 1)]
      $block = $blockLines -join "`n"
      $isCombat = ($block -match 'Skill Bases') -or ($block -match '(?i)\*\*Skills?:\*\*') -or ($block -match 'Seriously Wounded') -or ($block -match 'Combat #')
      if ($isCombat -and ($block -match '(?i)Evasion' -or $block -match 'Skill Bases' -or $block -match '\| INT \|' -or $block -match 'Combat #')) {
        $cleanName = ($name -replace '™','' -replace '®','').Trim()
        # Skip pointer-only stubs (very short)
        if (($blockLines.Count -lt 8) -and ($block -notmatch 'Skill Bases') -and ($block -notmatch '(?i)\*\*Skills')) { continue }
        $sheets.Add([pscustomobject]@{
            Name    = $cleanName
            Faction = $FactionHint
            Source  = $SourceLabel
            Path    = $Path
            Block   = ($blockLines | Where-Object { $_ -notmatch '^\*Art by' }) -join "`n"
          })
      }
      continue
    }
    $i++
  }
  Write-Host ("  " + $SourceLabel + ": " + $sheets.Count + " from " + $Path)
  return ,$sheets.ToArray()
}

function Extract-StatH2 {
  param([string]$Path, [string]$SourceLabel)
  if (-not (Test-Path -LiteralPath $Path)) { return ,[object[]]@() }
  $lines = Get-Utf8 $Path
  $sheets = [System.Collections.Generic.List[object]]::new()
  $i = 0
  while ($i -lt $lines.Count) {
    if ($lines[$i] -match '^## (.+)$' -and $lines[$i] -notmatch '^## Contents') {
      $name = $Matches[1].Trim()
      if ($name -match '^(Contents|Introduction|Base of Operations|Recent History|Resources|Goals)') { $i++; continue }
      $start = $i
      $i++
      while ($i -lt $lines.Count -and $lines[$i] -notmatch '^## ') { $i++ }
      $blockLines = $lines[$start..($i - 1)]
      $block = $blockLines -join "`n"
      if ($block -match 'Seriously Wounded' -and ($block -match '(?i)Evasion' -or $block -match '(?i)\*\*Skills')) {
        $sheets.Add([pscustomobject]@{
            Name    = $name
            Faction = 'VA-11 HALL-A'
            Source  = $SourceLabel
            Path    = $Path
            Block   = $blockLines -join "`n"
          })
      }
      continue
    }
    $i++
  }
  Write-Host ("  " + $SourceLabel + ": " + $sheets.Count + " from " + $Path)
  return ,$sheets.ToArray()
}

function Get-QuickStats([string]$Block) {
  $hp = ''
  if ($Block -match '\| HP (\d+)') { $hp = $Matches[1] }
  elseif ($Block -match '(?m)^\*\*HP[:\*]*\s*(\d+)') { $hp = $Matches[1] }
  if (-not $hp -and $Block -match '(?s)\| HP \| Seriously Wounded \| Death Save \|\r?\n\|[-\s|]+\|\r?\n\|\s*(\d+)') {
    $hp = $Matches[1]
  }
  if (-not $hp -and $Block -match 'HP\s+(\d+)\s*·') { $hp = $Matches[1] }

  $evasion = ''
  if ($Block -match 'Evasion\s+(\d+(?:\s*\(\d+\))?)') { $evasion = $Matches[1] }

  $armor = ''
  $hSp = $null; $bSp = $null
  if ($Block -match '(?m)^\|\s*Head\s*\|\s*[^|]+\|\s*(\d+)\s*\|') { $hSp = $Matches[1] }
  if ($Block -match '(?m)^\|\s*Body\s*\|\s*[^|]+\|\s*(\d+)\s*\|') { $bSp = $Matches[1] }
  if (-not $hSp -and $Block -match '(?m)^\|\s*Head\s*\|\s*(\d+)\s*\|') { $hSp = $Matches[1] }
  if (-not $bSp -and $Block -match '(?m)^\|\s*Body\s*\|\s*(\d+)\s*\|') { $bSp = $Matches[1] }
  if ($hSp -and $bSp) { $armor = "SP $hSp/$bSp" }
  elseif ($Block -match '(?i)Head:\s*[^S\n]*SP\s*(\d+).*Body:\s*[^S\n]*SP\s*(\d+)') { $armor = "SP $($Matches[1])/$($Matches[2])" }
  elseif ($Block -match '(?i)\(Head\s+(\d+)\s*SP,\s*Body\s+(\d+)\s*SP\)') { $armor = "SP $($Matches[1])/$($Matches[2])" }
  elseif ($Block -match '(?i)SP\s+(\d+)\s*\(body\).*SP\s+(\d+)\s*\(head\)') { $armor = "SP $($Matches[2])/$($Matches[1])" }

  $role = ''
  if ($Block -match '(?m)^([^\n|#]{8,140})\r?\n\r?\n\| INT \|') { $role = $Matches[1].Trim() }
  elseif ($Block -match '\*\*(Hardened [^ *]+|[A-Za-z]+)\*\*') { $role = $Matches[1].Trim() }

  $tier = ''
  if ($Block -match '(?i)Hardened Mini') { $tier = 'Hardened Mini-Boss' }
  elseif ($Block -match '(?i)Hardened Lieutenant') { $tier = 'Hardened Lieutenant' }
  elseif ($Block -match '(?i)Hardened Mook') { $tier = 'Hardened Mook' }
  elseif ($Block -match '(?i)Hardened Boss') { $tier = 'Hardened Boss' }
  elseif ($role -match 'Mini-?Boss' -or $Block -match '\(Mini-?Boss\)') { $tier = 'Mini-Boss' }
  elseif ($role -match 'Lieutenant' -or $Block -match '\(Lieutenant\)') { $tier = 'Lieutenant' }
  elseif ($role -match '(?<!Mini[ -])Boss' -or $Block -match ',\s*Boss' -or $Block -match '\*\*Boss\*\*') { $tier = 'Boss' }
  elseif ($role -match 'Mook' -or $Block -match '\(Mook\)' -or $Block -match '\*\*Mook\*\*') { $tier = 'Mook' }

  return [pscustomobject]@{ HP = $hp; Evasion = $evasion; Armor = $armor; Role = $role; Tier = $tier }
}

function Convert-ToCatalogEntry($sheet) {
  $q = Get-QuickStats $sheet.Block
  $sb = [System.Text.StringBuilder]::new()
  [void]$sb.AppendLine("## $($sheet.Name)")
  [void]$sb.AppendLine('')
  $meta = @()
  if ($q.Tier) { $meta += "**$($q.Tier)**" }
  if ($sheet.Faction) { $meta += $sheet.Faction }
  $meta += $sheet.Source
  if ($q.HP) { $meta += "HP $($q.HP)" }
  if ($q.Armor) { $meta += $q.Armor }
  if ($q.Evasion) { $meta += "Evasion $($q.Evasion)" }
  [void]$sb.AppendLine(($meta -join ' / '))
  if ($q.Role -and $q.Role -notmatch '^###') {
    [void]$sb.AppendLine('')
    [void]$sb.AppendLine("*$($q.Role)*")
  }
  [void]$sb.AppendLine('')
  # Strip the ### header line from block (we already have ##)
  $body = ($sheet.Block -split "`n" | Select-Object -Skip 1) -join "`n"
  $body = $body.Trim()
  [void]$sb.AppendLine($body)
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('---')
  [void]$sb.AppendLine('')
  return [pscustomobject]@{
    Name = $sheet.Name
    Faction = $sheet.Faction
    Source = $sheet.Source
    HP = $q.HP
    Evasion = $q.Evasion
    Armor = $q.Armor
    Tier = $q.Tier
    Role = $q.Role
    Markdown = $sb.ToString()
    Anchor = ($sheet.Name.ToLower() -replace '[^a-z0-9]+','-').Trim('-')
  }
}

$all = [System.Collections.Generic.List[object]]::new()

function Add-Sheets($arr) {
  foreach ($s in @($arr)) {
    if ($null -eq $s) { continue }
    if ($s.Name -match 'Sheet Layout|Make Your Own') { continue }
    $all.Add($s)
  }
}

# --- Core Screamsheets (named allowlist) ---
$coreNames = @(
  'Bodyguard','Boosterganger','Road Ganger','Security Operative',
  'Netrunner','Reclaimer Chief','Security Officer','Outrider','Pyro','Cyberpsycho'
)
$coreAll = Extract-StatH3 -Path 'source\Source Text\Core Rulebook\17 Screamsheets.md' -SourceLabel 'CP:R Screamsheets'
foreach ($s in $coreAll) {
  if ($coreNames -contains $s.Name) { $all.Add($s) }
}

# --- Hardened ---
foreach ($pair in @(
    @{ P = 'source\Source Text\Interface RED Vol 2\01 Hardened Mooks.md'; L = 'IR2 Hardened Mooks' },
    @{ P = 'source\Source Text\Interface RED Vol 2\02 Hardened Lieutenants.md'; L = 'IR2 Hardened Lieutenants' },
    @{ P = 'source\Source Text\Interface RED Vol 3\01 Hardened Mini Bosses.md'; L = 'IR3 Hardened Mini Bosses' }
  )) {
  Add-Sheets (Extract-TriangleSheets -Path $pair.P -SourceLabel $pair.L)
}

# --- DGD ---
Add-Sheets (Extract-TriangleSheets -Path 'source\Source Text\Danger Gal Dossier\02 The Factions.md' -SourceLabel 'DGD')

# --- DGD+ / Incident (### with Skill Bases, not triangles) ---
Add-Sheets (Extract-StatH3 -Path 'source\Source Text\Danger Gal Dossier+\03 The Incident.md' -SourceLabel 'DGD+ Incident')
Add-Sheets (Extract-StatH3 -Path 'source\Source Text\Danger Gal Dossier+\04 Bonus Bozo NPC.md' -SourceLabel 'DGD+ Bonus Bozo')
Add-Sheets (Extract-StatH3 -Path 'source\Source Text\Danger Gal Dossier\04 The Incident.md' -SourceLabel 'DGD Incident')

# --- IR Jumpstart (triangles) + other IR ---
Add-Sheets (Extract-TriangleSheets -Path 'source\Source Text\Interface RED Vol 2\04 Jumpstart Kit Conversion Guide.md' -SourceLabel 'IR2 Jumpstart Conversion')
Add-Sheets (Extract-StatH3 -Path 'source\Source Text\Interface RED Vol 5\04 Your New Best Friend.md' -SourceLabel 'IR5 Cyberpets')
Add-Sheets (Extract-StatH3 -Path 'source\Source Text\Interface RED Vol 5\09 Solo of Fortune 2045.md' -SourceLabel 'IR5 Solo of Fortune')
Add-Sheets (Extract-StatH3 -Path 'source\Source Text\Interface RED Vol 4\07 Halloween Screamsheets.md' -SourceLabel 'IR4 Halloween')
# Also triangles in Halloween if any
Add-Sheets (Extract-TriangleSheets -Path 'source\Source Text\Interface RED Vol 4\07 Halloween Screamsheets.md' -SourceLabel 'IR4 Halloween')

# --- Black Chrome ---
Add-Sheets (Extract-StatH3 -Path 'source\Source Text\Black Chrome\11 Night Markets.md' -SourceLabel 'Black Chrome Night Markets')

# --- Mixing Drinks (## headers) ---
Add-Sheets (Extract-StatH2 -Path 'source\Source Text\Mixing Drinks Changing Lives\02 VA-11 HALL-A Faction Dossier.md' -SourceLabel 'Mixing Drinks VA-11 HALL-A')

# --- Tales Street Stories ---
$ssDir = 'source\Source Text\Tales of the RED Street Stories'
Get-ChildItem -LiteralPath $ssDir -Filter '*.md' | ForEach-Object {
  if ($_.Name -match '^(Index|01 |11 )') { return }
  $label = 'T:SS / ' + ($_.BaseName -replace '^\d+ ','')
  Add-Sheets (Extract-StatH3 -Path $_.FullName -SourceLabel $label)
}

# --- Tales Hope Reborn ---
$hrDir = 'source\Source Text\Tales of the RED Hope Reborn'
if (Test-Path -LiteralPath $hrDir) {
  Get-ChildItem -LiteralPath $hrDir -Filter '*.md' | ForEach-Object {
    if ($_.Name -match '^(Index|01 )') { return }
    $label = 'T:Hope / ' + ($_.BaseName -replace '^\d+ M\d+ ','')
    Add-Sheets (Extract-StatH3 -Path $_.FullName -SourceLabel $label)
  }
}

# Deduplicate by Name+Source (keep first)
$seen = @{}
$unique = [System.Collections.Generic.List[object]]::new()
foreach ($s in $all) {
  $key = "$($s.Source)||$($s.Name)"
  if ($seen.ContainsKey($key)) { continue }
  $seen[$key] = $true
  $unique.Add($s)
}

Write-Host "Extracted $($unique.Count) sheets"

# Group into output files
$groups = [ordered]@{
  '01-Core-Screamsheets' = { param($s) $s.Source -eq 'CP:R Screamsheets' }
  '02-Hardened'          = { param($s) $s.Source -match 'Hardened' }
  '03-Danger-Gal-Dossier'= { param($s) $s.Source -match '^DGD' }
  '04-Tales-Street-Stories' = { param($s) $s.Source -match '^T:SS' }
  '05-Tales-Hope-Reborn' = { param($s) $s.Source -match '^T:Hope' }
  '06-Interface-RED-Other' = { param($s) $s.Source -match '^IR' -and $s.Source -notmatch 'Hardened' }
  '07-Black-Chrome'      = { param($s) $s.Source -match 'Black Chrome' }
  '08-Mixing-Drinks'     = { param($s) $s.Source -match 'Mixing Drinks' }
}

$indexRows = [System.Collections.Generic.List[object]]::new()
$fileLinks = [System.Collections.Generic.List[string]]::new()

foreach ($gName in $groups.Keys) {
  $pred = $groups[$gName]
  $subset = @($unique | Where-Object { & $pred $_ } | Sort-Object Faction, Name)
  if ($subset.Count -eq 0) { continue }
  $entries = @($subset | ForEach-Object { Convert-ToCatalogEntry $_ })
  $filePath = Join-Path $sheetsDir "$gName.md"
  $sb = [System.Text.StringBuilder]::new()
  [void]$sb.AppendLine("# $($gName -replace '^\d+-','' -replace '-',' ')")
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine("Combat sheets auto-extracted from source. Skill Bases are pre-summed (do not add STAT).")
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine(('**Count:** ' + $entries.Count + ' / [Catalog](../Catalog.md)'))
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('## Index')
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('| Name | Faction | HP | Evasion | Armor | Source |')
  [void]$sb.AppendLine('|------|---------|----|---------|-------|--------|')
  foreach ($e in $entries) {
    $link = '[' + $e.Name + '](#' + $e.Anchor + ')'
    [void]$sb.AppendLine('| ' + $link + ' | ' + $e.Faction + ' | ' + $e.HP + ' | ' + $e.Evasion + ' | ' + $e.Armor + ' | ' + $e.Source + ' |')
    $indexRows.Add([pscustomobject]@{
        Name = $e.Name
        Faction = $e.Faction
        HP = $e.HP
        Evasion = $e.Evasion
        Armor = $e.Armor
        Tier = $e.Tier
        Source = $e.Source
        File = "Sheets/$gName.md"
        Anchor = $e.Anchor
      })
  }
  [void]$sb.AppendLine('')
  [void]$sb.AppendLine('---')
  [void]$sb.AppendLine('')
  foreach ($e in $entries) {
    [void]$sb.Append($e.Markdown)
  }
  [System.IO.File]::WriteAllText($filePath, $sb.ToString(), [System.Text.UTF8Encoding]::new($false))
  $label = ($gName -replace '^\d+-','' -replace '-',' ')
  $fileLinks.Add(('- [' + $label + '](Sheets/' + $gName + '.md) - **' + $entries.Count + '** sheets'))
  Write-Host "Wrote $gName ($($entries.Count))"
}

# Master Catalog.md
$cat = [System.Text.StringBuilder]::new()
[void]$cat.AppendLine('# Enemy Catalog')
[void]$cat.AppendLine('')
[void]$cat.AppendLine('Every combat-ready enemy/NPC sheet found in the source library, extracted for table use.')
[void]$cat.AppendLine('')
[void]$cat.AppendLine('**Skill Bases** = STAT + Skill (+ mods). Roll **Skill Base + 1d10**. Do not add STAT again.')
[void]$cat.AppendLine('')
[void]$cat.AppendLine('| Tier | Count vs Edgerunners |')
[void]$cat.AppendLine('|------|----------------------|')
[void]$cat.AppendLine('| Mook | 1 per PC (2:1 if combat-heavy) |')
[void]$cat.AppendLine('| Lieutenant | 1 per 2 PCs |')
[void]$cat.AppendLine('| Mini-Boss | 1 per 3 PCs |')
[void]$cat.AppendLine('| Boss | Full fight |')
[void]$cat.AppendLine('| Hardened * | Same ratios, Hardened Crew only |')
[void]$cat.AppendLine('')
[void]$cat.AppendLine('Hardened rules: [Homebrew/GM Rules.md](../Homebrew/GM%20Rules.md#what-is-hardened)')
[void]$cat.AppendLine('')
[void]$cat.AppendLine(('**Total sheets:** ' + $indexRows.Count))
[void]$cat.AppendLine('')
[void]$cat.AppendLine('## Sheet files')
[void]$cat.AppendLine('')
foreach ($l in $fileLinks) { [void]$cat.AppendLine($l) }
[void]$cat.AppendLine('')
[void]$cat.AppendLine('Rebuild: `powershell -File Enemies/_build-catalog.ps1`')
[void]$cat.AppendLine('')
[void]$cat.AppendLine('## A-Z index')
[void]$cat.AppendLine('')
[void]$cat.AppendLine('| Name | HP | Ev | Armor | Source | File |')
[void]$cat.AppendLine('|------|----|----|-------|--------|------|')
foreach ($r in ($indexRows | Sort-Object Name)) {
  $link = '[' + $r.Name + '](' + $r.File + '#' + $r.Anchor + ')'
  [void]$cat.AppendLine('| ' + $link + ' | ' + $r.HP + ' | ' + $r.Evasion + ' | ' + $r.Armor + ' | ' + $r.Source + ' | ' + $r.File + ' |')
}
[void]$cat.AppendLine('')
[void]$cat.AppendLine('## By source')
[void]$cat.AppendLine('')
foreach ($src in ($indexRows | Group-Object Source | Sort-Object Name)) {
  [void]$cat.AppendLine(('### ' + $src.Name + ' (' + $src.Count + ')'))
  [void]$cat.AppendLine('')
  foreach ($r in ($src.Group | Sort-Object Name)) {
    [void]$cat.AppendLine('- [' + $r.Name + '](' + $r.File + '#' + $r.Anchor + ') - HP ' + $r.HP + ' / Ev ' + $r.Evasion)
  }
  [void]$cat.AppendLine('')
}

$catalogPath = Join-Path $outDir 'Catalog.md'
[System.IO.File]::WriteAllText($catalogPath, $cat.ToString(), [System.Text.UTF8Encoding]::new($false))
Write-Host "Wrote Catalog.md ($($indexRows.Count) index rows)"

# Verify key names
foreach ($want in @('Crusher','Big Top','Torch','Cyberpsycho','Hardened Bodyguard')) {
  $hit = $indexRows | Where-Object { $_.Name -eq $want } | Select-Object -First 1
  if ($hit) { Write-Host "OK $want -> $($hit.File) Ev $($hit.Evasion) HP $($hit.HP)" }
  else { Write-Host "MISSING $want" }
}
