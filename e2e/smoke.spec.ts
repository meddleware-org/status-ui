// Smoke test of the BUILT app: it mounts, shows its landmarks and raises no uncaught error.
import { expect, test } from '@playwright/test'
import { open } from './open.js'

test('mounts without an uncaught error', async ({ page }) => {
  const { errors } = await open(page)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Service Status')
  await expect(page.getByRole('banner')).toBeVisible()
  await expect(page.getByRole('main')).toBeVisible()
  await expect(page.getByRole('contentinfo')).toBeVisible()
  await expect(page.getByRole('heading', { level: 2 })).toHaveText(['Web apps', 'Chain access'])
  expect(errors).toEqual([])
})

test('says each state in words, and an outage as well as a colour', async ({ page }) => {
  await open(page, (await import('./open.js')).DEGRADED)
  await expect(page.getByLabel('Overall status')).toContainText('Partial outage')
  await expect(page.getByText('Down', { exact: true })).toBeVisible()
  await expect(page.getByText('Degraded', { exact: true })).toBeVisible()
  await expect(page.getByText('Unknown', { exact: true })).toBeVisible()
})

test('a failing probe is an error with a reason, never "operational"', async ({ page }) => {
  await open(page, 503)
  await expect(page.getByRole('alert')).toContainText('Could not load status')
  await expect(page.getByText('All systems operational')).toHaveCount(0)
})
