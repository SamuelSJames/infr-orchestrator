/* Infr-Orchestrator — Operations Console Renderer */

/* ── API or Static Data ── */
async function loadOperationsData() {
  try {
    const [logsRes, secRes, nodesRes, opsRes] = await Promise.all([
      fetch("/api/logs"),
      fetch("/api/security"),
      fetch("/api/nodes"),
      fetch("/api/operations"),
    ]);
    if (logsRes.ok && secRes.ok && nodesRes.ok) {
      const logs = await logsRes.json();
      const sec = await secRes.json();
      const nodes = await nodesRes.json();
      const ops = opsRes.ok ? await opsRes.json() : [];
      return {
        logs: logs,
        tasks: ops.map(o => ({ icon: "▶", task: o.title || "task", node: o.node || "", duration: "—", status: o.result || "success" })),
        automationJobs: [],
        recentLogins: (sec.logins || []).map(l => ({ user: l.user, ip: l.ip, node: l.node, time: l.time })),
        securityAlerts: (sec.alerts || []).map(a => ({ message: a.message, severity: a.severity, time: a.time })),
        nodeStatus: nodes,
      };
    }
  } catch (e) {
    // API not available
  }
  return window.operationsData || {};
}

let D = {};
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function init() {
  D = await loadOperationsData();
  renderOperations();
}

function renderOperations() {

/* ── Log Stream ── */
const logStream = $("log-stream");
const logs = D.logs || [];

// Populate node filter
const nodeFilter = $("filter-node");
const uniqueNodes = [...new Set(logs.map((l) => l.node))].sort();
uniqueNodes.forEach((n) => {
  const opt = document.createElement("option");
  opt.textContent = n;
  nodeFilter.appendChild(opt);
});

// Populate service filter
const serviceFilter = $("filter-service");
const uniqueServices = [...new Set(logs.map((l) => l.service))].sort();
uniqueServices.forEach((s) => {
  const opt = document.createElement("option");
  opt.textContent = s;
  serviceFilter.appendChild(opt);
});

function renderLogs() {
  logStream.innerHTML = logs
    .map(
      (l) => `
    <div class="log-entry">
      <span class="log-sev-dot ${l.severity}"></span>
      <span class="log-sev-label ${l.severity}">${esc(l.severity)}</span>
      <span class="log-time">${esc(l.time)}</span>
      <span class="log-node">${esc(l.node)}</span>
      <span class="log-msg"><span class="log-service">${esc(l.service)}</span> ${esc(l.message)}</span>
    </div>`
    )
    .join("");
}
renderLogs();

/* ── Task History ── */
$("task-list").innerHTML = (D.tasks || [])
  .map(
    (t) => `
  <div class="task-row ${t.status === "running" ? "running-row" : ""}">
    <span><span class="task-icon">${esc(t.icon)}</span> ${esc(t.task)}</span>
    <span class="task-node">${esc(t.node)}</span>
    <span class="task-duration">${esc(t.duration)}</span>
    <span class="task-status ${t.status}">${t.status.charAt(0).toUpperCase() + t.status.slice(1)}</span>
  </div>`
  )
  .join("");

/* ── Automation Jobs ── */
$("job-list").innerHTML = (D.automationJobs || [])
  .map(
    (j) => `
  <div class="job-row ${j.exitCode !== 0 ? "error-row" : ""}">
    <span class="job-name">${esc(j.name)}</span>
    <span class="job-schedule">${esc(j.schedule)}</span>
    <span class="job-time">${esc(j.lastRun)}</span>
    <span class="job-duration">${esc(j.duration)}</span>
    <span class="job-exit ${j.exitCode === 0 ? "ok" : "fail"}">${j.exitCode}</span>
    <button class="job-run-btn">Run Now</button>
  </div>
  ${j.error ? `<div class="job-error">▸ ${esc(j.error)}</div>` : ""}`
  )
  .join("");

/* ── Recent Logins ── */
$("login-list").innerHTML = (D.recentLogins || [])
  .map(
    (l) => `
  <div class="login-row">
    <span class="health-dot healthy"></span>
    <span class="login-user">${esc(l.user)}</span>
    <span class="login-ip">${esc(l.ip)}</span>
    <span class="login-node">${esc(l.node)}</span>
    <span class="login-time">${esc(l.time)}</span>
  </div>`
  )
  .join("");

/* ── Security Alerts ── */
$("alert-list").innerHTML = (D.securityAlerts || [])
  .map(
    (a) => `
  <div class="alert-row">
    <span class="health-dot ${a.severity === "critical" ? "critical" : "warning"}"></span>
    <span class="alert-msg">${esc(a.message)}</span>
    <span class="alert-time">${esc(a.time)}</span>
  </div>`
  )
  .join("");

/* ── Node Status Strip ── */
function barClass(pct) {
  if (pct >= 80) return "high";
  if (pct >= 50) return "mid";
  return "low";
}

$("node-strip").innerHTML = (D.nodeStatus || [])
  .map(
    (n) => `
  <div class="node-card ${n.status}">
    <div class="node-card-head">
      <span class="node-card-name">${esc(n.name)}</span>
      <span class="node-card-dot ${n.status}"></span>
    </div>
    <div class="node-card-uptime">Uptime: ${esc(n.uptime)}</div>
    <div class="node-bar-group">
      <div class="node-bar-row">
        <span class="node-bar-label">CPU</span>
        <div class="node-bar-track"><div class="node-bar-fill ${barClass(n.cpu)}" style="width:${n.cpu}%"></div></div>
        <span class="node-bar-pct">${n.cpu}%</span>
      </div>
      <div class="node-bar-row">
        <span class="node-bar-label">MEM</span>
        <div class="node-bar-track"><div class="node-bar-fill ${barClass(n.mem)}" style="width:${n.mem}%"></div></div>
        <span class="node-bar-pct">${n.mem}%</span>
      </div>
      <div class="node-bar-row">
        <span class="node-bar-label">DISK</span>
        <div class="node-bar-track"><div class="node-bar-fill ${barClass(n.disk)}" style="width:${n.disk}%"></div></div>
        <span class="node-bar-pct">${n.disk}%</span>
      </div>
    </div>
  </div>`
  )
  .join("");

} // end renderOperations

init();
