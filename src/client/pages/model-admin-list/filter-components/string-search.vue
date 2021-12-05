<template>
  <n-input
    v-model="filterFormData[objectKey]"
    :placeholder="config.placeholder || ``"
    :max-length="config.maxLength"
    class="filter-component-string"
    @pressEnter="$emit('reloadData')"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
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
  },
  methods: {
  },
});
</script>

<style lang="scss">
.filter-component-string {
  max-width: 20em
}
</style>
