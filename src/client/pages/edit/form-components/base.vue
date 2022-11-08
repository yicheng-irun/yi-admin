<template>
  <div
    class="form-components-base"
    v-text="editFormData[objectKey]"
  />
</template>

<script setup lang="ts">
import { PropType } from 'vue';

defineProps({
  config: Object as PropType<{ }>,
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
.form-components-base {
   color: #606266;
}
</style>
