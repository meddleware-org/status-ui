import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import { vueTestConfig } from '@meddleware/frontend-config/vitest'

// Component tests (tests/). The render-escaping tests prove API-sourced strings reach the DOM as text, never as markup. The
// real-browser gate lives in e2e/ and runs under Playwright (npm run test:e2e).
export default defineConfig(vueTestConfig({ plugins: [vue()] }))
