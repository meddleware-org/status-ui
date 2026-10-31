<script setup lang="ts">
import { AppFooter, AppHeader, ColorModeControl, CopyrightLine, UiAppShell, UiLiveStatus, UiNotice, useColorMode, useStatusSnapshot } from '@meddleware/ui'
import { API_BASE } from './config'
import StatusBanner from './components/StatusBanner.vue'
import StatusGroup from './components/StatusGroup.vue'

// The probe checks every 15 s; the composable polls while the tab is visible and keeps the last good snapshot across a failed poll.
const { snapshot, error, loading } = useStatusSnapshot({ url: `${API_BASE}/api/status`, intervalMs: 15_000 })
const { mode, set } = useColorMode('dark')
</script>

<template>
  <UiAppShell contained>
    <template #header>
      <AppHeader variant="dark">
        <template #brand>meddleware</template>
        <template #actions>
          <ColorModeControl :model-value="mode" @update:model-value="set" />
        </template>
      </AppHeader>
    </template>

    <h1>Service Status</h1>
    <UiLiveStatus label="Status page" :message="loading ? 'Loading the current status…' : ''" />
    <UiNotice v-if="error && !snapshot" type="error" :message="`Could not load status: ${error}`" />
    <!-- A failed poll keeps the last snapshot on screen, and says it may be out of date, instead of replacing the page. -->
    <UiNotice v-else-if="error" type="warning" :message="`The latest check failed (${error}). This is the last status received, and it may be out of date.`" />
    <template v-if="snapshot">
      <StatusBanner :overall="snapshot.overall" :generated-at="snapshot.generated_at" />
      <StatusGroup v-for="group in snapshot.groups" :key="group.name" :group="group" />
    </template>

    <template #footer>
      <AppFooter>
        <p class="note">Checks run server-side every 15 s. Results are cached — this page never probes internal services directly.</p>
        <CopyrightLine symbol-variant="kopimi" organisation-name="Meddleware" rights-statement="jam" />
      </AppFooter>
    </template>
  </UiAppShell>
</template>

<style scoped>
.note {
  margin: 0;
  font-size: var(--font-size-sm);
}
</style>
