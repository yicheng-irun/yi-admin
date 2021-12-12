<template>
  <n-switch
    v-model:value="editFormData[objectKey]"
    class="form-component-boolean"
  >
  </n-switch>
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
