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
  await expect(page.getByRole('banner')).toContainText('Meddleware')
  // One list of components per group, and the time of the snapshot as a machine-readable <time>.
  await expect(page.getByRole('main').locator('dl')).toHaveCount(2)
  await expect(page.getByRole('main').locator('time')).toHaveAttribute('datetime', '2026-10-08T12:00:00Z')
  await expect(page.getByRole('contentinfo')).toContainText('refreshes itself about every 15 seconds')
  expect(errors).toEqual([])
})

test('says each state in words, and an outage as well as a colour', async ({ page }) => {
  await open(page, (await import('./open.js')).DEGRADED)
  await expect(page.getByLabel('Overall status')).toContainText('Partial outage')
  await expect(page.getByText('Down', { exact: true })).toBeVisible()
  await expect(page.getByText('Degraded', { exact: true })).toBeVisible()
  await expect(page.getByText('Unknown', { exact: true })).toBeVisible()
})

test('a failing status service is an error that says what happens next, never "operational"', async ({ page }) => {
  await open(page, 503)
  await expect(page.getByRole('alert')).toHaveText('Could not load the current status. This page will try again automatically.')
  await expect(page.getByRole('main')).not.toContainText('503')
  await expect(page.getByText('All systems operational')).toHaveCount(0)
})
