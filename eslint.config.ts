// ESLint flat configuration: the fleet's shared Vue application rule set from @meddleware/frontend-config (TypeScript, vuejs-accessibility, browser compatibility,
// // documentation comments). `npm run lint:js` reads it.
import { vueApp } from '@meddleware/frontend-config/eslint'

// The fleet's Vue + TypeScript + accessibility + browser-compat config.
// The app's name appears in a few rule messages.
export default vueApp({ name: 'status-ui' })
