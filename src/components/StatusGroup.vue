<script setup lang="ts">
// One group of services as a card: the group name as a level-2 heading and a definition list of its components, each with a status dot and a status word.
// Presentational only; the status is always said in words as well as drawn in colour.
// The card, the stat list, the status dot and the status wording, from @meddleware/ui.
import { UiCard, UiStatGrid, UiStatRow, UiStatusDot, STATUS_LABEL, type StatusGroup } from '@meddleware/ui'

// The component's input.
defineProps<{
  /** The status group to render, including its name, aggregate status, and components. */
  group: StatusGroup
}>()
</script>

<template>
  <!-- One card per group; the group name is its level-2 heading (the page's one h1 is above). -->
  <UiCard class="group" :level="2" :title="group.name">
    <!-- A definition list: the component name is the term and its status the definition. -->
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
