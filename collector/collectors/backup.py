"""
Backup collector — gathers backup job status from Proxmox nodes.
"""

import json
import time
from .ssh import ssh_run


def collect_backup(pve_nodes, pbs_nodes, ssh_cfg):
    """
    Collect backup posture from PVE and PBS nodes.
    Returns dict with percent, breakdown, and last_backup.
    """
    result = {
        "percent": 0,
        "successful": 0,
        "warning_count": 0,
        "failed": 0,
        "skipped": 0,
        "last_backup": "—",
        "breakdown": [],
    }

    total = 0
    successful = 0
    warning = 0
    failed = 0
    last_time = 0

    for node in pve_nodes:
        host = node["host"]
        node_name_raw = ssh_run(host, "hostname -s", ssh_cfg)
        if not node_name_raw:
            continue
        node_name = node_name_raw.strip()

        # Get recent backup tasks
        tasks_json = ssh_run(
            host,
            f"pvesh get /nodes/{node_name}/tasks --output-format json --typefilter vzdump --limit 50 2>/dev/null",
            ssh_cfg,
        )
        if not tasks_json:
            continue

        try:
            tasks = json.loads(tasks_json)
        except (json.JSONDecodeError, TypeError):
            continue

        for t in tasks:
            total += 1
            status = t.get("status", "")
            if status == "OK":
                successful += 1
            elif "warning" in status.lower():
                warning += 1
            else:
                failed += 1

            end = t.get("endtime", 0)
            if end > last_time:
                last_time = end

    # Calculate
    if total > 0:
        result["percent"] = round((successful / total) * 100)
    result["successful"] = successful
    result["warning_count"] = warning
    result["failed"] = failed
    result["skipped"] = 0  # PVE doesn't track skipped natively

    if last_time > 0:
        diff = int(time.time()) - last_time
        if diff < 3600:
            result["last_backup"] = f"{diff // 60}m ago"
        elif diff < 86400:
            result["last_backup"] = f"{diff // 3600}h ago"
        else:
            result["last_backup"] = f"{diff // 86400}d ago"

    result["breakdown"] = [
        {"label": "Successful", "value": successful},
        {"label": "Warning", "value": warning},
        {"label": "Failed", "value": failed},
        {"label": "Skipped", "value": 0},
    ]

    return result
