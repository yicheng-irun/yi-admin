<template>
  <n-input-number
    v-model:value="editFormData[objectKey]"
    :placeholder="config?.placeholder || ''"
    :min="config?.min"
    :max="config?.max"
    :step="config?.step"
    class="form-component-number"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  config: Object as PropType<{
    placeholder?: string | null;
    min?: number;
    max?: number;
    step?: number;
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
