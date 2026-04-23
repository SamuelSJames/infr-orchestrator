# Infr-Orchestrator Development Guide

## Current structure

- `docs/index.html` holds layout and section wiring
- `docs/styles.css` holds the visual system and responsive behavior
- `docs/data.js` holds the dashboard content and sample data
- `docs/app.js` renders the dashboard from `window.dashboardData`
- `docs/assets/` holds icons, branding, and stat artwork

## Development principles

- keep the default project static-first
- separate data from rendering
- prefer readable structure over clever abstractions
- keep future integrations optional, not mandatory
- do not couple the UI to one specific homelab layout

## Local workflow

```bash
python3 -m http.server 8080
```

Then open:

- `http://127.0.0.1:8080/`

## Safe extension points

### Replace sample data

Edit `docs/data.js`.

This is the easiest way to fork the project for a real environment.

### Add generated data

Recommended pattern:

- create a script outside `docs/`
- generate `docs/data.js` or `docs/data.generated.js`
- keep the output shape compatible with `window.dashboardData`

### Add live API mode

Recommended pattern:

- keep the existing static renderer
- fetch JSON from a backend only after page load
- normalize API output into the same shape used by `window.dashboardData`
- fail gracefully back to static sample data

## Data contract

The renderer expects these keys:

- `stats`
- `coreMetrics`
- `topologyRows`
- `healthItems`
- `operations`
- `tenants`
- `backupBreakdown`
- `inventory`
- `statusSummary`

If you add a new panel, update both:

- `docs/index.html`
- `docs/app.js`

## UI guidelines

- optimize for operator readability first
- avoid tiny labels and cramped cards on mobile
- keep topology grouped by platform layer
- show health, backups, and automation status near the top
- prefer a few strong signals over many weak signals

## Suggested next engineering steps

1. move sample data to JSON generation
2. add a lightweight schema check for generated data
3. add optional live fetch mode
4. add theme tokens for alternate branding
5. add integration adapters for Proxmox, PBS, Grafana, and Uptime Kuma
