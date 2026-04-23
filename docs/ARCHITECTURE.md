# Infr-Orchestrator Architecture Guide

This project is built around a simple but useful mental model for a private-cloud dashboard.

## Platform layers

### 1. Edge / Access
What brings users and traffic into the environment.

Examples:
- reverse proxy
- ingress
- TLS termination
- DNS-aware routing
- firewall edge

### 2. Identity / Control Plane
What controls access and coordinates automation.

Examples:
- identity provider
- secrets service
- automation core
- orchestration logic
- DNS / internal service directory

### 3. Compute Fabric
Where applications and workloads actually run.

Examples:
- Proxmox nodes
- VM clusters
- LXC clusters
- worker pools
- tenant execution nodes

### 4. Storage / Backup
What keeps data durable and recoverable.

Examples:
- Proxmox Backup Server
- ZFS
- object storage
- NFS / SMB
- Ceph

### 5. Observability / Operations
What makes the environment understandable and supportable.

Examples:
- Grafana
- Prometheus
- Loki
- Tempo
- synthetic monitoring
- audit signals

---

## Why the dashboard is structured this way

The goal is not to draw every cable or every dependency.

The goal is to let an operator answer these questions quickly:

- is the platform healthy?
- where is traffic entering?
- what controls identity and automation?
- where are workloads running?
- where are backups and storage handled?
- what is the current operational state?

That is why the topology is grouped into colored rows instead of a chaotic freeform graph.

---

## Recommended real deployment mapping

### Edge / Access
- HAProxy / Nginx / Traefik
- Cloudflare / DNS
- internal routing

### Identity / Control Plane
- Keycloak / Authentik
- automation agents
- schedulers
- secret stores

### Compute Fabric
- Proxmox nodes
- Kubernetes or app nodes if used
- tenant projects
- burst workers

### Storage / Backup
- PBS
- local ZFS
- shared storage
- object storage

### Observability / Operations
- Grafana
- Prometheus
- Loki
- backup verification
- alerting pipeline

---

## Future direction

A mature version of this project could support:

- read-only API-backed inventory
- live Proxmox status
- live backup posture
- operator audit events
- auth-aware views
- safe actions with approval gates

That would turn the current dashboard starter into a real platform console.
