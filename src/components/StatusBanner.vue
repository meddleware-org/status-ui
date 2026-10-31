<script setup lang="ts">
import { UiStatusDot, STATUS_HEADLINE, type StatusLevel } from '@meddleware/ui'
import { formatDateTime } from '@meddleware/web-utils'

defineProps<{
  /** Aggregate system status — drives the headline and the dot. */
  overall: StatusLevel
  /** ISO 8601 timestamp when the snapshot was generated. */
  generatedAt: string
}>()
</script>

<template>
  <p class="banner">
    <!-- The live region is the headline alone: a change of state is announced, a new "Updated" time is not. -->
    <output class="headline" aria-label="Overall status"><UiStatusDot :status="overall" size="md" /> {{ STATUS_HEADLINE[overall] }}</output>
    <small class="updated">Updated <time :datetime="generatedAt">{{ formatDateTime(generatedAt, { empty: 'at an unknown time' }) }}</time></small>
  </p>
</template>

<style scoped>
.banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-2xs);
  padding: var(--space-xs) var(--space-sm);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

.headline {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
}

.updated {
  color: var(--muted);
}
</style>
