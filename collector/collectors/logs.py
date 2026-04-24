"""
Log collector — gathers recent journal entries and PVE tasks.
"""

import json
import time
from .ssh import ssh_run


def collect_logs(pve_nodes, ssh_cfg):
    """
    Collect recent log entries and task history from PVE nodes.
    Returns dict with entries (log lines) and tasks (PVE operations).
    """
    result = {
        "entries": [],
        "tasks": [],
    }

    for node in pve_nodes:
        host = node["host"]
        node_name = node["name"]

        # Journal entries (last 30 minutes, JSON format)
        log_raw = ssh_run(
            host,
            'journalctl --since "30 min ago" -o json --no-pager 2>/dev/null | tail -30',
            ssh_cfg,
        )
        if log_raw:
            for line in log_raw.strip().split("\n"):
                if not line.strip():
                    continue
                try:
                    entry = json.loads(line)
                    priority = int(entry.get("PRIORITY", 6))
                    if priority <= 3:
                        severity = "error"
                    elif priority <= 4:
                        severity = "warning"
                    else:
                        severity = "info"

                    ts = entry.get("__REALTIME_TIMESTAMP", "")
                    if ts:
                        ts_sec = int(ts) / 1_000_000
                        time_str = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime(ts_sec))
                    else:
                        time_str = ""

                    result["entries"].append({
                        "severity": severity,
                        "time": time_str,
                        "node": node_name,
                        "service": entry.get("SYSLOG_IDENTIFIER", entry.get("_COMM", "unknown")),
                        "message": entry.get("MESSAGE", ""),
                    })
                except (json.JSONDecodeError, TypeError, ValueError):
                    continue

        # PVE tasks (recent operations)
        node_hostname = ssh_run(host, "hostname -s", ssh_cfg)
        if node_hostname:
            tasks_json = ssh_run(
                host,
                f"pvesh get /nodes/{node_hostname.strip()}/tasks --output-format json --limit 10 2>/dev/null",
                ssh_cfg,
            )
            if tasks_json:
                try:
                    tasks = json.loads(tasks_json)
                    for t in tasks:
                        end = t.get("endtime", 0)
                        diff = int(time.time()) - end if end else 0
                        if diff < 3600:
                            time_ago = f"{diff // 60}m ago"
                        elif diff < 86400:
                            time_ago = f"{diff // 3600}h ago"
                        else:
                            time_ago = f"{diff // 86400}d ago"

                        result["tasks"].append({
                            "title": f"{t.get('type', 'task')}: {t.get('id', '')}",
                            "time": time_ago,
                            "result": "success" if t.get("status") == "OK" else "failed",
                            "node": node_name,
                        })
                except (json.JSONDecodeError, TypeError):
                    pass

    # Sort entries by time descending
    result["entries"].sort(key=lambda x: x.get("time", ""), reverse=True)
    result["tasks"].sort(key=lambda x: x.get("time", ""))

    return result
