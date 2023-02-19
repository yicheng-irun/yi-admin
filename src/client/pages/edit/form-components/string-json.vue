<template>
  <div class="form-components-json">
    <JsonEditorVue v-model="data.jsonData" :placeholder="config?.placeholder || ''"></JsonEditorVue>
  </div>
</template>

<script setup lang="ts">
import { PropType, reactive, watch } from 'vue';
import JsonEditorVue from 'json-editor-vue3';

const props = defineProps({
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

function getJsonData(jsonStr?: string) {
  try {
    const d = JSON.parse(jsonStr || '{}');
    return d;
  } catch (e) {
    console.error('json解析出错');
  }
  return {};
}

const data = reactive({
  jsonData: getJsonData(props.editFormData[props.objectKey] as string | undefined),
});

let ignoreChange = false;
watch([() => {
  return data.jsonData;
}], () => {
  props.editFormData[props.objectKey] = JSON.stringify(data.jsonData);
  ignoreChange = true;
});
watch([() => {
  return props.editFormData[props.objectKey];
}], () => {
  if (!ignoreChange) {
    data.jsonData = getJsonData(props.editFormData[props.objectKey] as string | undefined);
  } else {
    ignoreChange = false;
  }
});

</script>

<style lang="scss" scoped>
.form-components-json {
  max-width: 50em;
  min-width: 36em;
}
</style>
