// Lighthouse CI on the built app: accessibility 100, best practices ≥ 0.95, script and stylesheet budgets (free, results to
// test-results/lighthouse). (.cjs because Lighthouse CI loads its config with `require`; Node loads the ES module factory through it.)
// The shared Lighthouse CI configuration factory (loaded with `require`, hence this file is CommonJS).
const { lighthouseConfig } = require('@meddleware/frontend-config/lighthouserc')

// The same preview port as the Playwright configuration.
module.exports = lighthouseConfig({ port: 4284 })
