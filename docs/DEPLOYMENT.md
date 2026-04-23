# Infr-Orchestrator Deployment Guide

This project is intentionally portable. It has no build step, no package manager dependency, and no required backend.

## Supported deployment patterns

- local static file server
- GitHub Pages
- Nginx
- Caddy
- Docker with Nginx

## 1. Local run

From the repo root:

```bash
git clone https://github.com/SamuelSJames/infr-orchestrator.git
cd infr-orchestrator
python3 -m http.server 8080
```

Open either of these:

- `http://127.0.0.1:8080/`
- `http://127.0.0.1:8080/docs/`

The repo root now redirects to `docs/` so local serving works cleanly for new users.

## 2. GitHub Pages

Recommended repo settings:

- Branch: `main`
- Folder: `/docs`

Once enabled, GitHub Pages serves `docs/index.html` as the site root.

## 3. Nginx

Example document root:

```text
/opt/infr-orchestrator/docs
```

Reference config:

- `deploy/nginx.conf.example`

## 4. Caddy

Example document root:

```text
/opt/infr-orchestrator/docs
```

Reference config:

- `deploy/Caddyfile.example`

## 5. Docker

Build and run:

```bash
docker build -t infr-orchestrator .
docker run --rm -p 8080:80 infr-orchestrator
```

Then open:

- `http://127.0.0.1:8080/`

## Portability notes

To keep this repo easy for anyone to deploy:

- keep assets relative, not absolute
- avoid framework build pipelines unless there is a clear payoff
- keep the dashboard usable with plain static hosting
- treat `docs/data.js` as the replaceable data layer
- keep `docs/app.js` focused on rendering only

## If you add a backend later

Do it without breaking static mode.

Good pattern:

1. keep `docs/data.js` as a generated fallback
2. optionally fetch live JSON from an API
3. fall back to static data when the API is unavailable

That keeps demos, forks, and self-hosting dead simple.
