# SpaceCord Installer for Windows
# Run as Administrator in PowerShell:
# irm https://raw.githubusercontent.com/TUO_USERNAME/TUO_REPO/main/scripts/install.ps1 | iex

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "  ===============================" -ForegroundColor Cyan
Write-Host "       SpaceCord Installer" -ForegroundColor Cyan
Write-Host "  ===============================" -ForegroundColor Cyan
Write-Host ""

# --- Config ---
$GITHUB_REPO = "SpaceCordSTK/spacecord"  # <-- CAMBIA CON IL TUO REPO GITHUB
$RELEASE_ZIP  = "SpaceCord-desktop.zip"
$INSTALL_DIR  = "$env:APPDATA\SpaceCord"
$TEMP_ZIP     = "$env:TEMP\SpaceCord-desktop.zip"

# --- Trova Discord ---
Write-Host "[1/5] Cerco l'installazione di Discord..." -ForegroundColor Yellow

$discordPaths = @(
    "$env:LOCALAPPDATA\Discord",
    "$env:APPDATA\Discord",
    "C:\Users\$env:USERNAME\AppData\Local\Discord"
)

$discordApp = $null
foreach ($path in $discordPaths) {
    if (Test-Path $path) {
        $appFolders = Get-ChildItem $path -Directory | Where-Object { $_.Name -like "app-*" } | Sort-Object Name -Descending
        foreach ($folder in $appFolders) {
            $resourcesPath = Join-Path $folder.FullName "resources"
            if (Test-Path $resourcesPath) {
                $discordApp = $resourcesPath
                break
            }
        }
        if ($discordApp) { break }
    }
}

if (-not $discordApp) {
    Write-Host "[ERRORE] Discord non trovato! Installa Discord prima di continuare." -ForegroundColor Red
    exit 1
}

Write-Host "  Discord trovato in: $discordApp" -ForegroundColor Green

# --- Chiudi Discord ---
Write-Host "[2/5] Chiudo Discord..." -ForegroundColor Yellow
Get-Process "Discord" -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

# --- Scarica SpaceCord ---
Write-Host "[3/5] Scarico SpaceCord..." -ForegroundColor Yellow
$downloadUrl = "https://github.com/$GITHUB_REPO/releases/latest/download/$RELEASE_ZIP"

try {
    Invoke-WebRequest -Uri $downloadUrl -OutFile $TEMP_ZIP -UseBasicParsing
} catch {
    Write-Host "[ERRORE] Download fallito. Controlla la connessione o il link del repo." -ForegroundColor Red
    exit 1
}

Write-Host "  Download completato!" -ForegroundColor Green

# --- Installa ---
Write-Host "[4/5] Installo SpaceCord..." -ForegroundColor Yellow

# Ripristina app.asar originale se esiste backup
if (Test-Path "$discordApp\_app.asar") {
    Copy-Item "$discordApp\_app.asar" "$discordApp\app.asar" -Force
}

# Estrai il zip nella cartella di Discord
$extractTemp = "$env:TEMP\SpaceCord-extract"
if (Test-Path $extractTemp) { Remove-Item $extractTemp -Recurse -Force }

Expand-Archive -Path $TEMP_ZIP -DestinationPath $extractTemp -Force

# Copia i file dist/desktop in risorse
$desktopFiles = Join-Path $extractTemp "desktop"
if (-not (Test-Path $desktopFiles)) {
    Write-Host "[ERRORE] File di SpaceCord non trovati nell'archivio." -ForegroundColor Red
    exit 1
}

# Salva backup di app.asar originale
if ((Test-Path "$discordApp\app.asar") -and -not (Test-Path "$discordApp\_app.asar")) {
    Copy-Item "$discordApp\app.asar" "$discordApp\_app.asar" -Force
    Write-Host "  Backup di app.asar creato." -ForegroundColor DarkGray
}

# Crea cartella app con i file di SpaceCord
$spacecordTarget = "$discordApp\app"
if (Test-Path $spacecordTarget) { Remove-Item $spacecordTarget -Recurse -Force }
New-Item -ItemType Directory -Path $spacecordTarget | Out-Null
Copy-Item "$desktopFiles\*" $spacecordTarget -Recurse -Force

# Crea package.json per caricare SpaceCord al posto di Discord
$packageJson = @{
    name = "spacecord"
    main = "patcher.js"
} | ConvertTo-Json

Set-Content -Path "$spacecordTarget\package.json" -Value $packageJson

# Pulizia
Remove-Item $extractTemp -Recurse -Force
Remove-Item $TEMP_ZIP -Force

Write-Host "  Installazione completata!" -ForegroundColor Green

# --- Avvia Discord ---
Write-Host "[5/5] Riavvio Discord..." -ForegroundColor Yellow
$discordExe = "$env:LOCALAPPDATA\Discord\Update.exe"
if (Test-Path $discordExe) {
    Start-Process $discordExe -ArgumentList "--processStart Discord.exe"
} else {
    Write-Host "  Non riesco ad avviare Discord automaticamente. Aprilo manualmente." -ForegroundColor DarkYellow
}

Write-Host ""
Write-Host "  ===============================" -ForegroundColor Cyan
Write-Host "    SpaceCord installato!" -ForegroundColor Green
Write-Host "  ===============================" -ForegroundColor Cyan
Write-Host ""
