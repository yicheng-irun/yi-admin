<template>
  <a-input
    v-model="editFormData[objectKey]"
    type="textarea"
    :placeholder="config.placeholder || ''"
    :max-length="config.maxLength"
    :auto-size="{ minRows: 2}"
    class="form-component-string-textarea"
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
.form-component-string-textarea.ant-input {
   max-width: 40em;
}
</style>
