<template>
  <n-select
    v-model:value="filterFormData[objectKey]"
    :placeholder="config.placeholder == null ? '请选择' : config.placeholder"
    :clearable="true"
    :mode="config.multiSelect ? 'multiple' : undefined"
    class="filter-component-select"
    :options="options"
    :consistent-menu-width="false"
    @update:value="$emit('reloadData')"
  >
  </n-select>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';

const props = defineProps({
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

const options = computed(() => {
  return props.config.options || [];
});

</script>

<style lang="scss">
.filter-component-select.ant-select {
   max-width: 20em;
   min-width: 6em;
}
</style>
