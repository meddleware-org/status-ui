// Playwright configuration, from the fleet's shared preset: browsers, reporters, the preview server and the test timeouts.
import { definePlaywrightConfig } from '@meddleware/frontend-config/playwright'

// Browser tests of the BUILT app (`vite preview` of dist): Chromium locally, all five browser projects in CI (E2E_BROWSERS=all to run
// them locally). Every request that leaves localhost is refused in the specs, so runs need no network. The screenshot capture
// (`npm run shots`) is for looking, not asserting.
// Port 4284 is this app's preview port (also used by the Lighthouse configuration), so apps can run side by side.
export default definePlaywrightConfig({ port: 4284 })
