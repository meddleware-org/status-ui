import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { meddlewareApp } from '@meddleware/frontend-config/vite'

// The status page has no wallet. Dark is the brand default (a saved choice wins). In dev, /api is proxied to a local platform-probe.
export default defineConfig(
  meddlewareApp({
    plugins: [vue()],
    wallet: false,
    config: { server: { proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true } } } },
  }),
)
