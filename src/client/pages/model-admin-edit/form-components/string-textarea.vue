<template>
  <n-input
    v-model:value="editFormData[objectKey]"
    type="textarea"
    :placeholder="config?.placeholder || ''"
    :max-length="config?.maxLength"
    :autosize="{
      minRows: 3
    }"
    class="form-components-textarea"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  config: Object as PropType<{
    placeholder?: string | null;
    maxLength?: number;
  }>,
  editFormData: {
    type: Object as PropType<Record<string, unknown>>,
    default() {
      return {};
    },
  },
  name: String,
  fieldName: String,
  objectKey: {
    type: [String, Number] as PropType<string|number>,
    default: '',
  },
});

</script>

<style lang="scss" scoped>
.form-components-textarea {
  max-width: 50em;
  min-width: 36em;
}
</style>
