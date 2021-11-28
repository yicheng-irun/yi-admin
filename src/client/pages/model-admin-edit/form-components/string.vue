<template>
  <a-input
    v-model="editFormData[objectKey]"
    :placeholder="config.placeholder || ''"
    :max-length="config.maxLength"
    class="form-component-string"
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
    editFormData: {
      type: Object as PropType<Record<string, unknown>>,
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
.form-component-string {
   max-width: 20em;
}
</style>
