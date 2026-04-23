const stats = [
  { label: "Nodes Online", value: "7", meta: "Cluster + service nodes", color: "blue" },
  { label: "Protected Workloads", value: "24", meta: "Backed by restore policy", color: "purple" },
  { label: "Backup Health", value: "100%", meta: "Last nightly run passed", color: "green" },
  { label: "Active Projects", value: "5", meta: "Tenant and internal spaces", color: "amber" },
  { label: "Automation Runs (24h)", value: "152", meta: "Planner and ops workflows", color: "cyan" },
  { label: "Alerts", value: "0", meta: "No critical incidents", color: "red" },
];

const topologyColumns = [
  {
    title: "Edge / Access",
    color: "blue",
    icon: "🌐",
    rows: [
      [
        { name: "Internet", role: "External entry", note: "User traffic" },
        { name: "Edge Gateway", role: "Ingress + TLS", note: "Reverse proxy" },
      ],
    ],
  },
  {
    title: "Identity / Control Plane",
    color: "purple",
    icon: "🛡️",
    rows: [[{ name: "Claw-Core", role: "Automation core", note: "Control node" }]],
  },
  {
    title: "Compute Fabric",
    color: "green",
    icon: "🖥️",
    rows: [
      [{ name: "PVE-A", role: "Primary compute", note: "Virtualization node" }],
      [{ name: "PVE-B", role: "Secondary compute", note: "Worker + tenant node" }],
    ],
  },
  {
    title: "Storage / Backup",
    color: "amber",
    icon: "🗄️",
    rows: [[{ name: "Object-Store", role: "Artifacts + backups", note: "Storage core" }]],
  },
  {
    title: "Observability / Operations",
    color: "cyan",
    icon: "📊",
    rows: [[{ name: "Metrics-Core", role: "Monitoring stack", note: "Operations node" }]],
  },
];

const operations = [
  {
    title: "Commit validated for tenant rollout",
    sub: "Tenant workload plan staged and backup checkpoint confirmed.",
    time: "13s ago",
  },
  {
    title: "Maintenance batch prepared",
    sub: "Automation grouped low-risk upgrades by recovery posture.",
    time: "4m ago",
  },
  {
    title: "Ingress route refreshed",
    sub: "Edge policy reconciled with active projects and certificate state.",
    time: "17m ago",
  },
  {
    title: "Burst workers returned to standby",
    sub: "Short-lived execution pool scaled back after queue completion.",
    time: "43m ago",
  },
];

const workloads = [
  { name: "Project Atlas", value: 78 },
  { name: "Project Harbor", value: 62 },
  { name: "Project Relay", value: 54 },
  { name: "Internal Ops", value: 85 },
];

const inventory = [
  { name: "PVE-A", type: "PVE-1", storage: "3.8 TB", stats: "0 running alerts", className: "health-good" },
  { name: "PVE-B", type: "PVE-2", storage: "2.6 TB", stats: "0 running alerts", className: "health-good" },
  { name: "Object-Store", type: "Storage", storage: "2.1 TB", stats: "Healthy replication plan", className: "health-good" },
  { name: "Backup-Core", type: "PBS", storage: "4.7 TB", stats: "Restore tests green", className: "health-good" },
];

const automationLog = [
  { time: "10:22:27 AM", message: "Monitoring operations pipeline healthy.", sub: "100% active" },
  { time: "10:33:23 AM", message: "Maintenance planner idle, no drift detected.", sub: "queue stable" },
  { time: "10:44:09 AM", message: "Backup verification signals accepted.", sub: "restore path ready" },
  { time: "10:58:51 AM", message: "Topology sync refreshed for compute inventory.", sub: "live summary updated" },
];

const statsEl = document.getElementById("summary-stats");
const topologyEl = document.getElementById("topology-columns");
const opsEl = document.getElementById("recent-ops");
const workloadEl = document.getElementById("workload-chart");
const inventoryEl = document.getElementById("inventory-table");
const logEl = document.getElementById("automation-log");

statsEl.innerHTML = stats
  .map(
    (stat) => `
    <article class="stat-card ${stat.color}">
      <div class="stat-label">${stat.label}</div>
      <div class="stat-value">${stat.value}</div>
      <div class="stat-meta">${stat.meta}</div>
    </article>
  `,
  )
  .join("");

topologyEl.innerHTML = topologyColumns
  .map(
    (column) => `
    <section class="topology-column ${column.color}">
      <div class="column-title"><span class="column-icon">${column.icon}</span><span>${column.title}</span></div>
      <div class="column-body">
        ${column.rows
          .map(
            (row) => `
            <div class="node-row">
              ${row
                .map(
                  (node, index) => `
                  ${index > 0 ? '<span class="node-connector">→</span>' : ""}
                  <article class="node-card ${row.length === 1 ? "wide" : "compact"}">
                    <div class="node-name">${node.name}</div>
                    <div class="node-role">${node.role}</div>
                    <div class="node-note">${node.note}</div>
                  </article>
                `,
                )
                .join("")}
            </div>
          `,
          )
          .join("")}
      </div>
    </section>
  `,
  )
  .join("");

opsEl.innerHTML = operations
  .map(
    (item) => `
    <article class="ops-item">
      <div class="item-top">
        <div class="item-title">${item.title}</div>
        <div class="item-time">${item.time}</div>
      </div>
      <div class="item-sub">${item.sub}</div>
    </article>
  `,
  )
  .join("");

workloadEl.innerHTML = workloads
  .map(
    (item) => `
    <div class="workload-row">
      <div class="workload-meta"><span>${item.name}</span><span>${item.value}</span></div>
      <div class="workload-track"><div class="workload-bar" style="width:${item.value}%"></div></div>
    </div>
  `,
  )
  .join("");

inventoryEl.innerHTML = inventory
  .map(
    (item) => `
    <tr>
      <td>${item.name}</td>
      <td>${item.type}</td>
      <td>${item.storage}</td>
      <td class="${item.className}">${item.stats}</td>
    </tr>
  `,
  )
  .join("");

logEl.innerHTML = automationLog
  .map(
    (item) => `
    <article class="log-item">
      <div class="log-top">
        <span class="log-dot"></span>
        <span class="log-time">${item.time}</span>
      </div>
      <div class="item-title">${item.message}</div>
      <div class="log-sub">${item.sub}</div>
    </article>
  `,
  )
  .join("");
