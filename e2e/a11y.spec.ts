// The shared accessibility sweep (WCAG 2.2 AA and AAA in every colour mode × season, reflow, text size, forced colours, reduced motion,
// keyboard) over each state of the page.
import { defineA11ySuite } from '@meddleware/frontend-config/a11y'
import { DEGRADED, OPERATIONAL, open } from './open.js'

defineA11ySuite(
  {
    operational: async (page) => void (await open(page, OPERATIONAL)),
    'outage and unknown': async (page) => void (await open(page, DEGRADED)),
    'status service failing': async (page) => void (await open(page, 503)),
    loading: async (page) => void (await open(page, 'hang')),
  },
  { aaa: 'gate' },
)
