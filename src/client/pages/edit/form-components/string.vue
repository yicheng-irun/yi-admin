<template>
  <n-input
    v-model:value="editFormData[objectKey]"
    :placeholder="config?.placeholder || ''"
    :max-length="config?.maxLength"
    class="form-component-string"
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

<style lang="scss">
.form-component-string {
   max-width: 20em;
}
</style>
