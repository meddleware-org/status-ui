<script setup lang="ts">
import { UiCard, UiStatGrid, UiStatRow, UiStatusDot, STATUS_LABEL, type StatusGroup } from '@meddleware/ui'

defineProps<{
  /** The status group to render, including its name, aggregate status, and components. */
  group: StatusGroup
}>()
</script>

<template>
  <UiCard class="group" :level="2" :title="group.name">
    <UiStatGrid>
      <UiStatRow v-for="component in group.components" :key="component.name" :label="component.name">
        <UiStatusDot :status="component.status" /> {{ STATUS_LABEL[component.status] }}
      </UiStatRow>
    </UiStatGrid>
  </UiCard>
</template>

<style scoped>
/* The page's children are block siblings, so the cards keep their own distance. */
.group {
  margin-block-start: var(--space-xs);
}
</style>
