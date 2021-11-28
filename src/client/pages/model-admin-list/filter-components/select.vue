<template>
  <a-select
    v-model="filterFormData[objectKey]"
    :placeholder="config.placeholder == null ? '请选择' : config.placeholder"
    :clearable="config.required ? false : true"
    :allow-clear="true"
    :mode="config.multiSelect ? 'multiple' : undefined"
    class="filter-component-select"
    @change="$emit('reloadData')"
  >
    <a-select-option
      v-for="item in options"
      :key="item.value"
      :value="item.value"
    >
      {{ item.label }}
    </a-select-option>
  </a-select>
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
