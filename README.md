# Infr-Orchestrator

A visual private-cloud control plane concept for Proxmox-based home infrastructure.

**Live preview:** <https://samuelsjames.github.io/infr-orchestrator/>

Infr-Orchestrator is a fictionalized showcase project that presents the kind of control plane you would want for a tenant-ready homelab cloud. It borrows the useful ideas from public cloud platforms without copying AWS literally. The environment is intentionally fake, with invented names, safe topology data, and no real IPs, credentials, or infrastructure details.

## What it shows

- topology-first infrastructure dashboard
- compute, storage, backup, and automation health views
- a fictional Claw automation core running inside a VPS
- tenant-ready concepts like projects, quotas, and self-service deploy paths
- a clean GitHub Pages presentation that feels like a real product concept

## Why this repo exists

This project is meant to showcase:

- infrastructure design thinking
- homelab-to-platform architecture
- UI thinking for operations tooling
- Proxmox-oriented private cloud concepts
- systems automation and observability workflows

## Project principles

- **No real infrastructure details**
- **No real hostnames or IPs**
- **Strong visual presentation**
- **Believable architecture**
- **Portfolio-ready polish**

## Pages site

The repo is built as a static site under `docs/` so GitHub Pages can publish it directly.

## Fake environment model

The dashboard represents a fictional environment with components like:

- `orch-edge-1`
- `orch-core-1`
- `orch-pve-a`
- `orch-pve-b`
- `orch-backup-1`
- `claw-core`
- `object-store`
- `metrics-core`

These names are for presentation only.

## Roadmap

- add deeper compute and tenant drill-down views
- add polished mock deployment workflows
- add screenshot assets for the README
- add a richer service catalog and backup timeline
- evolve the concept into a real application if desired

## Local preview

```bash
git clone https://github.com/SamuelSJames/infr-orchestrator.git
cd infr-orchestrator
python3 -m http.server 8080
```

Then open <http://127.0.0.1:8080/docs/>.

## License

MIT
