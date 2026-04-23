const {
  stats = [],
  coreMetrics = [],
  topologyRows = [],
  healthItems = [],
  operations = [],
  tenants = [],
  backupBreakdown = [],
  inventory = [],
  statusSummary = [],
} = window.dashboardData || {};

const statsGrid = document.getElementById("stats-grid");
const coreMetricsEl = document.getElementById("core-metrics");
const topologyRowsEl = document.getElementById("topology-rows");
const healthListEl = document.getElementById("health-list");
const opsListEl = document.getElementById("ops-list");
const tenantListEl = document.getElementById("tenant-list");
const backupBreakdownEl = document.getElementById("backup-breakdown");
const inventoryListEl = document.getElementById("inventory-list");
const statusSummaryEl = document.getElementById("status-summary");

statsGrid.innerHTML = stats
  .map(
    (stat) => `
    <article class="stat-card ${stat.color}">
      <div class="stat-head">
        <span class="stat-label">${stat.label}</span>
        <span class="stat-icon">${stat.iconPath ? `<img src="${stat.iconPath}" alt="${stat.iconAlt}" />` : stat.icon}</span>
      </div>
      <div class="stat-value">${stat.value}</div>
      <div class="stat-sub">${stat.sub}</div>
      <div class="progress-track"><div class="progress-fill fill-${stat.color}" style="width:${stat.width}%"></div></div>
    </article>
  `,
  )
  .join("");

coreMetricsEl.innerHTML = coreMetrics
  .map(
    ([label, value]) => `
    <article class="metric-item">
      <div class="metric-row">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    </article>
  `,
  )
  .join("");

topologyRowsEl.innerHTML = topologyRows
  .map(
    (row) => `
    <div class="topology-row">
      <div class="topology-label ${row.color}">
        <span class="topology-label-icon">${row.iconPath ? `<img src="${row.iconPath}" alt="${row.iconAlt}" />` : row.icon}</span>
        <span>${row.label}</span>
      </div>
      <div class="topology-track ${row.color}">
        ${row.nodes
          .map(
            (node, index) => `
            ${index > 0 ? '<span class="topology-arrow">→</span>' : ""}
            <article class="topology-node ${node.primary ? "primary" : ""}">
              <div class="topology-node-name">${node.name}</div>
              <div class="topology-node-role">${node.role}</div>
            </article>
          `,
          )
          .join("")}
      </div>
    </div>
  `,
  )
  .join("");

healthListEl.innerHTML = healthItems
  .map(
    ([label, value]) => `
    <article class="health-item">
      <div class="health-row">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    </article>
  `,
  )
  .join("");

opsListEl.innerHTML = operations
  .map(
    ([title, time, result]) => `
    <article class="ops-item">
      <div class="ops-row">
        <strong>${title}</strong>
        <span>${time}</span>
      </div>
      <div class="ops-meta">${result}</div>
    </article>
  `,
  )
  .join("");

tenantListEl.innerHTML = tenants
  .map(
    ([name, desc, vms, containers]) => `
    <article class="tenant-item">
      <div class="tenant-row">
        <strong>${name}</strong>
        <span class="success-pill">●</span>
      </div>
      <div class="tenant-meta">${desc}</div>
      <div class="tenant-row tenant-meta"><span>${vms}</span><span>${containers}</span></div>
    </article>
  `,
  )
  .join("");

backupBreakdownEl.innerHTML = backupBreakdown
  .map(
    ([label, value]) => `
    <article class="backup-item">
      <div class="backup-row">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    </article>
  `,
  )
  .join("");

inventoryListEl.innerHTML = inventory
  .map(
    ([label, value, state]) => `
    <article class="inventory-item">
      <div class="inventory-row">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
      <div class="tenant-meta ${state === "Online" || state === "Running" || state === "Allocated" ? "success-pill" : "warning-pill"}">${state}</div>
    </article>
  `,
  )
  .join("");

statusSummaryEl.innerHTML = statusSummary
  .map(
    ([label, value]) => `
    <article class="summary-item">
      <div class="summary-row">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    </article>
  `,
  )
  .join("");
