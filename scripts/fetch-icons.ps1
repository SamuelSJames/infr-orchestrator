# fetch-icons.ps1 — Download missing dashboard icons from open-source repos
# Sources: Simple Icons (brand logos), Lucide Icons (UI icons)
# Run from the repo root: powershell -File scripts/fetch-icons.ps1

$ErrorActionPreference = "Continue"

$IconDir = "docs/assets/icons"
if (-not (Test-Path $IconDir)) { New-Item -ItemType Directory -Path $IconDir -Force | Out-Null }

$SimpleBase = "https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons"
$LucideBase = "https://raw.githubusercontent.com/lucide-icons/lucide/main/icons"

# Brand icons (Simple Icons)
$BrandIcons = @{
    "proxmox"    = "$SimpleBase/proxmox.svg"
    "debian"     = "$SimpleBase/debian.svg"
    "ubuntu"     = "$SimpleBase/ubuntu.svg"
    "docker"     = "$SimpleBase/docker.svg"
    "nginx"      = "$SimpleBase/nginx.svg"
    "cloudflare" = "$SimpleBase/cloudflare.svg"
    "wireguard"  = "$SimpleBase/wireguard.svg"
    "linuxmint"  = "$SimpleBase/linuxmint.svg"
    "python"     = "$SimpleBase/python.svg"
    "git"        = "$SimpleBase/git.svg"
    "linux"      = "$SimpleBase/linux.svg"
}

# UI icons (Lucide Icons)
$UIIcons = @{
    "server"     = "$LucideBase/server.svg"
    "monitor"    = "$LucideBase/monitor.svg"
    "container"  = "$LucideBase/box.svg"
    "shield"     = "$LucideBase/shield-check.svg"
    "network"    = "$LucideBase/activity.svg"
    "bell"       = "$LucideBase/bell-ring.svg"
    "globe"      = "$LucideBase/globe.svg"
    "key"        = "$LucideBase/key-round.svg"
    "cpu"        = "$LucideBase/cpu.svg"
    "hard-drive" = "$LucideBase/hard-drive.svg"
    "eye"        = "$LucideBase/eye.svg"
    "brain"      = "$LucideBase/brain-circuit.svg"
    "terminal"   = "$LucideBase/terminal.svg"
    "database"   = "$LucideBase/database.svg"
    "heartbeat"  = "$LucideBase/heart-pulse.svg"
}

$Pass = 0; $Skip = 0; $Fail = 0

function Fetch-Icons($icons, $label) {
    Write-Host "=== Fetching $label ==="
    foreach ($name in $icons.Keys) {
        $dest = "$IconDir/$name.svg"
        if (Test-Path $dest) {
            Write-Host "  OK $name (exists)"
            $script:Skip++
        } else {
            try {
                Invoke-WebRequest -Uri $icons[$name] -OutFile $dest -ErrorAction Stop 2>$null
                Write-Host "  DL $name (downloaded)"
                $script:Pass++
            } catch {
                Write-Host "  FAIL $name"
                $script:Fail++
            }
        }
    }
    Write-Host ""
}

Fetch-Icons $BrandIcons "brand icons (Simple Icons)"
Fetch-Icons $UIIcons "UI icons (Lucide Icons)"

Write-Host "=== Summary ==="
Write-Host "  Downloaded: $Pass"
Write-Host "  Skipped:    $Skip (already exist)"
Write-Host "  Failed:     $Fail"
$total = (Get-ChildItem "$IconDir/*.svg" -ErrorAction SilentlyContinue).Count
Write-Host "  Total icons: $total"
