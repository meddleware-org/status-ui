// Vitest configuration for the component tests in tests/: the fleet's shared Vue test preset (jsdom, the shared setup) plus the Vue plugin.
import vue from '@vitejs/plugin-vue'
// defineConfig types the options.
import { defineConfig } from 'vitest/config'
// The shared preset.
import { vueTestConfig } from '@meddleware/frontend-config/vitest'

// Component tests (tests/). The render-escaping tests prove API-sourced strings reach the DOM as text, never as markup. The
// real-browser gate lives in e2e/ and runs under Playwright (npm run test:e2e).
// The preset, with the Vue plugin this app's components need.
export default defineConfig(vueTestConfig({ plugins: [vue()] }))
