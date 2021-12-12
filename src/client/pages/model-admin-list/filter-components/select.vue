<template>
  <n-select
    v-model="filterFormData[objectKey]"
    :placeholder="config.placeholder == null ? '请选择' : config.placeholder"
    :clearable="true"
    :mode="config.multiSelect ? 'multiple' : undefined"
    class="filter-component-select"
    :options="options"
    :consistent-menu-width="false"
    @change="$emit('reloadData')"
  >
  </n-select>
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

  computed: {
    options() {
      return this.config.options || [];
    },
  },
  methods: {
  },
});
</script>

<style lang="scss">
.filter-component-select.ant-select {
   max-width: 20em;
   min-width: 6em;
}
</style>
