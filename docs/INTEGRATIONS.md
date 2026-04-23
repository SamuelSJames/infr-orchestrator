# Infr-Orchestrator Open-Source Integration Path

This project should be able to grow into a real control-plane style dashboard without becoming locked to one stack.

## Core integration targets

### Virtualization and compute
- Proxmox VE
- optional Kubernetes or K3s layer

### Backup and storage
- Proxmox Backup Server
- MinIO
- NFS / SMB
- Ceph

### Observability
- Grafana
- Prometheus
- Loki
- Tempo
- Uptime Kuma

### Identity and secrets
- Keycloak
- Authentik
- Vault

### Edge and networking
- HAProxy
- Nginx
- Traefik
- NetBird
- Tailscale
- Cloudflare DNS

### Automation
- Ansible
- Terraform
- GitHub Actions or Forgejo Actions
- custom agent workflows

## Recommended adapter model

Do not hardcode vendor-specific fetch logic into the UI.

Instead:

1. collect data from tools with small adapters
2. normalize into one dashboard data model
3. write static output or expose a read-only API
4. let the frontend render the normalized model

## Example normalized outputs

- node status
- VM and LXC counts
- backup success and failure counts
- automation run history
- alert and health summaries
- tenant or project grouping
- edge and identity dependencies

## Good near-term roadmap

### Phase 1
- generated `docs/data.js` from inventory files
- static deploy remains unchanged

### Phase 2
- read-only aggregator service
- optional fetch from Proxmox and PBS
- optional pull from Prometheus or Uptime Kuma

### Phase 3
- auth-aware views
- audit history
- operator actions behind approval gates

## Important rule

Keep the dashboard useful even when integrations are unavailable.

A fork should still work as a static project with sample or generated data.
