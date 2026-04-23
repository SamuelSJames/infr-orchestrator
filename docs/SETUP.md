# Infr-Orchestrator Setup Guide

This project is intentionally easy to bootstrap.

At the moment it is a static dashboard starter that can be:

- run locally in minutes
- published to GitHub Pages
- hosted behind Nginx or Caddy
- adapted to a real Proxmox environment by editing dashboard data

---

## 1. Prerequisites

Minimum:

- Git
- Python 3 or another static file server
- a modern browser

Helpful for real-world use:

- Proxmox VE environment
- Proxmox Backup Server
- inventory of nodes, VMs, LXCs, storage, and services
- a written naming convention

---

## 2. Clone the repo

```bash
git clone https://github.com/SamuelSJames/infr-orchestrator.git
cd infr-orchestrator
```

---

## 3. Run locally

```bash
python3 -m http.server 8080
```

Open:

```text
http://127.0.0.1:8080/docs/
```

---

## 4. Deploy options

### GitHub Pages
This repo is already structured for GitHub Pages from `docs/`.

### Nginx
Point your site root to:

```text
infr-orchestrator/docs/
```

### Caddy
Minimal example:

```caddy
example.yourdomain.com {
    root * /opt/infr-orchestrator/docs
    file_server
}
```

### Docker
Use a simple static Nginx image and mount `docs/` into the container.

---

## 5. Customize for your own environment

Current dashboard content lives in:

```text
docs/app.js
```

Update these sections:

- `stats`
- `coreMetrics`
- `topologyRows`
- `healthItems`
- `operations`
- `tenants`
- `backupBreakdown`
- `inventory`
- `statusSummary`

These arrays control the dashboard view.

---

## 6. Recommended customization order

### A. Replace topology first
Map your platform into these layers:

- Edge / Access
- Identity / Control Plane
- Compute Fabric
- Storage / Backup
- Observability / Operations

If your environment uses different names, keep the same overall grouping pattern.

### B. Replace metrics second
Update the top KPI cards with values that matter to you, such as:

- nodes online
- protected workloads
- backup health
- active projects
- automation runs
- alerts

### C. Replace lower panels third
Populate:

- recent operations
- tenant spaces
- backup posture
- compute inventory
- automation summary

---

## 7. Recommended data model for a real Proxmox environment

Even before adding an API, write down:

### Compute
- Proxmox nodes
- clusters
- VM groups
- LXC groups
- burst workers

### Storage
- local ZFS
- backup targets
- object storage
- NFS / SMB
- Ceph, if used

### Networking
- edge gateway
- reverse proxy
- identity path
- VPN / mesh overlay
- DNS services

### Operations
- observability stack
- automation node
- runners / schedulers
- backup verification
- health checks

---

## 8. Suggested stack if you want to evolve this into a real platform

### Required core
- Proxmox VE
- Proxmox Backup Server
- static web hosting

### Strongly recommended
- Keycloak or Authentik
- Grafana
- Prometheus
- Loki
- Uptime Kuma
- HAProxy / Traefik / Nginx
- MinIO

### Optional advanced pieces
- Ansible
- Terraform
- GitOps workflows
- task runners
- generated data pipeline from Proxmox API

---

## 9. Tips

- make topology labels short and clean
- keep infrastructure layers visually distinct
- show backup posture early, not buried
- do not overload the main screen with tiny metrics
- keep the first page operator-focused
- if adding real actions later, build in:
  - auth
  - audit trails
  - role checks
  - safety gates

---

## 10. If you want a more “real” deployment later

A good next path is:

1. move dashboard data from `app.js` into a separate data file
2. generate that file from your Proxmox inventory
3. add a lightweight backend
4. connect to Proxmox API
5. wire in health and backup results automatically

That preserves the current visual design while making it operational.
