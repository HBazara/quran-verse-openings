# Quran Verse Openings: opens the four agent sessions (ORG, BUILDER, DOCU, AUD) as tabs in one Windows Terminal window.
#
#   .\start-quran-verse-openings.ps1              fresh sessions; each one reads docs/TEAM-START.md first (recommended)
#   .\start-quran-verse-openings.ps1 -Resume      reopen the old sessions by name instead (Org, Builder, Docu, Aud)
#   .\start-quran-verse-openings.ps1 -DryRun      only print what would run
#
# Close the old agent sessions first. Two sessions with the same name confuse messaging.
# If PowerShell blocks the script, run it once with:
#   powershell -ExecutionPolicy Bypass -File .\start-quran-verse-openings.ps1

param(
  [switch]$Resume,
  [switch]$DryRun,
  [ValidateSet('ORG', 'BUILDER', 'DOCU', 'AUD')]
  [string]$Role
)

$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$roles = @('ORG', 'BUILDER', 'DOCU', 'AUD')

# Names the old sessions were given with /rename, used only with -Resume.
$oldNames = @{ ORG = 'Org'; BUILDER = 'Builder'; DOCU = 'Docu'; AUD = 'Aud' }

function Get-FirstPrompt([string]$r) {
  "You are $r. Read docs/TEAM-START.md, then follow it."
}

# Inside one tab: start that role's Claude Code session.
if ($Role) {
  Set-Location $root
  if ($Resume) {
    $cmd = @('-r', $oldNames[$Role])
  } else {
    $cmd = @('-n', $Role, (Get-FirstPrompt $Role))
  }
  if ($DryRun) { "claude $($cmd -join ' ')"; return }
  & claude @cmd
  return
}

# Outer call: one Windows Terminal window, one tab per role.
if (-not (Get-Command wt -ErrorAction SilentlyContinue)) { throw 'Windows Terminal (wt) is not installed.' }
if (-not (Get-Command claude -ErrorAction SilentlyContinue)) { throw 'Claude Code (claude) is not on PATH.' }
if (-not $Resume -and -not (Test-Path (Join-Path $root 'docs/TEAM-START.md'))) {
  throw 'docs/TEAM-START.md is missing. DOCU writes it; fresh sessions need it.'
}

$self = $PSCommandPath
$wtArgs = @('-w', 'quran-verse-openings')
foreach ($r in $roles) {
  if ($wtArgs.Count -gt 2) { $wtArgs += ';' }
  $wtArgs += @('new-tab', '--title', $r, '-d', $root,
    'powershell', '-NoExit', '-ExecutionPolicy', 'Bypass', '-File', $self, '-Role', $r)
  if ($Resume) { $wtArgs += '-Resume' }
}

if ($DryRun) {
  "wt $($wtArgs -join ' ')"
  foreach ($r in $roles) { "  [$r] " + (& $self -Role $r -DryRun -Resume:$Resume) }
  return
}
& wt @wtArgs
