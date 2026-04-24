/* Infr-Orchestrator — Dashboard Renderer */

/* ── API or Static Data ── */
async function loadDashboardData() {
  // Try fetching from the collector API first
  try {
    const res = await fetch("/api/dashboard");
    if (res.ok) {
      const api = await res.json();
      // Transform API response to match the static data shape
      return {
        stats: [
          { label: "Nodes Online", value: `${api.stats.nodes_online} / ${api.stats.nodes_total}`, sub: `${Math.round((api.stats.nodes_online / api.stats.nodes_total) * 100)}%`, color: "blue", icon: "./assets/icons/server.svg", width: Math.round((api.stats.nodes_online / api.stats.nodes_total) * 100) },
          { label: "VMs Running", value: String(api.stats.vms_running), sub: api.stats.vms_stopped > 0 ? `${api.stats.vms_stopped} stopped` : "All running", color: "green", icon: "./assets/icons/monitor.svg", width: api.stats.vms_running > 0 ? Math.round((api.stats.vms_running / (api.stats.vms_running + api.stats.vms_stopped)) * 100) : 0 },
          { label: "Containers", value: String(api.stats.containers_total), sub: api.stats.containers_running === api.stats.containers_total ? "All healthy" : `${api.stats.containers_running} running`, color: "cyan", icon: "./assets/icons/container.svg", width: api.stats.containers_total > 0 ? Math.round((api.stats.containers_running / api.stats.containers_total) * 100) : 0 },
          { label: "Backup Health", value: `${api.stats.backup_health}%`, sub: api.stats.backup_warning > 0 ? `${api.stats.backup_warning} warning` : "All good", color: "amber", icon: "./assets/icons/shield.svg", width: api.stats.backup_health },
          { label: "Network Latency", value: `${api.stats.avg_latency_ms}ms`, sub: "avg across mesh", color: "blue", icon: "./assets/icons/network.svg", width: api.stats.avg_latency_ms < 50 ? 95 : 50 },
          { label: "Active Alerts", value: String(api.stats.alerts), sub: api.stats.critical_alerts > 0 ? `${api.stats.critical_alerts} critical` : "None critical", color: "red", icon: "./assets/icons/bell.svg", width: Math.min(api.stats.alerts * 5, 100) },
        ],
        automationCore: { status: "Running", metrics: [["Status", "Running"], ["Host", "infr-collector"], ["Uptime", "—"], ["Workers", "—"], ["Queue", "—"], ["Last Poll", api.last_poll || "—"]] },
        topologyRows: (api.topology || []).map(r => ({ ...r, icon: `./assets/icons/${r.icon}.svg` })),
        healthItems: api.health || [],
        operations: (api.operations || []).map(o => ({ title: o.title, time: o.time, result: o.result })),
        tenants: (api.tenants || []).map(t => ({ name: t.name, desc: t.desc || t.description, vms: t.vms || 0, containers: t.containers || 0 })),
        backupPosture: api.backup || { percent: 0, breakdown: [], lastBackup: "—" },
        inventory: buildInventory(api.inventory || {}),
        automationStatus: api.automation || { rows: [], successRate: 0 },
      };
    }
  } catch (e) {
    // API not available — fall back to static data
  }
  return window.dashboardData || {};
}

function buildInventory(inv) {
  return [
    { label: "Proxmox Nodes", value: `${inv.pve_nodes_online || 0} / ${inv.pve_nodes_total || 0}`, status: "online" },
    { label: "Virtual Machines", value: String(inv.vms_total || 0), detail: `${inv.vms_running || 0} running`, status: "online" },
    { label: "LXC Containers", value: String(inv.cts_total || 0), detail: `${inv.cts_running || 0} running`, status: "online" },
    { label: "Total vCPUs", value: String(inv.total_vcpus || 0), status: "allocated" },
    { label: "Total Memory", value: `${inv.total_mem_gb || 0} GB`, detail: `${inv.used_mem_gb || 0} GB used`, status: inv.used_mem_gb > inv.total_mem_gb * 0.8 ? "warning" : "online" },
    { label: "Total Storage", value: `${inv.total_disk_gb || 0} GB`, detail: inv.total_disk_gb > 0 ? `${Math.round((inv.used_disk_gb / inv.total_disk_gb) * 100)}% used` : "—", status: "online" },
  ];
}

/* ── Init ── */
let D = {};

async function init() {
  D = await loadDashboardData();
  renderDashboard();
}

function renderDashboard() {

/* ── Helpers ── */
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");

function iconImg(src, alt, cls) {
  return `<img src="${esc(src)}" alt="${esc(alt || "")}" class="${cls || ""}" />`;
}

/* ── KPI Strip ── */
$("kpi-strip").innerHTML = (D.stats || [])
  .map(
    (s) => `
  <article class="kpi-card ${s.color}">
    <div class="kpi-head">
      <span class="kpi-label">${esc(s.label)}</span>
      <span class="kpi-icon">${iconImg(s.icon, s.label)}</span>
    </div>
    <div class="kpi-value">${esc(s.value)}</div>
    <div class="kpi-sub">${esc(s.sub)}</div>
    <div class="progress-bar"><div class="progress-fill fill-${s.color}" style="width:${s.width}%"></div></div>
  </article>`
  )
  .join("");

/* ── Automation Core ── */
const ac = D.automationCore || {};
$("auto-status").textContent = ac.status || "Unknown";
$("auto-metrics").innerHTML = (ac.metrics || [])
  .map(
    ([label, value]) => `
  <div class="metric-row">
    <span>${esc(label)}</span>
    <strong>${esc(value)}</strong>
  </div>`
  )
  .join("");

/* ── Topology ── */
function osIcon(os) {
  const map = {
    proxmox: "proxmox", debian: "debian", ubuntu: "ubuntu", docker: "docker",
    nginx: "nginx", cloudflare: "cloudflare", wireguard: "wireguard",
    linuxmint: "linuxmint", python: "python", git: "git", linux: "linux",
  };
  const file = map[os] || "server";
  return `./assets/icons/${file}.svg`;
}

$("topo-rows").innerHTML = (D.topologyRows || [])
  .map(
    (row) => `
  <div class="topo-row">
    <div class="topo-label ${row.color}">
      <span class="topo-label-icon">${iconImg(row.icon, row.label)}</span>
      <span>${esc(row.label)}</span>
    </div>
    <div class="topo-track ${row.color}">
      ${row.nodes
        .map(
          (n, i) => `
        ${i > 0 ? '<span class="topo-arrow">→</span>' : ""}
        <div class="topo-node ${n.primary ? "primary" : ""}">
          <div class="topo-node-status ${n.status}"></div>
          <div class="topo-node-head">
            <span class="topo-node-os">${iconImg(osIcon(n.os), n.os)}</span>
            <span class="topo-node-name">${esc(n.name)}</span>
          </div>
          <div class="topo-node-role">${esc(n.role)}</div>
        </div>`
        )
        .join("")}
    </div>
  </div>`
  )
  .join("");

/* ── System Health ── */
const healthItems = D.healthItems || [];
const healthyCount = healthItems.filter((h) => h.status === "healthy").length;
const healthPercent = healthItems.length ? Math.round((healthyCount / healthItems.length) * 100) : 0;
const healthGap = 360 - Math.round((healthPercent / 100) * 360);
const healthGreen = 360 - healthGap;

$("health-ring").style.background = `conic-gradient(var(--green) 0 ${healthGreen}deg, var(--amber) ${healthGreen}deg ${healthGreen + healthGap}deg)`;
$("health-ring").innerHTML = `
  <div class="health-ring-inner">
    <strong>${healthPercent}%</strong>
    <span>Healthy</span>
  </div>`;

$("health-list").innerHTML = healthItems
  .map(
    (h) => `
  <div class="health-row">
    <span><span class="health-dot ${h.status}"></span>${esc(h.label)}</span>
    <strong style="color: ${h.status === "healthy" ? "var(--green)" : h.status === "warning" ? "var(--amber)" : "var(--red)"}">${h.status.charAt(0).toUpperCase() + h.status.slice(1)}</strong>
  </div>`
  )
  .join("");

const legendColors = { Compute: "green", Storage: "amber", Networking: "green", Backup: "amber", Automation: "green", DNS: "cyan" };
$("health-legend").innerHTML = healthItems
  .map(
    (h) => `
  <div class="health-legend-item">
    <span class="health-dot ${h.status}"></span>
    <span>${esc(h.label)}</span>
  </div>`
  )
  .join("");

/* ── Operations Feed ── */
$("ops-list").innerHTML = (D.operations || [])
  .map(
    (op) => `
  <div class="ops-item">
    <div class="ops-left">
      <span class="ops-dot ${op.result}"></span>
      <span class="ops-title">${esc(op.title)}</span>
    </div>
    <span class="ops-time">${esc(op.time)}</span>
    <span class="ops-result ${op.result}">${op.result.charAt(0).toUpperCase() + op.result.slice(1)}</span>
  </div>`
  )
  .join("");

/* ── Tenants ── */
$("tenant-list").innerHTML = (D.tenants || [])
  .map(
    (t) => `
  <div class="tenant-item">
    <div class="tenant-head">
      <strong>${esc(t.name)}</strong>
      <span class="health-dot healthy"></span>
    </div>
    <div class="tenant-desc">${esc(t.desc)}</div>
    <div class="tenant-counts">
      <span>${t.vms} VMs</span>
      <span>${t.containers} Containers</span>
    </div>
  </div>`
  )
  .join("");

/* ── Backup Posture ── */
const bp = D.backupPosture || {};
const bpPercent = bp.percent || 0;
const bpGreen = Math.round((bpPercent / 100) * 360);
const bpGap = 360 - bpGreen;

$("backup-ring").style.background = `conic-gradient(var(--green) 0 ${bpGreen}deg, var(--amber) ${bpGreen}deg ${bpGreen + bpGap}deg)`;
$("backup-ring").innerHTML = `
  <div class="backup-ring-inner">
    <strong>${bpPercent}%</strong>
    <span>Protected</span>
  </div>`;

$("backup-list").innerHTML = (bp.breakdown || [])
  .map(
    (b) => `
  <div class="backup-row">
    <span>${esc(b.label)}</span>
    <strong>${b.value}</strong>
  </div>`
  )
  .join("");

$("backup-footer").textContent = bp.lastBackup ? `Last backup: ${bp.lastBackup}` : "";

/* ── Compute Inventory ── */
$("inv-list").innerHTML = (D.inventory || [])
  .map(
    (inv) => `
  <div class="inv-item">
    <div class="inv-row">
      <span>${esc(inv.label)}</span>
      <strong>${esc(inv.value)}</strong>
    </div>
    ${inv.detail ? `<div class="inv-detail ${inv.status}">${esc(inv.detail)}</div>` : `<div class="inv-detail ${inv.status}">${inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</div>`}
  </div>`
  )
  .join("");

/* ── Automation Status ── */
const as = D.automationStatus || {};
$("auto-list").innerHTML = (as.rows || [])
  .map(
    (r) => `
  <div class="auto-row">
    <span>${esc(r.label)}</span>
    <strong>${r.value}</strong>
  </div>`
  )
  .join("");

const sr = as.successRate || 0;
$("success-bar").querySelector(".success-bar-fill").style.width = sr + "%";
$("success-rate").textContent = sr + "%";

} // end renderDashboard

init();
