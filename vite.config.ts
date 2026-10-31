import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { themeInit, viteTarget } from '@meddleware/frontend-config/vite'

export default defineConfig({
  build: { target: viteTarget() },
  plugins: [vue(), themeInit({ default: 'dark' })],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
})
