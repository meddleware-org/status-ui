// Vite configuration for the status page, built from the fleet's shared application preset (@meddleware/frontend-config/vite): Vue, the brand and
// // security defaults and the production build settings. This file only says what is particular to this app.
import { defineConfig } from 'vite'
// The Vue single-file-component plugin.
import vue from '@vitejs/plugin-vue'
// The shared preset.
import { meddlewareApp } from '@meddleware/frontend-config/vite'

// The status page has no wallet. Dark is the brand default (a saved choice wins). In dev, /api is proxied to a local platform-probe.
// The preset is wrapped by defineConfig so the editor can type-check the options.
export default defineConfig(
  meddlewareApp({
    // Vue is the only plugin the app adds.
    plugins: [vue()],
    // The page name used for the title and the web app manifest.
    name: 'Service Status',
    // No wallet adapter is bundled: the page reads public data only.
    wallet: false,
    // Development server only: /api goes to a local platform-probe, so the page can be run against real data.
    config: { server: { proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true } } } },
  }),
)
