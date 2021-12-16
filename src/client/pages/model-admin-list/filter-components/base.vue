<template>
  <div
    class="filter-components-base"
    v-text="value"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  value: {
    type: String,
    default: '',
  },
  config: {
    type: Object as PropType<Record<string, string>>,
    default() {
      return {};
    },
  },
});
</script>

<style scoped lang="scss">
.filter-components-base {
  color: #606266
}
</style>
