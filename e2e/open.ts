// Opens the built app with `/api/status` mocked (page.route), so a run needs no network: every request that leaves localhost is
// refused. Returns what the page reported.
import type { Page } from '@playwright/test'
import { offline } from '@meddleware/frontend-config/look'

const group = (name: string, components: [string, string][]) => ({
  name,
  status: components.some(([, s]) => s === 'down') ? 'down' : components.some(([, s]) => s === 'degraded') ? 'degraded' : 'operational',
  components: components.map(([n, status]) => ({ name: n, status })),
})

export const OPERATIONAL = {
  generated_at: '2026-10-08T12:00:00Z',
  overall: 'operational',
  groups: [group('Web apps', [['Dashboard', 'operational'], ['Walrus storage', 'operational']]), group('Chain access', [['Sui indexer', 'operational'], ['Seal key servers', 'operational']])],
}
export const DEGRADED = {
  generated_at: '2026-10-08T12:00:00Z',
  overall: 'degraded',
  groups: [group('Web apps', [['Dashboard', 'operational'], ['Walrus storage', 'degraded']]), group('Chain access', [['Sui indexer', 'down'], ['Seal key servers', 'unknown']])],
}

/** `body` is the snapshot, an HTTP status for a failing probe, or `'hang'` for a request that never answers (the loading state). */
export async function open(page: Page, body: unknown = OPERATIONAL) {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(e.message))
  await offline(page)
  await page.route('**/api/status', (route) => {
    if (body === 'hang') return new Promise(() => undefined)
    if (typeof body === 'number') return route.fulfill({ status: body, body: 'down' })
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) })
  })
  await page.goto('/')
  await page.getByRole('heading', { level: 1 }).waitFor()
  if (body !== 'hang') await page.getByRole('heading', { level: 2 }).first().or(page.getByRole('alert')).first().waitFor()
  return { errors }
}
