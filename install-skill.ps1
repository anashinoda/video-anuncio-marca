$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Instalando a skill video-anuncio-marca (Windows)..." -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SkillSrc = Join-Path $ScriptDir "skills\video-anuncio-marca"

$ClaudeDest = Join-Path $env:USERPROFILE ".claude\skills\video-anuncio-marca"
$AgentsDest = Join-Path $env:USERPROFILE ".agents\skills\video-anuncio-marca"

New-Item -ItemType Directory -Force -Path (Split-Path $ClaudeDest) | Out-Null
New-Item -ItemType Directory -Force -Path (Split-Path $AgentsDest) | Out-Null

if (Test-Path $ClaudeDest) { Remove-Item -Recurse -Force $ClaudeDest }
if (Test-Path $AgentsDest) { Remove-Item -Recurse -Force $AgentsDest }

Copy-Item -Recurse -Force $SkillSrc $ClaudeDest
Copy-Item -Recurse -Force $SkillSrc $AgentsDest

if (Get-Command python -ErrorAction SilentlyContinue) {
    Write-Host "Gerando biblioteca de efeitos sonoros (SFX)..." -ForegroundColor Yellow
    python (Join-Path $SkillSrc "scripts\generate_sfx.py") --out (Join-Path $ScriptDir "engine\public\sfx")
}

Write-Host ""
Write-Host "Skill instalada com sucesso!" -ForegroundColor Green
Write-Host "Use /video-anuncio-marca no Claude Code."
Write-Host "Para preparar o motor Remotion: cd engine; npm install; npm run render"
