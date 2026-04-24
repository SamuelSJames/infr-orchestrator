window.dashboardData = {
  stats: [
    {
      label: "Nodes Online",
      value: "5 / 6",
      sub: "83.3%",
      color: "blue",
      icon: "./assets/icons/server.svg",
      width: 83,
    },
    {
      label: "VMs Running",
      value: "18",
      sub: "2 stopped",
      color: "green",
      icon: "./assets/icons/monitor.svg",
      width: 90,
    },
    {
      label: "Containers",
      value: "12",
      sub: "All healthy",
      color: "cyan",
      icon: "./assets/icons/container.svg",
      width: 100,
    },
    {
      label: "Backup Health",
      value: "94%",
      sub: "1 warning",
      color: "amber",
      icon: "./assets/icons/shield.svg",
      width: 94,
    },
    {
      label: "Network Latency",
      value: "1.2ms",
      sub: "avg across mesh",
      color: "blue",
      icon: "./assets/icons/network.svg",
      width: 95,
    },
    {
      label: "Active Alerts",
      value: "3",
      sub: "1 critical",
      color: "red",
      icon: "./assets/icons/bell.svg",
      width: 15,
    },
  ],

  automationCore: {
    status: "Running",
    metrics: [
      ["Status", "Running"],
      ["Host", "infr-collector"],
      ["Uptime", "47d 8h 12m"],
      ["Workers", "4"],
      ["Queue", "2 tasks"],
      ["Last Run", "45s ago"],
    ],
  },

  topologyRows: [
    {
      label: "Edge / Access",
      color: "blue",
      icon: "./assets/icons/globe.svg",
      nodes: [
        { name: "edge-proxy", role: "Reverse Proxy", os: "nginx", status: "up" },
        { name: "dns-provider", role: "DNS / CDN", os: "cloudflare", status: "up" },
        { name: "vpn-mesh", role: "VPN Overlay", os: "wireguard", status: "up" },
      ],
    },
    {
      label: "Identity / Control",
      color: "purple",
      icon: "./assets/icons/key.svg",
      nodes: [
        { name: "auth-server", role: "Identity Provider", os: "debian", status: "up" },
        { name: "infr-collector", role: "Dashboard Collector", os: "python", status: "up", primary: true },
        { name: "git-server", role: "Git Repository", os: "git", status: "up" },
      ],
    },
    {
      label: "Compute",
      color: "green",
      icon: "./assets/icons/cpu.svg",
      nodes: [
        { name: "pve-node-1", role: "Proxmox Node", os: "proxmox", status: "up" },
        { name: "pve-node-2", role: "Proxmox Node", os: "proxmox", status: "up" },
        { name: "worker-1", role: "Worker Node", os: "debian", status: "up" },
        { name: "worker-2", role: "Worker Node", os: "ubuntu", status: "down" },
      ],
    },
    {
      label: "Storage / Backup",
      color: "amber",
      icon: "./assets/icons/hard-drive.svg",
      nodes: [
        { name: "zfs-pool", role: "Local ZFS", os: "linux", status: "up" },
        { name: "backup-server", role: "Proxmox Backup", os: "proxmox", status: "degraded" },
        { name: "nfs-share", role: "NFS / SMB", os: "linux", status: "up" },
      ],
    },
    {
      label: "Observability",
      color: "cyan",
      icon: "./assets/icons/eye.svg",
      nodes: [
        { name: "metrics-agent", role: "Metrics Collector", os: "linux", status: "up" },
        { name: "log-aggregator", role: "Log Pipeline", os: "linux", status: "up" },
        { name: "alert-engine", role: "Alert Router", os: "python", status: "up" },
      ],
    },
  ],

  healthItems: [
    { label: "Compute", status: "healthy" },
    { label: "Storage", status: "warning" },
    { label: "Networking", status: "healthy" },
    { label: "Backup", status: "warning" },
    { label: "Automation", status: "healthy" },
    { label: "DNS", status: "healthy" },
  ],

  operations: [
    { title: "LXC Start: collector-01", time: "2m ago", result: "success" },
    { title: "Backup: pve-node-1 full", time: "12m ago", result: "success" },
    { title: "VM Stop: dev-sandbox", time: "18m ago", result: "success" },
    { title: "Cert Check: example.com", time: "1h ago", result: "warning" },
    { title: "Backup: nfs-share", time: "3h ago", result: "failed" },
    { title: "fping sweep: all nodes", time: "5m ago", result: "success" },
    { title: "ZFS scrub: pve-node-1", time: "6h ago", result: "success" },
    { title: "Snapshot cleanup", time: "8h ago", result: "success" },
  ],

  tenants: [
    { name: "Infrastructure", desc: "Core platform LXCs and services", vms: 6, containers: 5 },
    { name: "Development", desc: "CI/CD, staging, and test workloads", vms: 4, containers: 8 },
    { name: "Networking", desc: "Lab environments and simulations", vms: 3, containers: 0 },
    { name: "Media", desc: "Media processing and storage", vms: 2, containers: 1 },
    { name: "Personal", desc: "Personal projects and experiments", vms: 3, containers: 2 },
  ],

  backupPosture: {
    percent: 88,
    breakdown: [
      { label: "Successful", value: 22 },
      { label: "Warning", value: 2 },
      { label: "Failed", value: 1 },
      { label: "Skipped", value: 3 },
    ],
    lastBackup: "45m ago",
  },

  inventory: [
    { label: "Proxmox Nodes", value: "2 / 2", status: "online" },
    { label: "Virtual Machines", value: "8", detail: "6 running", status: "online" },
    { label: "LXC Containers", value: "7", detail: "5 running", status: "online" },
    { label: "Total vCPUs", value: "24", status: "allocated" },
    { label: "Total Memory", value: "63 GB", detail: "41 GB used", status: "warning" },
    { label: "Total Storage", value: "1.2 TB", detail: "38% used", status: "online" },
  ],

  automationStatus: {
    rows: [
      { label: "Active Workflows", value: 3 },
      { label: "Queued Tasks", value: 1 },
      { label: "Completed (24h)", value: 47 },
      { label: "Failed (24h)", value: 1 },
    ],
    successRate: 98,
  },
};
