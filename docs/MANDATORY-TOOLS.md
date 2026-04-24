# Infr-Orchestrator — Mandatory Tools List

Terminal-only tools required to make each dashboard panel functional with real data.

## The Collector Node (infr-collector)

Every Infr-Orchestrator deployment requires a dedicated **collector node** — a lightweight LXC container that acts as the data collection and API gateway for the entire dashboard. It is the only component that talks to your infrastructure. The dashboard frontend only talks to the collector.

```
┌─────────────────────────────────────────┐
│  Proxmox Cluster                        │
│                                         │
│  ┌──────────────┐   ┌──────────────┐    │
│  │  pve-node-1  │   │  pve-node-2  │    │
│  │  (VMs/LXCs)  │   │  (VMs/LXCs)  │    │
│  └──────┬───────┘   └──────┬───────┘    │
│         │    SSH + CLI     │            │
│         └────────┬─────────┘            │
│           ┌──────┴───────┐              │
│           │infr-collector│              │
│           │  (LXC)       │              │
│           │  - Python API│              │
│           │  - fping     │              │
│           │  - SSH keys  │              │
│           └──────┬───────┘              │
└──────────────────┼──────────────────────┘
                   │ REST API
            ┌──────┴───────┐
            │  Dashboard   │
            │  (browser)   │
            └──────────────┘
```

### Collector specs
- Debian or Ubuntu LXC
- 512 MB RAM, 4 GB disk
- Python 3, fping, sysstat, curl
- SSH key access to all Proxmox nodes
- Runs the API server + scheduled data collection

## Tools by Dashboard Panel

### KPI Stat Cards
| Tool | Feeds | Install on |
|---|---|---|
| **pvesh** | Nodes online count, VM/LXC counts | Proxmox nodes (pre-installed) |
| **fping** | Node reachability for online/offline status | infr-collector |
| **curl** | HTTP health checks for services | infr-collector |

### Automation Core
| Tool | Feeds | Install on |
|---|---|---|
| **uptime** | Uptime value | automation host |
| **ps** | Worker count, process status | automation host |
| **journalctl** | Last run timestamp, task queue depth | automation host |

### Infrastructure Topology
| Tool | Feeds | Install on |
|---|---|---|
| **fping** | Live up/down status per node in topology | infr-collector |
| **pvesh** | Node roles, VM placement | Proxmox nodes |
| **ss** | Port checks to confirm services are listening | infr-collector |

### System Health
| Tool | Feeds | Install on |
|---|---|---|
| **vmstat** | CPU/memory health per node | each node via SSH |
| **df** | Disk space health | each node via SSH |
| **zpool status** | ZFS pool health (degraded/online) | Proxmox nodes (if ZFS) |
| **pvesh** | Cluster quorum, node status | Proxmox nodes |
| **fping** | Network health (latency/loss) | infr-collector |

### Recent Operations
| Tool | Feeds | Install on |
|---|---|---|
| **journalctl** | Proxmox task logs (VM create, start, stop, migrate) | Proxmox nodes |
| **pvesh** | `/nodes/{node}/tasks` — recent task history | Proxmox nodes |
| **last** | SSH login events | all nodes |

### Tenant / Project Spaces
| Tool | Feeds | Install on |
|---|---|---|
| **pvesh** | VM/LXC list with tags or pool assignments | Proxmox nodes |
| **qm list** / **pct list** | Quick VM and container counts per group | Proxmox nodes |

### Backup Posture
| Tool | Feeds | Install on |
|---|---|---|
| **proxmox-backup-client** | Backup job status, last backup time, success/fail counts | PBS host or Proxmox nodes |
| **pvesh** | `/nodes/{node}/storage/{store}/content` — backup snapshots | Proxmox nodes |

### Compute Inventory
| Tool | Feeds | Install on |
|---|---|---|
| **pvesh** | Node count, VM count, LXC count, vCPU/memory totals | Proxmox nodes |
| **free** | Actual memory usage vs allocated | each node via SSH |
| **nproc** | CPU core counts | each node via SSH |

### Automation Status
| Tool | Feeds | Install on |
|---|---|---|
| **journalctl** | Cron/systemd automation run logs | automation host |
| **ps** / **systemctl** | Active workflow/service status | automation host |

## Consolidated Install List

| Tool | Pre-installed? | Install where if missing |
|---|---|---|
| **pvesh** | Yes (comes with Proxmox) | — |
| **qm** / **pct** | Yes (comes with Proxmox) | — |
| **zpool** / **zfs** | Yes (if using ZFS) | — |
| **proxmox-backup-client** | Check | Proxmox nodes |
| **fping** | No | infr-collector: `apt install fping` |
| **curl** | Yes | — |
| **vmstat** | Yes (procps) | — |
| **iostat** | Maybe | `apt install sysstat` on each node |
| **free** | Yes | — |
| **df** | Yes | — |
| **uptime** | Yes | — |
| **ss** | Yes | — |
| **ps** | Yes | — |
| **nproc** | Yes | — |
| **last** | Yes | — |
| **journalctl** | Yes | — |
| **Python 3** | Yes | — |

**Net new installs needed on the collector: `fping` and `sysstat`**

## Quick Setup

1. Create a small LXC on any Proxmox node (512 MB RAM, 4 GB disk, Debian/Ubuntu)
2. Run the collector setup script (installs Python, fping, sysstat, generates SSH keys)
3. Copy the SSH public key to each Proxmox node
4. Edit `config.yaml` with your node hostnames and services
5. Start the collector service
6. Open the dashboard in a browser
