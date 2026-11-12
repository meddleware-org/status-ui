<script setup lang="ts">
import { watch } from 'vue'
import { AppToolShell, UiLiveStatus, UiNotice, useStatusSnapshot } from '@meddleware/ui'
import { API_BASE } from './config'
import StatusBanner from './components/StatusBanner.vue'
import StatusGroup from './components/StatusGroup.vue'

// The composable polls while the tab is visible (never faster than every 15 s) and keeps the last good snapshot across a failed poll.
const POLL_SECONDS = 15
const { snapshot, error, loading } = useStatusSnapshot({ url: `${API_BASE}/api/status`, intervalMs: POLL_SECONDS * 1000 })
// A visitor cannot act on the technical cause of a failed poll (an HTTP status, a malformed body): the page says what it will do, and the cause goes to the console.
watch(error, (cause) => {
  if (cause) console.warn(`status-ui: the status request failed (${cause})`)
})
</script>

<template>
  <!-- The page has its own visible h1 and no tool pages on the docs or developer sites, so the shell adds neither a hidden heading nor those links. -->
  <AppToolShell title="Meddleware" slug="status" :docs-url="false" :dev-url="false" :page-heading="false">
    <h1>Service Status</h1>
    <UiLiveStatus label="Status page" :message="loading ? 'Loading the current status…' : ''" />
    <UiNotice v-if="error && !snapshot" type="error" message="Could not load the current status. This page will try again automatically." />
    <!-- A failed poll keeps the last snapshot on screen, and says it may be out of date, instead of replacing the page. -->
    <UiNotice v-else-if="error" type="warning" message="The status could not be refreshed just now. What is shown is the last status received and may be out of date. This page will try again automatically." />
    <template v-if="snapshot">
      <StatusBanner :overall="snapshot.overall" :generated-at="snapshot.generated_at" />
      <StatusGroup v-for="group in snapshot.groups" :key="group.name" :group="group" />
    </template>

    <template #footer-note>
      <p class="note">The platform checks its own services regularly. This page shows the latest result and refreshes itself about every {{ POLL_SECONDS }} seconds. “Unknown” means no result is available yet for that service.</p>
    </template>
  </AppToolShell>
</template>

<style scoped>
.note {
  margin: 0;
  font-size: var(--font-size-sm);
}
</style>
