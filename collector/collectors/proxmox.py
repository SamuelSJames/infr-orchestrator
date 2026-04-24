"""
Proxmox collector — gathers VM, CT, storage, and task data via pvesh over SSH.
"""

import json
from .ssh import ssh_run


def collect_proxmox(host, ssh_cfg):
    """
    Collect Proxmox data from a PVE node.
    Returns dict with VM/CT counts, resource totals, and recent tasks.
    """
    result = {
        "vm_count": 0,
        "vm_running": 0,
        "ct_count": 0,
        "ct_running": 0,
        "total_vcpus": 0,
        "total_mem_gb": 0,
        "used_mem_gb": 0,
        "total_disk_gb": 0,
        "used_disk_gb": 0,
        "tasks": [],
    }

    # Get node name
    node_name_raw = ssh_run(host, "hostname -s", ssh_cfg)
    if not node_name_raw:
        return None
    node_name = node_name_raw.strip()

    # VMs (qemu)
    vm_json = ssh_run(host, f"pvesh get /nodes/{node_name}/qemu --output-format json 2>/dev/null", ssh_cfg)
    if vm_json:
        try:
            vms = json.loads(vm_json)
            result["vm_count"] = len(vms)
            result["vm_running"] = sum(1 for v in vms if v.get("status") == "running")
            result["total_vcpus"] += sum(v.get("cpus", 0) for v in vms)
            result["total_mem_gb"] += sum(v.get("maxmem", 0) for v in vms) / (1024 ** 3)
            result["used_mem_gb"] += sum(v.get("mem", 0) for v in vms if v.get("status") == "running") / (1024 ** 3)
        except (json.JSONDecodeError, TypeError):
            pass

    # Containers (lxc)
    ct_json = ssh_run(host, f"pvesh get /nodes/{node_name}/lxc --output-format json 2>/dev/null", ssh_cfg)
    if ct_json:
        try:
            cts = json.loads(ct_json)
            result["ct_count"] = len(cts)
            result["ct_running"] = sum(1 for c in cts if c.get("status") == "running")
            result["total_vcpus"] += sum(c.get("cpus", 0) for c in cts)
            result["total_mem_gb"] += sum(c.get("maxmem", 0) for c in cts) / (1024 ** 3)
            result["used_mem_gb"] += sum(c.get("mem", 0) for c in cts if c.get("status") == "running") / (1024 ** 3)
        except (json.JSONDecodeError, TypeError):
            pass

    # Storage
    storage_json = ssh_run(host, f"pvesh get /nodes/{node_name}/storage --output-format json 2>/dev/null", ssh_cfg)
    if storage_json:
        try:
            storages = json.loads(storage_json)
            for s in storages:
                if s.get("active"):
                    result["total_disk_gb"] += s.get("total", 0) / (1024 ** 3)
                    result["used_disk_gb"] += s.get("used", 0) / (1024 ** 3)
        except (json.JSONDecodeError, TypeError):
            pass

    # Recent tasks
    tasks_json = ssh_run(host, f"pvesh get /nodes/{node_name}/tasks --output-format json --limit 20 2>/dev/null", ssh_cfg)
    if tasks_json:
        try:
            tasks = json.loads(tasks_json)
            for t in tasks[:10]:
                result["tasks"].append({
                    "task": t.get("type", "unknown"),
                    "status": "success" if t.get("status") == "OK" else "failed",
                    "node": node_name,
                    "id": t.get("id", ""),
                    "starttime": t.get("starttime", 0),
                    "endtime": t.get("endtime", 0),
                })
        except (json.JSONDecodeError, TypeError):
            pass

    return result
