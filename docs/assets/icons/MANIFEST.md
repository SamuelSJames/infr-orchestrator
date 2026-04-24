# Icon Manifest

All icons are SVG format, sourced from open-source repos.

## Brand Icons (Simple Icons — https://github.com/simple-icons/simple-icons)

| File | Source | Used for |
|---|---|---|
| proxmox.svg | Simple Icons | PVE nodes in topology and inventory |
| debian.svg | Simple Icons | Debian-based VMs and LXCs |
| ubuntu.svg | Simple Icons | Ubuntu VMs and LXCs |
| docker.svg | Simple Icons | Docker container services |
| nginx.svg | Simple Icons | Reverse proxy / NPM |
| cloudflare.svg | Simple Icons | DNS/CDN edge |
| wireguard.svg | Simple Icons | VPN mesh overlay (NetBird) |
| linuxmint.svg | Simple Icons | Workstation (pre) |
| python.svg | Simple Icons | Automation engine (Claw) |
| git.svg | Simple Icons | Git services (Forgejo, Gitea) |
| linux.svg | Simple Icons | Generic Linux nodes |

## UI Icons (Lucide Icons — https://github.com/lucide-icons/lucide)

| File | Lucide name | Used for |
|---|---|---|
| server.svg | server | Nodes Online KPI card |
| monitor.svg | monitor | VM KPI card |
| container.svg | box | Container KPI card |
| shield.svg | shield-check | Backup Health KPI card |
| network.svg | activity | Network Latency KPI card |
| bell.svg | bell-ring | Active Alerts KPI card |
| globe.svg | globe | Edge/Access topology label |
| key.svg | key-round | Identity/Control topology label |
| cpu.svg | cpu | Compute topology label |
| hard-drive.svg | hard-drive | Storage/Backup topology label |
| eye.svg | eye | Observability topology label |
| brain.svg | brain-circuit | Claw Automation Core visual |
| terminal.svg | terminal | Automation operations |
| database.svg | database | Storage services (ZFS, PBS) |
| heartbeat.svg | heart-pulse | System Health panel |

## Licenses

- Simple Icons: CC0 1.0 Universal (public domain)
- Lucide Icons: ISC License

## Adding New Icons

Run the fetch script to download any missing icons:

```bash
# Linux/macOS
bash scripts/fetch-icons.sh

# Windows PowerShell
powershell -File scripts/fetch-icons.ps1
```

To add a new icon, edit the icon list in the appropriate fetch script and re-run it.
