"""
Infr-Orchestrator Collector — API Server

Serves live infrastructure data to the dashboard frontend.
Runs periodic collection cycles using SSH + CLI tools.
"""

import json
import os
import threading
import time
from pathlib import Path

import yaml
from flask import Flask, jsonify, send_from_directory

from collectors.ping import collect_ping
from collectors.proxmox import collect_proxmox
from collectors.system import collect_system
from collectors.backup import collect_backup
from collectors.logs import collect_logs
from collectors.security import collect_security

app = Flask(__name__)

# ── Load config ──
CONFIG_PATH = os.environ.get("INFR_CONFIG", "config.yaml")

def load_config():
    path = Path(CONFIG_PATH)
    if not path.exists():
        print(f"[WARN] Config not found at {CONFIG_PATH}, using example config")
        path = Path("config.yaml.example")
    with open(path) as f:
        return yaml.safe_load(f)

config = load_config()

# ── Shared state ──
state = {
    "last_poll": None,
    "stats": {},
    "topology": [],
    "health": [],
    "operations": [],
    "tenants": [],
    "backup": {},
    "inventory": {},
    "automation": {},
    "logs": [],
    "tasks": [],
    "jobs": [],
    "logins": [],
    "alerts": [],
    "node_status": [],
}
state_lock = threading.Lock()


def run_collection_cycle():
    """Execute all collectors and update shared state."""
    cfg = config
    ssh_cfg = cfg.get("ssh", {})
    nodes = cfg.get("nodes", [])
    infra = cfg.get("infrastructure", [])
    all_nodes = nodes + infra

    results = {}

    # 1. Ping sweep
    hosts = {n["name"]: n["host"] for n in all_nodes}
    ping_results = collect_ping(hosts)
    results["ping"] = ping_results

    # 2. Proxmox data (from PVE nodes only)
    pve_nodes = [n for n in nodes if n.get("type") == "proxmox"]
    pve_data = {}
    for node in pve_nodes:
        data = collect_proxmox(node["host"], ssh_cfg)
        if data:
            pve_data[node["name"]] = data
    results["proxmox"] = pve_data

    # 3. System metrics (from all reachable nodes)
    sys_data = {}
    for node in all_nodes:
        if ping_results.get(node["name"], {}).get("alive"):
            data = collect_system(node["host"], ssh_cfg)
            if data:
                sys_data[node["name"]] = data
    results["system"] = sys_data

    # 4. Backup posture (from PBS nodes)
    pbs_nodes = [n for n in all_nodes if n.get("type") == "pbs"]
    backup_data = collect_backup(pve_nodes, pbs_nodes, ssh_cfg)
    results["backup"] = backup_data

    # 5. Logs
    log_data = collect_logs(pve_nodes, ssh_cfg)
    results["logs"] = log_data

    # 6. Security
    sec_data = collect_security(all_nodes, ssh_cfg)
    results["security"] = sec_data

    # ── Build dashboard state ──
    with state_lock:
        # Stats (KPI cards)
        total_nodes = len(all_nodes)
        online_nodes = sum(1 for n in all_nodes if ping_results.get(n["name"], {}).get("alive"))

        total_vms = sum(d.get("vm_count", 0) for d in pve_data.values())
        running_vms = sum(d.get("vm_running", 0) for d in pve_data.values())
        total_cts = sum(d.get("ct_count", 0) for d in pve_data.values())
        running_cts = sum(d.get("ct_running", 0) for d in pve_data.values())

        state["stats"] = {
            "nodes_online": online_nodes,
            "nodes_total": total_nodes,
            "vms_running": running_vms,
            "vms_stopped": total_vms - running_vms,
            "containers_total": total_cts,
            "containers_running": running_cts,
            "backup_health": backup_data.get("percent", 0),
            "backup_warning": backup_data.get("warning_count", 0),
            "alerts": sec_data.get("alert_count", 0),
            "critical_alerts": sec_data.get("critical_count", 0),
        }

        # Topology
        topo_config = cfg.get("topology", [])
        topo_rows = []
        for row in topo_config:
            row_nodes = []
            for node_name in row.get("nodes", []):
                node_cfg = next((n for n in all_nodes if n["name"] == node_name), None)
                if node_cfg:
                    alive = ping_results.get(node_name, {}).get("alive", False)
                    latency = ping_results.get(node_name, {}).get("latency_ms")
                    sys = sys_data.get(node_name, {})
                    row_nodes.append({
                        "name": node_name,
                        "role": node_cfg.get("role", ""),
                        "os": node_cfg.get("type", "linux"),
                        "status": "up" if alive else "down",
                        "latency_ms": latency,
                        "cpu_percent": sys.get("cpu_percent"),
                        "mem_percent": sys.get("mem_percent"),
                    })
            topo_rows.append({
                "label": row["label"],
                "color": row["color"],
                "icon": row.get("icon", "server"),
                "nodes": row_nodes,
            })
        state["topology"] = topo_rows

        # Health
        health_checks = []
        # Compute health
        compute_ok = all(ping_results.get(n["name"], {}).get("alive") for n in pve_nodes)
        health_checks.append({"label": "Compute", "status": "healthy" if compute_ok else "critical"})
        # Storage health
        storage_nodes = [n for n in all_nodes if n.get("layer") == "storage"]
        storage_ok = all(ping_results.get(n["name"], {}).get("alive") for n in storage_nodes)
        health_checks.append({"label": "Storage", "status": "healthy" if storage_ok else "warning"})
        # Networking
        avg_latency = 0
        latencies = [v.get("latency_ms", 0) for v in ping_results.values() if v.get("latency_ms")]
        if latencies:
            avg_latency = sum(latencies) / len(latencies)
        health_checks.append({"label": "Networking", "status": "healthy" if avg_latency < 50 else "warning"})
        # Backup
        bp = backup_data.get("percent", 0)
        health_checks.append({"label": "Backup", "status": "healthy" if bp >= 95 else "warning" if bp >= 70 else "critical"})
        # Automation (collector itself)
        health_checks.append({"label": "Automation", "status": "healthy"})
        # DNS
        health_checks.append({"label": "DNS", "status": "healthy"})
        state["health"] = health_checks

        # Inventory
        total_vcpus = sum(d.get("total_vcpus", 0) for d in pve_data.values())
        total_mem_gb = sum(d.get("total_mem_gb", 0) for d in pve_data.values())
        used_mem_gb = sum(d.get("used_mem_gb", 0) for d in pve_data.values())
        total_disk_gb = sum(d.get("total_disk_gb", 0) for d in pve_data.values())
        used_disk_gb = sum(d.get("used_disk_gb", 0) for d in pve_data.values())

        state["inventory"] = {
            "pve_nodes_online": len([n for n in pve_nodes if ping_results.get(n["name"], {}).get("alive")]),
            "pve_nodes_total": len(pve_nodes),
            "vms_total": total_vms,
            "vms_running": running_vms,
            "cts_total": total_cts,
            "cts_running": running_cts,
            "total_vcpus": total_vcpus,
            "total_mem_gb": round(total_mem_gb, 1),
            "used_mem_gb": round(used_mem_gb, 1),
            "total_disk_gb": round(total_disk_gb, 1),
            "used_disk_gb": round(used_disk_gb, 1),
        }

        # Backup posture
        state["backup"] = backup_data

        # Operations (recent PVE tasks)
        state["operations"] = results.get("logs", {}).get("tasks", [])[:20]

        # Logs
        state["logs"] = results.get("logs", {}).get("entries", [])[:50]

        # Security
        state["logins"] = sec_data.get("logins", [])[:10]
        state["alerts"] = sec_data.get("alerts", [])[:10]

        # Node status (for operations page strip)
        node_status = []
        for node in all_nodes:
            alive = ping_results.get(node["name"], {}).get("alive", False)
            sys = sys_data.get(node["name"], {})
            node_status.append({
                "name": node["name"],
                "status": "up" if alive else "down",
                "uptime": sys.get("uptime", "—"),
                "cpu": sys.get("cpu_percent", 0),
                "mem": sys.get("mem_percent", 0),
                "disk": sys.get("disk_percent", 0),
            })
        state["node_status"] = node_status

        # Avg latency for KPI
        state["stats"]["avg_latency_ms"] = round(avg_latency, 1) if latencies else 0

        state["last_poll"] = time.strftime("%Y-%m-%d %H:%M:%S")

    print(f"[OK] Collection cycle complete at {state['last_poll']}")


def poll_loop():
    """Background thread that runs collection on an interval."""
    interval = config.get("api", {}).get("poll_interval", 60)
    while True:
        try:
            run_collection_cycle()
        except Exception as e:
            print(f"[ERROR] Collection failed: {e}")
        time.sleep(interval)


# ── API Routes ──

@app.route("/api/dashboard")
def api_dashboard():
    """Full dashboard payload for the overview page."""
    with state_lock:
        return jsonify(state)

@app.route("/api/stats")
def api_stats():
    with state_lock:
        return jsonify(state.get("stats", {}))

@app.route("/api/topology")
def api_topology():
    with state_lock:
        return jsonify(state.get("topology", []))

@app.route("/api/health")
def api_health():
    with state_lock:
        return jsonify(state.get("health", []))

@app.route("/api/operations")
def api_operations():
    with state_lock:
        return jsonify(state.get("operations", []))

@app.route("/api/inventory")
def api_inventory():
    with state_lock:
        return jsonify(state.get("inventory", {}))

@app.route("/api/backup")
def api_backup():
    with state_lock:
        return jsonify(state.get("backup", {}))

@app.route("/api/logs")
def api_logs():
    with state_lock:
        return jsonify(state.get("logs", []))

@app.route("/api/security")
def api_security():
    with state_lock:
        return jsonify({
            "logins": state.get("logins", []),
            "alerts": state.get("alerts", []),
        })

@app.route("/api/nodes")
def api_nodes():
    with state_lock:
        return jsonify(state.get("node_status", []))

@app.route("/api/status")
def api_status():
    with state_lock:
        return jsonify({
            "status": "ok",
            "last_poll": state.get("last_poll"),
        })


# ── Serve static frontend (optional) ──
DOCS_DIR = os.path.join(os.path.dirname(__file__), "..", "docs")

@app.route("/")
def serve_index():
    return send_from_directory(DOCS_DIR, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(DOCS_DIR, path)


if __name__ == "__main__":
    # Start background collector
    t = threading.Thread(target=poll_loop, daemon=True)
    t.start()

    host = config.get("api", {}).get("host", "0.0.0.0")
    port = config.get("api", {}).get("port", 8081)
    print(f"[OK] Infr-Orchestrator Collector starting on {host}:{port}")
    app.run(host=host, port=port, debug=False)
