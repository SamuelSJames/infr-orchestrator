window.operationsData = {
  logs: [
    { severity: "info", time: "2025-04-24 11:42:18", node: "pve-node-1", service: "vzdump", message: 'Backup job started for VM 101' },
    { severity: "info", time: "2025-04-24 11:42:18", node: "pve-node-1", service: "vzdump", message: 'Creating snapshot' },
    { severity: "info", time: "2025-04-24 11:42:18", node: "pve-node-2", service: "pveproxy", message: 'Successful API request from 10.0.0.5' },
    { severity: "warning", time: "2025-04-24 11:42:18", node: "pve-node-1", service: "zfs-auto-snapshot", message: 'Pool usage above 80%' },
    { severity: "info", time: "2025-04-24 11:42:18", node: "infr-collector", service: "fping", message: 'Sweep complete: 5/6 nodes reachable' },
    { severity: "error", time: "2025-04-24 11:42:17", node: "backup-server", service: "vzdump", message: 'Backup failed for CT 103: connection timeout' },
    { severity: "info", time: "2025-04-24 11:42:17", node: "pve-node-2", service: "cron", message: 'Scheduled task completed: cleanup-snapshots' },
    { severity: "info", time: "2025-04-24 11:42:17", node: "edge-proxy", service: "nginx", message: 'Upstream health check passed' },
    { severity: "warning", time: "2025-04-24 11:42:16", node: "infr-collector", service: "cert-check", message: 'Certificate expires in 14 days: example.com' },
    { severity: "info", time: "2025-04-24 11:42:16", node: "pve-node-1", service: "sshd", message: 'Accepted publickey for admin' },
    { severity: "info", time: "2025-04-24 11:42:15", node: "pve-node-2", service: "vzdump", message: 'Backup job completed for CT 105' },
    { severity: "info", time: "2025-04-24 11:42:14", node: "infr-collector", service: "collector", message: 'Poll cycle complete: 6 nodes, 14 services' },
    { severity: "error", time: "2025-04-24 11:42:13", node: "worker-1", service: "systemd", message: 'Service docker.service failed to start' },
    { severity: "info", time: "2025-04-24 11:42:12", node: "pve-node-1", service: "pvestatd", message: 'Status update: 8 VMs, 7 CTs' },
  ],

  tasks: [
    { icon: "⟳", task: "Running", node: "pve-node-1", duration: "2m 14s", status: "running" },
    { icon: "💾", task: "Backup VM 101 (full)", node: "pve-node-1", duration: "2m 14s", status: "success" },
    { icon: "▶", task: "Start CT 103", node: "pve-node-2", duration: "0.8s", status: "failed" },
    { icon: "▶", task: "Start CT 103", node: "pve-node-2", duration: "0.8s", status: "failed" },
    { icon: "⏹", task: "Stop VM 200", node: "pve-node-1", duration: "1.2s", status: "success" },
    { icon: "💾", task: "Backup VM 101 (full)", node: "pve-node-1", duration: "0.8s", status: "success" },
    { icon: "⏹", task: "Stop VM 101", node: "pve-node-1", duration: "0.8s", status: "success" },
    { icon: "↔", task: "Migrate VM 101 (full)", node: "pve-node-1", duration: "4.2s", status: "running" },
  ],

  automationJobs: [
    { name: "fping-sweep", schedule: "every 5m", lastRun: "2025-04-24 11:42", duration: "0.8s", exitCode: 0, error: null },
    { name: "backup-all", schedule: "daily 2:00", lastRun: "2025-04-24 19:00", duration: "0.8s", exitCode: 0, error: null },
    { name: "cert-check", schedule: "weekly Sun", lastRun: "2025-04-24 11:42", duration: "1.0s", exitCode: 1, error: "Error hint: From savename 203.0.113.45" },
    { name: "zfs-scrub", schedule: "weekly Sun", lastRun: "2025-04-24 11:42", duration: "0.8s", exitCode: 0, error: null },
    { name: "snapshot-cleanup", schedule: "every 5m", lastRun: "2025-04-24 11:42", duration: "0.8s", exitCode: 0, error: null },
    { name: "collector-poll", schedule: "weekly Sun", lastRun: "2025-04-24 11:42", duration: "0.6s", exitCode: 0, error: null },
  ],

  recentLogins: [
    { user: "username", ip: "203.0.11.3", node: "pve-node-1", time: "30 hrs ago" },
    { user: "root", ip: "203.0.113.45", node: "pve-node-1", time: "35 mins ago" },
    { user: "username", ip: "203.13.45", node: "pve-node-2", time: "20 hrs ago" },
    { user: "username", ip: "203.1.11.3", node: "edge-proxy", time: "20 mins ago" },
    { user: "root", ip: "203.0.113.45", node: "backup-server", time: "25 ans ago" },
  ],

  securityAlerts: [
    { message: "Failed login: root from 203.0.113.45", severity: "critical", time: "24 ans ago" },
    { message: "Certificate expiring: example.com (14 days)", severity: "warning", time: "25 ans ago" },
    { message: "fail2ban: banned 198.51.100.12 (sshd)", severity: "warning", time: "15 mins ago" },
  ],

  nodeStatus: [
    { name: "pve-node-1", status: "up", uptime: "21m 17m", cpu: 34, mem: 72, disk: 45 },
    { name: "pve-node-2", status: "up", uptime: "21m 17m", cpu: 18, mem: 55, disk: 32 },
    { name: "edge-proxy", status: "up", uptime: "70m 23m", cpu: 8, mem: 22, disk: 15 },
    { name: "infr-collector", status: "up", uptime: "41m 30m", cpu: 12, mem: 38, disk: 28 },
    { name: "backup-server", status: "degraded", uptime: "62m 13m", cpu: 45, mem: 82, disk: 71 },
    { name: "worker-1", status: "down", uptime: "—", cpu: 0, mem: 0, disk: 0 },
  ],
};
