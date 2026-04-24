# Infr-Orchestrator — Complete Feature List

## 1. Top Bar
- Brand logo + project name
- Subtitle description
- Navigation pills: Overview, Topology, Compute, Storage, Automation, Tenants, GitHub
- System Status indicator with green dot ("All systems operational")

## 2. Hero Panel
- "Infrastructure Control Plane" eyebrow label
- Headline: "Infrastructure. Automated."
- Subheadline: "Reliably orchestrated. Always observable."
- Description paragraph
- Decorative glow effect

## 3. KPI Stat Cards (6 cards)
- **Nodes Online** — count with percentage, progress bar
- **Protected Workloads** — count with health status, progress bar
- **Backup Health** — percentage with status, progress bar
- **Active Projects** — count with trend indicator, progress bar
- **Automation Runs** — count with time window (24h), progress bar
- **Alerts** — count with "See details" link, progress bar

## 4. Claw Automation Core Panel
- Status chip ("Running")
- Animated brain visual with icon
- Description paragraph
- Core metrics list:
  - Status
  - Node name
  - Uptime
  - Python Workers count
  - Tasks Queued count
  - Last Run timestamp
- "Open Automation Hub" button

## 5. Infrastructure Topology Panel
- "Grid-based platform map" heading
- "View Full Topology" link
- 5 color-coded topology rows, each with label + node chain:
  - **Edge / Access** (blue) — edge-gateway-1, edge-firewall, reverse-proxy, Internet
  - **Identity / Control Plane** (purple) — auth-core, claw-core (primary highlight), secrets-vault, dns-core
  - **Compute Fabric** (green) — pve-a, pve-b, pve-c, worker-burst-1, worker-burst-2
  - **Storage / Backup** (amber) — ceph-storage, nfs-core, backup-core, object-store
  - **Observability / Operations** (cyan) — metrics-core, logs-core, tracing-core, dashboard-core
- Arrow connectors between nodes
- Each node shows name + role

## 6. System Health Panel
- Health ring (donut chart) showing 98% Healthy
- Health checklist:
  - Compute — Healthy
  - Storage — Healthy
  - Networking — Healthy
  - Backup — Healthy
  - Automation — Healthy
  - Observability — Healthy

## 7. Recent Operations Panel
- "Execution feed" heading + "View All" link
- Operation entries, each with:
  - Operation title (e.g., "VM Create: app-prod-01")
  - Timestamp (e.g., "7m ago")
  - Result status ("Success")
- 6 sample entries: VM Create, Backup, Playbook run, VM Start, Backup Verify, Cleanup

## 8. Tenant / Project Spaces Panel
- "Workload groups" heading + "View All" link
- Tenant entries, each with:
  - Tenant name + green status dot
  - Description
  - VM count + Container count
- 5 tenants: Platform, DevOps, Media, HomeLab, Security

## 9. Backup Posture Panel
- "Protection state" heading + "View All" link
- Backup ring (donut chart) showing 100% Protected
- Breakdown list:
  - Successful — 48
  - Warning — 0
  - Failed — 0
  - Skipped — 0
- "Last Backup (All) 2h ago" footer

## 10. Compute Inventory Panel
- "PVE and workload estate" heading + "View All" link
- Inventory rows with status pills:
  - Proxmox Nodes — 3/3 Online
  - Worker Nodes — 2/3 Online
  - Virtual Machines — 36 Running
  - LXC Containers — 28 Running
  - Total vCPUs — 96 Allocated
  - Total Memory — 384 GB Allocated

## 11. Automation Status Panel
- "Workflow summary" heading + "View All" link
- Summary rows:
  - Active Workflows — 7
  - Queued Tasks — 3
  - Completed (24h) — 124
  - Failed (24h) — 0
- Success rate bar (100% filled green)
- Success Rate label with percentage

---

## Summary Count

| Category | Items |
|---|---|
| Panels | 11 |
| KPI cards | 6 |
| Topology rows | 5 (with 22 nodes total) |
| Health checks | 6 |
| Inventory metrics | 6 |
| Automation metrics | 4 |
| Backup metrics | 4 |
