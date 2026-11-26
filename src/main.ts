// Entry point of the status page: load the design tokens and the shared reset first, so every component style can use them, then mount the app.
import '@meddleware/design-tokens/tokens.css'
import '@meddleware/design-tokens/seasons.css'
import '@meddleware/ui/reset.css'
// Vue and the shared seasonal theme.
import { createApp } from 'vue'
import { useSeason } from '@meddleware/ui'
// The root component.
import App from './App.vue'

// Apply the current season's accent colours to the page (the shared composable reads the date).
useSeason()
// Mount into the element index.html provides.
createApp(App).mount('#app')
