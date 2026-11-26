<script setup lang="ts">
// The overall status line: the aggregate status as a headline with its colour dot, and the time the snapshot was generated.
// Presentational only; it receives both values as props and keeps no state.
// The status dot, the headline wording for each level and the status type, from @meddleware/ui; the date formatter from @meddleware/web-utils.
import { UiStatusDot, STATUS_HEADLINE, type StatusLevel } from '@meddleware/ui'
import { formatDateTime } from '@meddleware/web-utils'

// The component's inputs.
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
    <!-- The snapshot time, machine-readable in `datetime`, with a words-only fallback for an unparsable value. -->
    <small class="updated">Updated <time :datetime="generatedAt">{{ formatDateTime(generatedAt, { empty: 'at an unknown time' }) }}</time></small>
  </p>
</template>

<style scoped>
/* The banner: headline on the left, time on the right, wrapping on a narrow screen. */
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

/* The headline is larger and bolder than the surrounding text. */
.headline {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
}

/* The time is secondary text. */
.updated {
  color: var(--muted);
}
</style>
