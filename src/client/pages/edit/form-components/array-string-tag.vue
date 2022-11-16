<template>
  <n-select
    v-model:value="editFormData[objectKey]"
    :placeholder="config?.placeholder == null ? '搜索和选择' : config.placeholder"
    filterable
    :clearable="true"
    :loading="loading"
    :consistent-menu-width="false"
    :options="options"
    remote
    class="form-component-string-remote-select"
    multiple
    @search="remoteMethod"
  >
  </n-select>
</template>

<script setup lang="ts">
import { useMessage } from 'naive-ui';
import { PropType, computed, ref, onMounted } from 'vue';
import { axiosInstance } from '../../../plugins/axios.instance';

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

const remoteOptions = ref<string[]>([]);

const loading = ref(false);
let lastQuery = '';

const options = computed(() => {
  const opts: {
         label: string;
         value: string;
      }[] = [];
  for (let i = 0; i < remoteOptions.value.length; i += 1) {
    const e = remoteOptions.value[i];
    if (e) {
      opts.push({
        label: e,
        value: e,
      });
    }
  }
  return opts;
});

const $message = useMessage();


async function remoteMethod(query: string) {
  loading.value = true;
  lastQuery = query;
  try {
    const rsp1Promise = axiosInstance.post('/api/edit-component-action/', {
      fieldName: props.fieldName,
      actionName: 'getTags',
      actionData: query,
    });

    const rsp1 = await rsp1Promise;
    const result = rsp1.data;
    if (lastQuery === query) {
      if (result.success) {
        remoteOptions.value = [...result.data];
      } else {
        throw new Error(result.message || '搜索远程数据失败了');
      }
    }
  } catch (e) {
    if (e instanceof Error && lastQuery === query) {
      // 这里提示
      $message.error(e?.message || String(e) || '搜索失败了');
    }
  }
  loading.value = false;
}

onMounted(() => {
  remoteMethod('');
});

</script>

<style lang="scss">
.form-component-array-string-tag.ant-select {
   max-width: 20em;
}
</style>
