"""
System collector — gathers CPU, memory, disk, and uptime via SSH.
"""

from .ssh import ssh_run


def collect_system(host, ssh_cfg):
    """
    Collect system metrics from a Linux host.
    Returns dict with cpu_percent, mem_percent, disk_percent, uptime.
    """
    result = {
        "cpu_percent": 0,
        "mem_percent": 0,
        "disk_percent": 0,
        "uptime": "—",
    }

    # Uptime
    uptime_raw = ssh_run(host, "uptime -p 2>/dev/null || uptime", ssh_cfg)
    if uptime_raw:
        result["uptime"] = uptime_raw.replace("up ", "").strip()

    # CPU — use vmstat 1-second sample
    cpu_raw = ssh_run(host, "vmstat 1 2 | tail -1 | awk '{print 100 - $15}'", ssh_cfg)
    if cpu_raw:
        try:
            result["cpu_percent"] = int(float(cpu_raw))
        except ValueError:
            pass

    # Memory — use free
    mem_raw = ssh_run(host, "free | awk '/^Mem:/ {printf \"%.0f\", $3/$2 * 100}'", ssh_cfg)
    if mem_raw:
        try:
            result["mem_percent"] = int(float(mem_raw))
        except ValueError:
            pass

    # Disk — root partition
    disk_raw = ssh_run(host, "df / | awk 'NR==2 {gsub(/%/,\"\"); print $5}'", ssh_cfg)
    if disk_raw:
        try:
            result["disk_percent"] = int(float(disk_raw))
        except ValueError:
            pass

    return result
