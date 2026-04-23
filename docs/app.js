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

const lanes = [
  {
    id: "lane-access",
    title: "Access & edge",
    subtitle: "How users enter and authenticate into the platform.",
  },
  {
    id: "lane-control",
    title: "Control plane",
    subtitle: "Where orchestration, health, and automation decisions are made.",
  },
  {
    id: "lane-compute",
    title: "Compute fabric",
    subtitle: "Where stable services, tenant workloads, and worker pools live.",
  },
  {
    id: "lane-data",
    title: "Data & resilience",
    subtitle: "Where backups, artifacts, and recovery posture are kept visible.",
  },
];

const flow = [
  "Users reach the edge",
  "Identity and policy are enforced",
  "Claw plans and coordinates",
  "Compute executes workloads",
  "Backup and storage protect the platform",
];

const nodes = [
  {
    id: "edge",
    lane: "lane-access",
    tier: "edge",
    name: "orch-edge-1",
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
  },
  {
    id: "identity",
    lane: "lane-access",
    tier: "identity",
    name: "identity-gateway",
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
  },
  {
    id: "claw-core",
    lane: "lane-control",
    tier: "automation",
    name: "claw-core",
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
    primary: true,
  },
  {
    id: "metrics",
    lane: "lane-control",
    tier: "observability",
    name: "metrics-core",
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
  },
  {
    id: "pve-a",
    lane: "lane-compute",
    tier: "compute",
    name: "orch-pve-a",
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
  },
  {
    id: "pve-b",
    lane: "lane-compute",
    tier: "compute",
    name: "orch-pve-b",
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
  },
  {
    id: "backup",
    lane: "lane-data",
    tier: "resilience",
    name: "orch-backup-1",
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
  },
  {
    id: "object-store",
    lane: "lane-data",
    tier: "storage",
    name: "object-store",
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
const topologyGrid = document.getElementById("topology-grid");
const topologyFlow = document.getElementById("topology-flow");
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

  topologyGrid.querySelectorAll(".node-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.id === node.id);
  });
}

function renderTopologyFlow() {
  topologyFlow.innerHTML = flow
    .map(
      (step, index) => `
      <div class="flow-step">
        <span class="flow-index">0${index + 1}</span>
        <span class="flow-text">${step}</span>
      </div>
    `,
    )
    .join("");
}

function renderTopologyGrid() {
  topologyGrid.innerHTML = lanes
    .map((lane) => {
      const laneNodes = nodes
        .filter((node) => node.lane === lane.id)
        .map(
          (node) => `
          <button class="node-button ${node.primary ? "node-primary" : ""}" data-id="${node.id}">
            <div class="node-card-header">
              <span class="node-tier">${node.tier}</span>
              <span class="node-state state-${node.status}">${node.status}</span>
            </div>
            <div class="node-name">${node.name}</div>
            <p class="node-summary">${node.summary}</p>
            <div class="node-chip-row">${node.chips.map((chip) => `<span class="node-chip">${chip}</span>`).join("")}</div>
          </button>
        `,
        )
        .join("");

      return `
        <section class="topology-lane">
          <header class="lane-header">
            <p class="eyebrow">${lane.title}</p>
            <p class="lane-summary">${lane.subtitle}</p>
          </header>
          <div class="lane-stack">
            ${laneNodes}
          </div>
        </section>
      `;
    })
    .join("");

  topologyGrid.querySelectorAll(".node-button").forEach((button) => {
    button.addEventListener("click", () => setActiveNode(button.dataset.id));
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
renderTopologyFlow();
renderTopologyGrid();
renderTimeline();
renderTenants();
setActiveNode("claw-core");
