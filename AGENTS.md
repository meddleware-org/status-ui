# AGENTS.md — status-ui

## Purpose

A Vue 3 SPA that displays the live health status of the Meddleware platform. It polls
`/api/status` (served by `platform-probe`) every 15 s and renders a capability-grouped view.
The page is display-only — it never evaluates health itself.

## Package layout

```
src/
  main.ts                  App entry — imports design-token CSS, mounts Vue app
  App.vue                  Root layout: AppHeader (dark) + main + AppFooter; polling state machine
  config.ts                VITE_API_BASE env var (empty = same-origin)
  components/
    StatusBanner.vue       The overall status: a dot (UiStatusDot), the headline in a live region, the generated_at <time>
    StatusGroup.vue        A UiCard (h2) with a UiStatGrid of a group's components: name → dot + label
```

The polling (`useStatusSnapshot`), the dot, the labels (`STATUS_LABEL`, `STATUS_HEADLINE`), the snapshot types and the parser come from
`@meddleware/ui` / `@meddleware/web-utils`; this repo holds no copy of them.

## Environment variables

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE` | `""` | API origin prefix (empty = same-origin `/api/status`). Set at Docker build time. |

## Build and run

```bash
npm install
npm run dev          # Vite dev server at http://localhost:5173 (proxies /api → :8080)
npm run type-check   # vue-tsc type check only (no emit)
npm run build        # type-check + Vite production build → dist/
npm run lhci         # Lighthouse CI (accessibility 100); E2E_BROWSERS=all npm run test:e2e for five browsers
npm run check:csp    # after a build: fail on an inline <script> the Dockerfile CSP does not allow
bash scripts/smoke.sh <image>   # probe a built image (CONTAINER_ENGINE=podman for rootless podman)
```

```bash
# Build Docker image:
docker build -t quay.io/meddleware-org/status-ui:v0.1.0 .

# With a non-default API base (dev/staging only):
docker build --build-arg VITE_API_BASE=https://probe.example.com \
  -t status-ui:dev .
```

## Invariants (see CLAUDE.md)

- Display-only: no health evaluation, no caching of snapshots, no client-side probes.
- `VITE_API_BASE` defaults empty (same-origin in prod via nginx `/api/` → platform-probe route).
- All colours via design-token CSS vars — no hardcoded hex values.
- No secrets, no server-side rendering, no auth.
