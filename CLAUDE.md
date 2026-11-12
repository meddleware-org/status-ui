# CLAUDE.md — status-ui

## Identity

A display-only Vue 3 SPA. All health truth lives in
[`platform-probe`](https://github.com/meddleware-org/platform-probe) — this page just renders
the snapshot it receives.

## Architectural invariants

1. **No health evaluation in the frontend.** Never derive, infer, or override status values.
   Render exactly what `/api/status` returns. The snapshot fields are `operational`, `degraded`,
   `down`, and `unknown` — map them to colour/label, nothing more.

2. **No caching of `/api/status` in the frontend.** The page polls on a timer via `useStatusSnapshot`
   (`@meddleware/ui`: every 15 s while the tab is visible); there is no service worker and no persistence, so a reload
   always starts from the prober. The one thing held is the last snapshot in memory: when a poll fails the page keeps
   showing it, with its own "Updated" time and a warning that the latest check failed (rather than a blank error page),
   and a response that is not a valid snapshot is an error, never "operational".

3. **`VITE_API_BASE` defaults to empty string (same-origin).** In production, nginx routes
   `/api/` to platform-probe on the same hostname — no CORS, no cross-origin complexity. Only
   set `VITE_API_BASE` at build time when the probe is genuinely on a different origin (e.g.
   a dev or staging environment without a local proxy).

4. **All styling via design-token CSS vars.** No hardcoded colour values. Use semantic tokens
   (`--bg`, `--surface`, `--text`, `--muted`, etc.) for theme-aware styles and `--mw-ok-500`,
   `--mw-gold-500`, `--mw-danger-500` for status colours. Never import raw hex values.

5. **No backend, no API routes, no secrets.** This is a static SPA. The only network call it
   makes is `GET /api/status`. It has no server-side rendering, no auth, and no secrets.

## Package layout

```text
src/
  main.ts                  App entry: imports the design-token CSS, starts the season, mounts the app
  App.vue                  Root layout: AppToolShell (dark header with the company mark and "Meddleware", the footer with its note), the page heading and the polling state
  config.ts                VITE_API_BASE (empty = same-origin)
  components/
    StatusBanner.vue       The overall status: a dot (UiStatusDot), the headline in a live region, the generated_at <time>
    StatusGroup.vue        A UiCard (h2) with a description list of a group's components: name → dot + label
```

The polling (`useStatusSnapshot`), the dot, the labels (`STATUS_LABEL`, `STATUS_HEADLINE`), the snapshot types and the parser
(`parseSnapshot`) come from `@meddleware/ui` / `@meddleware/web-utils`; this repo holds no copy of them.

`App.vue` uses the shared `AppToolShell` (`@meddleware/ui` >= 0.1.43), with `title="Meddleware"` (the brand text, after the shell's
default `BrandMark`), `:docs-url="false" :dev-url="false"` (the status page has no tool pages on the docs or developer sites) and
`:page-heading="false"` (the page has its own visible `h1`, "Service Status"). `contained` keeps its default (true), the same width as
before. The page's explanatory note ("The platform checks its own services regularly …") goes in the shell's `footer-note` slot, which
renders after the copyright line. Do not rebuild a hand-written shell around `UiAppShell`.

## Build and run

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_API_BASE` | `""` | API origin prefix (empty = same-origin `/api/status`). Set at Docker build time, dev and staging only. |

```bash
npm ci
npm run dev          # Vite dev server at http://localhost:5173 (proxies /api → :8080, a local platform-probe)
npm run type-check   # vue-tsc, no emit
npm run build        # type-check + Vite production build → dist/
npm run check:csp    # after a build: fail on an inline <script> the Dockerfile CSP does not allow (mw-check-csp-inline)
npm run lhci         # Lighthouse CI (accessibility 100); E2E_BROWSERS=all npm run test:e2e for five browsers
npx mw-sync --check  # the shared files (dependabot, .dockerignore, lint configs, allowlist, Dockerfile CSP) equal frontend-config's templates
bash scripts/smoke.sh <image>   # probe a built image (CONTAINER_ENGINE=podman for rootless podman)
```

The shared tooling (`mw-audit-gate`, `mw-third-party-licenses`, `mw-check-csp-inline`, `mw-sync`, the Vite, Vitest and TypeScript
bases) comes from `@meddleware/frontend-config`; `package.json` `"meddleware"` declares the CSP profile (`static-strict`).
`scripts/smoke.sh` is the app's own container probe.

`meddlewareApp({ name: 'Service Status' })` also emits the brand icon set (favicon, apple-touch-icon, 192/512 icons,
`site.webmanifest`) and injects the links, so the app keeps no `public/favicon.*` and no icon `<link>` (`mw-sync --check` fails on
the former). `tests/dist.test.ts` runs after a build (CI sets `REQUIRE_DIST=1`; a plain `npm test` before any build skips it): the
icon set once per page, no font file or font host, no third-party load, and no origin named beyond this site, namespaces and
library strings. No third-party fonts, scripts, styles, images or analytics, ever; the only call is `GET /api/status`.

## Wording

The page is read by visitors: no build variable, script or repository name, no internal jargon without a one-line explanation, and
no technical cause of a failed poll on screen (it goes to the console). The group and component names come from the platform's
checks configuration, so the page and its tests make no claim about which exist. The company is spelled "Meddleware".

## Adding a component

1. Create `src/components/MyComponent.vue` using design-token vars for all colours/spacing.
2. Props must use the types defined in `src/types.ts` — do not widen the `StatusLevel` union
   or add fields not present in the `/api/status` JSON.
3. Export nothing from the component beyond the Vue default — this is a private application,
   not a library.

## What not to do

- Do not add client-side health checks, fetch calls to internal services, or ping-style probes.
- Do not persist the snapshot (localStorage, IndexedDB, service worker cache).
- Do not expose `VITE_API_BASE` or any runtime config in the rendered HTML.
- Do not add npm dependencies beyond the existing stack without a clear reason.
