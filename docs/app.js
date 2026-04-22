const metrics = [
  {
    label: "Compute envelope",
    value: "48",
    footer: "vCPU pooled across fictional Proxmox domains",
  },
  {
    label: "Protected workloads",
    value: "27",
    footer: "VMs, LXCs, and automation runners under backup policy",
  },
  {
    label: "Backup freshness",
    value: "99.2%",
    footer: "Nightly success rate with restore checkpoints",
  },
  {
    label: "Tenant projects",
    value: "6",
    footer: "Isolated self-service environments with quotas",
  },
];

const miniMetrics = [
  ["Nodes online", "8 / 8"],
  ["Ingress status", "Nominal"],
  ["Restore point age", "22 min"],
  ["Queued plans", "3 ready"],
];

const nodes = [
  {
    id: "edge",
    tier: "edge",
    name: "orch-edge-1",
    x: 50,
    y: 12,
    status: "healthy",
    summary: "TLS termination, DNS routing, and public ingress into the private cloud.",
    chips: ["Anycast DNS", "TLS", "WAF"],
    details: [
      "Routes traffic into the internal platform without exposing control-plane services directly.",
      "Handles wildcard certificates, app hostnames, and tenant-aware ingress policies.",
      "Feeds telemetry into the observability stack for request and health traces.",
    ],
    metrics: {
      availability: "100%",
      throughput: "1.4 Gbps",
      alerts: "0 critical",
      domains: "18 mapped",
    },
    connections: ["identity", "claw-core", "pve-a"],
  },
  {
    id: "identity",
    tier: "identity",
    name: "identity-gateway",
    x: 20,
    y: 32,
    status: "healthy",
    summary: "SSO, MFA, tenant accounts, and service-level access control.",
    chips: ["OIDC", "MFA", "RBAC"],
    details: [
      "Gives each user or project a real account instead of shared passwords.",
      "Maps people, tenants, and service accounts into deploy-scoped roles.",
      "Supports the future goal of safe self-service on personal infrastructure.",
    ],
    metrics: {
      users: "24",
      tenants: "6",
      policy: "RBAC enabled",
      auth: "OIDC + local",
    },
    connections: ["edge", "claw-core", "metrics"],
  },
  {
    id: "claw-core",
    tier: "automation",
    name: "claw-core",
    x: 50,
    y: 33,
    status: "healthy",
    summary: "The fictional operations brain, hosted inside a VPS and coordinating plans, health checks, and orchestration.",
    chips: ["Agent core", "Planning", "Scheduling"],
    details: [
      "Represents Claw as the automation heart of the platform, not just another dashboard widget.",
      "Builds maintenance plans, upgrade proposals, and burst-worker assignments before execution.",
      "Connects edge, identity, compute, backup, and observability into one control flow.",
    ],
    metrics: {
      runs: "124 today",
      queue: "3 pending",
      drift: "low",
      windows: "2 scheduled",
    },
    connections: ["edge", "identity", "pve-a", "pve-b", "backup", "metrics", "object-store"],
    primary: true,
  },
  {
    id: "metrics",
    tier: "observability",
    name: "metrics-core",
    x: 80,
    y: 32,
    status: "warning",
    summary: "Metrics, logs, traces, and alerts for the entire fictional private cloud.",
    chips: ["Grafana", "Prometheus", "Loki"],
    details: [
      "Collects node health, workload telemetry, backup results, and deployment traces.",
      "Provides the visibility needed before trusting self-service tenants with your infra.",
      "Surfaces warnings early so Claw can propose safe changes before operators react late.",
    ],
    metrics: {
      dashboards: "14",
      retention: "30 days",
      alerts: "2 warning",
      logging: "centralized",
    },
    connections: ["identity", "claw-core", "pve-b", "backup"],
  },
  {
    id: "pve-a",
    tier: "compute",
    name: "orch-pve-a",
    x: 32,
    y: 58,
    status: "healthy",
    summary: "Primary compute domain for stable infrastructure services and core LXCs.",
    chips: ["LXC heavy", "Core apps", "ZFS"],
    details: [
      "Hosts the long-running service layer, including dashboards, identity helpers, and internal APIs.",
      "Optimized for steady-state platform workloads rather than burst capacity.",
      "Backed by snapshot policy and recovery hooks into the backup domain.",
    ],
    metrics: {
      guests: "12",
      cpu: "41%",
      memory: "58%",
      storage: "3.8 TB ZFS",
    },
    connections: ["edge", "claw-core", "backup", "object-store"],
  },
  {
    id: "pve-b",
    tier: "compute",
    name: "orch-pve-b",
    x: 68,
    y: 58,
    status: "healthy",
    summary: "Secondary compute domain for tenant workloads, burst jobs, and future K3s nodes.",
    chips: ["Worker pool", "Tenant apps", "Burst"],
    details: [
      "Designed to absorb self-service projects while keeping core services isolated elsewhere.",
      "Hosts worker VMs, future Kubernetes nodes, and short-lived deploy tasks.",
      "Lets the platform grow toward a tenant-ready home cloud without losing control.",
    ],
    metrics: {
      guests: "15",
      cpu: "36%",
      memory: "52%",
      queue: "moderate",
    },
    connections: ["claw-core", "metrics", "backup", "object-store"],
  },
  {
    id: "backup",
    tier: "resilience",
    name: "orch-backup-1",
    x: 22,
    y: 82,
    status: "healthy",
    summary: "Backup retention, restore validation, and immutable checkpoint strategy.",
    chips: ["PBS", "Restore tests", "Retention"],
    details: [
      "Acts as the safety layer that keeps the whole platform credible.",
      "Tracks backup freshness, retention windows, and routine restore validation.",
      "Feeds result signals back into the dashboard so reliability is visible, not assumed.",
    ],
    metrics: {
      backupJobs: "27",
      retention: "30 / 90 days",
      restore: "weekly",
      offsite: "enabled",
    },
    connections: ["claw-core", "pve-a", "pve-b", "metrics"],
  },
  {
    id: "object-store",
    tier: "storage",
    name: "object-store",
    x: 78,
    y: 82,
    status: "healthy",
    summary: "S3-style object storage for artifacts, logs, snapshots, and tenant assets.",
    chips: ["S3 API", "Artifacts", "Versioning"],
    details: [
      "Turns the private cloud into a platform, not just a box full of VMs.",
      "Supports application artifacts, backup exports, deployment bundles, and future tenant storage.",
      "Pairs naturally with self-service workflows and automation-led maintenance plans.",
    ],
    metrics: {
      buckets: "18",
      versioning: "on",
      used: "2.1 TB",
      replication: "planned",
    },
    connections: ["claw-core", "pve-a", "pve-b"],
  },
];

const activity = [
  {
    time: "2 minutes ago",
    title: "Claw prepared a maintenance batch",
    description: "A dry-run upgrade wave was grouped by tenant impact and backup freshness.",
  },
  {
    time: "14 minutes ago",
    title: "Backup validation completed",
    description: "Restore checkpoints for the core service tier passed consistency checks.",
  },
  {
    time: "31 minutes ago",
    title: "Ingress policy updated",
    description: "Tenant app routes were rebalanced across the fictional edge and compute layers.",
  },
  {
    time: "1 hour ago",
    title: "Burst-worker pool scaled down",
    description: "Idle automation capacity returned to standby after queued orchestration jobs cleared.",
  },
];

const tenants = [
  {
    name: "Project Atlas",
    summary: "Internal apps and control-plane services with higher trust and stricter backup policy.",
    badges: ["2 vCPU reserved", "OIDC protected", "Daily backups"],
  },
  {
    name: "Project Harbor",
    summary: "A tenant-ready app space for isolated containers, per-project routes, and usage caps.",
    badges: ["Self-service deploys", "Quota capped", "Rolling logs"],
  },
  {
    name: "Project Relay",
    summary: "Automation and integration workloads that need API access without touching core nodes directly.",
    badges: ["Service accounts", "Scoped secrets", "Audit trail"],
  },
];

const statsGrid = document.getElementById("services");
const miniMetricsEl = document.getElementById("mini-metrics");
const topologyCanvas = document.getElementById("topology-canvas");
const connectionLayer = document.querySelector(".connection-layer");
const detailTitle = document.getElementById("detail-title");
const detailSummary = document.getElementById("detail-summary");
const detailList = document.getElementById("detail-list");
const detailMetrics = document.getElementById("detail-metrics");
const timeline = document.getElementById("timeline");
const tenantGrid = document.getElementById("tenant-grid");

function renderStats() {
  metrics.forEach((metric) => {
    const card = document.createElement("article");
    card.className = "panel metric-card";
    card.innerHTML = `
      <p class="metric-label">${metric.label}</p>
      <div class="metric-value">${metric.value}</div>
      <p class="metric-footer">${metric.footer}</p>
    `;
    statsGrid.appendChild(card);
  });

  miniMetricsEl.innerHTML = miniMetrics
    .map(
      ([label, value]) => `
      <div class="detail-metric">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `,
    )
    .join("");
}

function metricMarkup(metricObj) {
  return Object.entries(metricObj)
    .map(
      ([label, value]) => `
      <div class="detail-metric">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `,
    )
    .join("");
}

function setActiveNode(id) {
  const node = nodes.find((entry) => entry.id === id) ?? nodes[2];
  detailTitle.textContent = node.name;
  detailSummary.textContent = node.summary;
  detailList.innerHTML = node.details.map((item) => `<li>${item}</li>`).join("");
  detailMetrics.innerHTML = metricMarkup(node.metrics);

  topologyCanvas.querySelectorAll(".node-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.id === node.id);
  });
}

function renderNodes() {
  nodes.forEach((node) => {
    const button = document.createElement("button");
    button.className = "node-button";
    button.dataset.id = node.id;
    button.style.left = `${node.x}%`;
    button.style.top = `${node.y}%`;
    button.innerHTML = `
      <span class="node-tier">${node.tier}</span>
      <div class="node-name">${node.name}</div>
      <p class="node-summary">${node.summary}</p>
      <div class="node-chip-row">${node.chips.map((chip) => `<span class="node-chip">${chip}</span>`).join("")}</div>
    `;
    button.addEventListener("click", () => setActiveNode(node.id));
    topologyCanvas.appendChild(button);
  });
}

function drawConnections() {
  connectionLayer.innerHTML = "";
  const seen = new Set();

  nodes.forEach((node) => {
    node.connections.forEach((targetId) => {
      const key = [node.id, targetId].sort().join("::");
      if (seen.has(key)) return;
      seen.add(key);

      const target = nodes.find((entry) => entry.id === targetId);
      if (!target) return;

      const midY = (node.y + target.y) / 2;
      const d = `M ${node.x * 10} ${node.y * 6.2} C ${node.x * 10} ${midY * 6.2}, ${target.x * 10} ${midY * 6.2}, ${target.x * 10} ${target.y * 6.2}`;
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      if (node.primary || target.primary) path.setAttribute("class", "primary");
      connectionLayer.appendChild(path);
    });
  });
}

function renderTimeline() {
  timeline.innerHTML = activity
    .map(
      (item) => `
      <article class="timeline-item">
        <div class="timeline-marker"></div>
        <div>
          <div class="timeline-meta">${item.time}</div>
          <div class="timeline-title">${item.title}</div>
          <div class="timeline-desc">${item.description}</div>
        </div>
      </article>
    `,
    )
    .join("");
}

function renderTenants() {
  tenantGrid.innerHTML = tenants
    .map(
      (tenant) => `
      <article class="tenant-card">
        <div class="tenant-top">
          <h4>${tenant.name}</h4>
          <span class="pill">ready</span>
        </div>
        <p>${tenant.summary}</p>
        <div class="tenant-badges">${tenant.badges.map((badge) => `<span class="tenant-badge">${badge}</span>`).join("")}</div>
      </article>
    `,
    )
    .join("");
}

renderStats();
renderNodes();
drawConnections();
renderTimeline();
renderTenants();
setActiveNode("claw-core");
window.addEventListener("resize", drawConnections);
