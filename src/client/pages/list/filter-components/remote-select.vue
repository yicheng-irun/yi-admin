<template>
  <n-select
    v-model:value="filterFormData[objectKey]"
    :placeholder="config.placeholder == null ? '搜索和选择' : config.placeholder"
    filterable
    :clearable="true"
    :loading="loading"
    :consistent-menu-width="false"
    :options="options"
    :mode="config.multiSelect ? 'multiple' : undefined"
    remote
    class="filter-component-remote-select"
    @search="remoteMethod"
    @update:value="$emit('reloadData')"
  >
  </n-select>
</template>

<script setup lang="ts">
import { PropType, computed, ref, onMounted, getCurrentInstance } from 'vue';
import { useAxios } from '../../../plugins/axiox.client';

const props = defineProps({
  fieldName: {
    type: String,
    default: '',
  },
  config: {
    type: Object as PropType<{
        placeholder?: string;
        multiSelect?: boolean;
      }>,
    default() {
      return {};
    },
  },
  filterFormData: {
    type: Object as PropType<Record<string, unknown>>,
    default() {
      return {};
    },
  },
  objectKey: {
    type: [String, Number],
    default: '',
  },
});

const remoteOptions = ref<{
  label: string;
  value: string;
}[]>([]);

const loading = ref(false);
let lastQuery = '';

const options = computed(() => {
  const opts: {
         label: string;
         value: string;
      }[] = [];
  for (let i = 0; i < remoteOptions.value.length; i += 1) {
    const e = remoteOptions.value[i];
    if (e) opts.push(e);
  }
  return opts;
});

const $axios = useAxios();
const ctx = getCurrentInstance();
const $message = ctx?.appContext.config.globalProperties.$message;

async function remoteMethod(query: string, init = false) {
  loading.value = true;
  lastQuery = query;
  try {
    const rsp1Promise = $axios.post('list/filter-component-action/', {
      fieldName: props.fieldName,
      actionName: 'getOptions',
      actionData: query,
    });

    let initValue: {
      label: string;
      value: string;
    } | null = null;

    const value = props.filterFormData[props.objectKey] as string;

    if (init && value) {
      const rsp2 = await $axios.post('list/filter-component-action/', {
        fieldName: props.fieldName,
        actionName: 'getLabelByValue',
        actionData: value,
      });
      if (rsp2.data?.success) {
        initValue = {
          label: rsp2.data.data,
          value,
        };
      } else {
        throw new Error(rsp2.data?.message || `拉取字段${props.fieldName}初始值失败了`);
      }
    }

    const rsp1 = await rsp1Promise;
    const result = rsp1.data;
    if (lastQuery === query) {
      if (result.success) {
        remoteOptions.value = [...result.data];
        if (initValue) {
          const v = initValue.value;
          let exist = false;
          options.value.forEach((t) => {
            if (t.value === v) {
              exist = true;
            }
          });
          if (!exist) remoteOptions.value.push(initValue);
        }
      } else {
        throw new Error(result.message || '搜索远程数据失败了');
      }
    }
  } catch (e) {
    if (lastQuery === query && e instanceof Error) {
      // 这里提示
      $message.error(e?.message || String(e) || '搜索失败了');
    }
  }
  loading.value = false;
}


onMounted(() => {
  remoteMethod('', true);
});
</script>

<style lang="scss">
.filter-component-remote-select.ant-select {
   max-width: 20em;
   min-width: 8em;
}
</style>
