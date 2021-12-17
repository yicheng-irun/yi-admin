<template>
  <n-input
    v-model:value="filterFormData[objectKey]"
    :placeholder="config.placeholder || ``"
    :max-length="config.maxLength"
    class="filter-component-string"
    @keydown.enter="emit('reloadData')"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue';

const emit = defineEmits(['reloadData']);

defineProps({
  config: {
    type: Object,
    default() {
      return {};
    },
  },
  filterFormData: {
    type: Object as PropType<Record<string, string>>,
    default() {
      return {};
    },
  },
  objectKey: {
    type: [String, Number],
    default: '',
  },
});
</script>

<style lang="scss">
.filter-component-string {
  max-width: 20em
}
</style>
