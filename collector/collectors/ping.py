"""
Ping collector — uses fping for parallel host reachability checks.
"""

import subprocess
import re


def collect_ping(hosts):
    """
    Ping all hosts using fping.
    hosts: dict of {name: ip_or_hostname}
    Returns: dict of {name: {alive: bool, latency_ms: float|None}}
    """
    if not hosts:
        return {}

    results = {name: {"alive": False, "latency_ms": None} for name in hosts}
    ip_to_name = {ip: name for name, ip in hosts.items()}

    try:
        ip_list = list(hosts.values())
        proc = subprocess.run(
            ["fping", "-C", "3", "-q", "-t", "2000"] + ip_list,
            capture_output=True,
            text=True,
            timeout=30,
        )
        # fping outputs to stderr in quiet mode
        output = proc.stderr

        for line in output.strip().split("\n"):
            if not line.strip():
                continue
            # Format: "192.168.1.1 : 0.45 0.38 0.42" or "192.168.1.2 : - - -"
            match = re.match(r"^(\S+)\s+:\s+(.+)$", line)
            if match:
                ip = match.group(1)
                times_str = match.group(2).strip()
                times = [t for t in times_str.split() if t != "-"]

                name = ip_to_name.get(ip)
                if name:
                    if times:
                        latencies = [float(t) for t in times]
                        results[name]["alive"] = True
                        results[name]["latency_ms"] = round(sum(latencies) / len(latencies), 2)
                    else:
                        results[name]["alive"] = False

    except FileNotFoundError:
        print("[WARN] fping not found — install with: apt install fping")
        # Fallback: mark all as unknown
    except subprocess.TimeoutExpired:
        print("[WARN] fping timed out")
    except Exception as e:
        print(f"[ERROR] fping failed: {e}")

    return results
