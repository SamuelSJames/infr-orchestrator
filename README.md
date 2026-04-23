# Infr-Orchestrator

A Proxmox-based infrastructure dashboard for private-cloud style operations, automation visibility, and tenant-ready homelab environments.

**Live preview:** <https://samuelsjames.github.io/infr-orchestrator/>

## What this project is

Infr-Orchestrator is an open-source dashboard project designed to present a modern operations view for a Proxmox-driven infrastructure stack.

It is built to showcase and support:

- Proxmox infrastructure visibility
- automation-first operations
- backup and recovery posture
- private-cloud style topology mapping
- tenant and project segmentation concepts
- a clean, recruiter-friendly infrastructure UI

This repo currently ships as a **static dashboard starter** that can be cloned, customized, and deployed quickly. It is intentionally lightweight, easy to host, and easy to adapt to a real Proxmox environment.

## Core goals

- make infrastructure readable at a glance
- expose the most important operational signals first
- provide a polished open-source dashboard starter
- give homelab builders a clean foundation for a private-cloud control plane
- serve as a strong portfolio and recruiter-facing project

## Current features

- full-width dashboard shell
- KPI/stat overview cards
- colored topology lanes for major platform layers
- custom SVG branding and infrastructure icon pack
- Claw automation core panel
- system health panel
- recent operations feed
- tenant/project workload section
- backup posture section
- compute inventory section
- automation status section
- GitHub Pages-ready static deployment

## Open-source tools and ecosystem

This project is inspired by workflows commonly built around:

- **Proxmox VE** for virtualization
- **Proxmox Backup Server** for backup and restore posture
- **Grafana** for observability and dashboards
- **Prometheus** for metrics
- **Loki** for logs
- **Keycloak** or **Authentik** for identity
- **MinIO** for object storage
- **Traefik**, **HAProxy**, or **Nginx** for edge routing
- **NetBird**, **Tailscale**, or WireGuard-style overlays for remote access
- **Ansible**, **Terraform**, or GitOps workflows for automation

The current repo is UI-first, but it is structured to grow into a fuller open-source platform dashboard.

## Project structure

```text
infr-orchestrator/
├── README.md
├── CONTRIBUTING.md
├── LICENSE
├── Dockerfile
├── index.html
├── deploy/
│   ├── Caddyfile.example
│   └── nginx.conf.example
├── docs/
│   ├── index.html
│   ├── styles.css
│   ├── data.js
│   ├── app.js
│   ├── SETUP.md
│   ├── DEPLOYMENT.md
│   ├── DEVELOPMENT.md
│   ├── INTEGRATIONS.md
│   ├── ARCHITECTURE.md
│   └── assets/
│       ├── favicon.svg
│       ├── logo.svg
│       ├── claw-core.svg
│       ├── icon-edge.svg
│       ├── icon-identity.svg
│       ├── icon-compute.svg
│       ├── icon-storage.svg
│       ├── icon-observe.svg
│       ├── stat-nodes.svg
│       └── stat-workloads.svg
```

## Requirements

### Minimum requirements to run the dashboard

You only need a system capable of serving static files:

- Git
- Python 3 **or** any static web server
- a browser

### Requirements to adapt it to a Proxmox environment

To make this dashboard reflect a real environment, you will typically want:

- one or more **Proxmox VE** nodes
- optional **Proxmox Backup Server**
- a documented inventory of:
  - nodes
  - VM groups
  - LXC groups
  - storage tiers
  - tenant/project segments
  - automation roles
- a naming convention for:
  - edge systems
  - control-plane services
  - compute nodes
  - storage services
  - observability services

## Quick start

```bash
git clone https://github.com/SamuelSJames/infr-orchestrator.git
cd infr-orchestrator
python3 -m http.server 8080
```

Then open either:

- <http://127.0.0.1:8080/>
- <http://127.0.0.1:8080/docs/>

## Deployment options

### 1. GitHub Pages
This repo already supports GitHub Pages from the `docs/` directory.

### 2. Nginx
Copy the repo to a server, point Nginx at `docs/`, and use `deploy/nginx.conf.example` as a starting point.

### 3. Caddy
Serve `docs/` as a static site and use `deploy/Caddyfile.example` as a starting point.

### 4. Docker + static web server
A minimal `Dockerfile` is included for portable static deployment.

## How to customize for your own Proxmox environment

Right now the dashboard data is stored in:

- `docs/data.js`

To adapt the dashboard to your own environment, update the data structures for:

- stats
- topology rows
- system health
- operations feed
- tenant/project sections
- backup posture
- compute inventory
- automation summary

This makes the project easy to fork and personalize without needing a backend first.

## Recommended rollout path for real homelab adoption

### Phase 1, static customization
- replace labels and system names
- align topology rows to your real architecture
- replace sample metrics with your real categories
- change colors and icons to match your branding

### Phase 2, generated data
- export data from Proxmox API
- build a script that writes dashboard JSON or JS data
- generate `docs/data.js` or a separate data file from your inventory

### Phase 3, live platform
- add a backend API
- connect to Proxmox API
- add authentication
- expose real node, VM, LXC, storage, and backup status
- wire in alerts and logs

## Tips for making it production-worthy

- keep naming clean and consistent
- define your platform layers clearly
- do not mix infrastructure names with personal nicknames in the UI
- separate edge, control plane, compute, storage, and observability visually
- use backups and restore posture as first-class dashboard signals
- avoid overcrowding the first screen with low-value metrics
- decide early whether the dashboard is read-only or operational
- if you add actions later, gate them through auth, audit, and role checks

## Recommended open-source stack if you expand this

### Infrastructure layer
- Proxmox VE
- Proxmox Backup Server
- ZFS

### Identity
- Keycloak or Authentik

### Networking and ingress
- HAProxy
- Traefik
- Nginx
- Cloudflare DNS

### Storage
- MinIO
- NFS / SMB
- Ceph, if your hardware and networking can support it

### Observability
- Grafana
- Prometheus
- Loki
- Tempo
- Uptime Kuma

### Automation
- Ansible
- Terraform
- GitHub Actions / Forgejo Actions
- internal schedulers and agent-driven workflows

## Documentation

- [Setup Guide](./docs/SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Development Guide](./docs/DEVELOPMENT.md)
- [Integration Guide](./docs/INTEGRATIONS.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [Contributing Guide](./CONTRIBUTING.md)

## Roadmap

- add generated inventory workflow
- add optional live Proxmox API integration path
- add PBS, Grafana, and Uptime Kuma adapter examples
- add schema validation for generated data
- add role-aware operator actions

## License

MIT
