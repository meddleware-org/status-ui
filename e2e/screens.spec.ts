// Screenshots for LOOKING at the app (see @meddleware/frontend-config/shots). Run: npm run shots (the states are reached through a mocked
// `/api/status`, which a bare route visit cannot).
import { defineShots } from '@meddleware/frontend-config/shots'
import { DEGRADED, OPERATIONAL, open } from './open.js'

defineShots({
  operational: async (page) => void (await open(page, OPERATIONAL)),
  outage: async (page) => void (await open(page, DEGRADED)),
  error: async (page) => void (await open(page, 503)),
  loading: async (page) => void (await open(page, 'hang')),
})
