"""
Security collector — gathers login history and security alerts.
"""

import re
from .ssh import ssh_run


def collect_security(all_nodes, ssh_cfg):
    """
    Collect recent logins and security alerts from all nodes.
    Returns dict with logins, alerts, alert_count, critical_count.
    """
    result = {
        "logins": [],
        "alerts": [],
        "alert_count": 0,
        "critical_count": 0,
    }

    for node in all_nodes:
        host = node["host"]
        name = node["name"]

        # Skip localhost
        if host in ("127.0.0.1", "localhost"):
            continue

        # Recent successful logins (last command)
        last_raw = ssh_run(host, "last -n 5 -w 2>/dev/null | head -5", ssh_cfg)
        if last_raw:
            for line in last_raw.strip().split("\n"):
                if not line.strip() or line.startswith("wtmp") or line.startswith("reboot"):
                    continue
                parts = line.split()
                if len(parts) >= 3:
                    result["logins"].append({
                        "user": parts[0],
                        "ip": parts[2] if not parts[2].startswith(":") else "console",
                        "node": name,
                        "time": " ".join(parts[3:7]) if len(parts) > 6 else "",
                    })

        # Failed login attempts (lastb, needs root)
        lastb_raw = ssh_run(host, "lastb -n 5 -w 2>/dev/null | head -5", ssh_cfg)
        if lastb_raw:
            for line in lastb_raw.strip().split("\n"):
                if not line.strip() or line.startswith("btmp"):
                    continue
                parts = line.split()
                if len(parts) >= 3:
                    ip = parts[2] if not parts[2].startswith(":") else "console"
                    result["alerts"].append({
                        "message": f"Failed login: {parts[0]} from {ip}",
                        "severity": "critical",
                        "time": " ".join(parts[3:7]) if len(parts) > 6 else "",
                        "node": name,
                    })
                    result["critical_count"] += 1

        # fail2ban status (if installed)
        f2b_raw = ssh_run(host, "fail2ban-client status sshd 2>/dev/null", ssh_cfg)
        if f2b_raw and "Banned IP" in f2b_raw:
            # Extract banned IPs
            match = re.search(r"Banned IP list:\s*(.*)", f2b_raw)
            if match:
                banned = match.group(1).strip()
                if banned:
                    for ip in banned.split():
                        result["alerts"].append({
                            "message": f"fail2ban: banned {ip} (sshd)",
                            "severity": "warning",
                            "time": "active",
                            "node": name,
                        })

    result["alert_count"] = len(result["alerts"])
    # Limit results
    result["logins"] = result["logins"][:10]
    result["alerts"] = result["alerts"][:10]

    return result
