#!/bin/bash
# fetch-icons.sh — Download missing dashboard icons from open-source repos
# Sources: Simple Icons (brand logos), Lucide Icons (UI icons)
# Run from the repo root: bash scripts/fetch-icons.sh

set -euo pipefail

ICON_DIR="docs/assets/icons"
mkdir -p "$ICON_DIR"

SIMPLE_ICONS_BASE="https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons"
LUCIDE_BASE="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons"

# ── Brand icons (Simple Icons) ──────────────────────────────────────
declare -A BRAND_ICONS=(
  [proxmox]="$SIMPLE_ICONS_BASE/proxmox.svg"
  [debian]="$SIMPLE_ICONS_BASE/debian.svg"
  [ubuntu]="$SIMPLE_ICONS_BASE/ubuntu.svg"
  [docker]="$SIMPLE_ICONS_BASE/docker.svg"
  [nginx]="$SIMPLE_ICONS_BASE/nginx.svg"
  [cloudflare]="$SIMPLE_ICONS_BASE/cloudflare.svg"
  [wireguard]="$SIMPLE_ICONS_BASE/wireguard.svg"
  [linuxmint]="$SIMPLE_ICONS_BASE/linuxmint.svg"
  [python]="$SIMPLE_ICONS_BASE/python.svg"
  [git]="$SIMPLE_ICONS_BASE/git.svg"
  [linux]="$SIMPLE_ICONS_BASE/linux.svg"
)

# ── UI icons (Lucide Icons) ─────────────────────────────────────────
declare -A UI_ICONS=(
  [server]="$LUCIDE_BASE/server.svg"
  [monitor]="$LUCIDE_BASE/monitor.svg"
  [container]="$LUCIDE_BASE/box.svg"
  [shield]="$LUCIDE_BASE/shield-check.svg"
  [network]="$LUCIDE_BASE/activity.svg"
  [bell]="$LUCIDE_BASE/bell-ring.svg"
  [globe]="$LUCIDE_BASE/globe.svg"
  [key]="$LUCIDE_BASE/key-round.svg"
  [cpu]="$LUCIDE_BASE/cpu.svg"
  [hard-drive]="$LUCIDE_BASE/hard-drive.svg"
  [eye]="$LUCIDE_BASE/eye.svg"
  [brain]="$LUCIDE_BASE/brain-circuit.svg"
  [terminal]="$LUCIDE_BASE/terminal.svg"
  [database]="$LUCIDE_BASE/database.svg"
  [heartbeat]="$LUCIDE_BASE/heart-pulse.svg"
)

PASS=0
SKIP=0
FAIL=0

echo "=== Fetching brand icons (Simple Icons) ==="
for name in "${!BRAND_ICONS[@]}"; do
  dest="$ICON_DIR/$name.svg"
  if [ -f "$dest" ]; then
    echo "  ✓ $name (exists)"
    ((SKIP++))
  else
    if curl -sfL "${BRAND_ICONS[$name]}" -o "$dest" 2>/dev/null; then
      echo "  ↓ $name (downloaded)"
      ((PASS++))
    else
      echo "  ✗ $name (FAILED)"
      ((FAIL++))
    fi
  fi
done

echo ""
echo "=== Fetching UI icons (Lucide Icons) ==="
for name in "${!UI_ICONS[@]}"; do
  dest="$ICON_DIR/$name.svg"
  if [ -f "$dest" ]; then
    echo "  ✓ $name (exists)"
    ((SKIP++))
  else
    if curl -sfL "${UI_ICONS[$name]}" -o "$dest" 2>/dev/null; then
      echo "  ↓ $name (downloaded)"
      ((PASS++))
    else
      echo "  ✗ $name (FAILED)"
      ((FAIL++))
    fi
  fi
done

echo ""
echo "=== Summary ==="
echo "  Downloaded: $PASS"
echo "  Skipped:    $SKIP (already exist)"
echo "  Failed:     $FAIL"
echo ""
echo "Icons directory: $ICON_DIR"
ls -1 "$ICON_DIR"/*.svg 2>/dev/null | wc -l | xargs -I{} echo "  Total icons: {}"
