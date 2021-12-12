<template>
  <n-date-picker
    v-model:value="dateTime"
    type="datetime"
    clearable
    :placeholder="props.config?.placeholder || '请选择'"
  />
</template>

<script setup lang="ts">
import { watch, ref, PropType } from 'vue';

const props = defineProps({
  config: Object as PropType<{
    placeholder?: string | null;
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
const dateTime = ref<number | null>(props.editFormData[props.objectKey] ? new Date(props.editFormData[props.objectKey] + '').getTime() : null);

watch(dateTime, (value) => {
  props.editFormData[props.objectKey] = value ? new Date(value) : '';
});

watch([() => props.editFormData[props.objectKey]], ([value]) => {
  if (value) {
    const t = new Date(value + '');
    if (t.getTime() !== dateTime.value) {
      dateTime.value = t.getTime();
    }
  } else {
    dateTime.value = null;
  }
});

</script>

