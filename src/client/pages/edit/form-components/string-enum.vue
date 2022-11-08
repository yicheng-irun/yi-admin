<template>
  <n-select
    v-model:value="editFormData[objectKey]"
    :placeholder="config?.placeholder == null ? '请选择' : config.placeholder"
    :clearable="true"
    :options="options"
    :consistent-menu-width="false"
    class="form-component-string-enum"
  >
  </n-select>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';

const props = defineProps({
  config: Object as PropType<{
    placeholder?: string | null;
    required?: boolean;
    enum?: {
      label: string;
      value: string;
    }[]
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

const options = computed(() => {
  return props.config?.enum || [];
});

</script>

<style lang="scss">
.form-component-string-enum.ant-select {
   max-width: 20em;
}
</style>
