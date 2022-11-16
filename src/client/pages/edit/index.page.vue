<template>
  <div class="model-admin-edit-page">
    <n-breadcrumb separator=">">
      <n-breadcrumb-item>
        <a
          :href="publicPath"
          target="_top"
        >
          首页
        </a>
      </n-breadcrumb-item>
      <n-breadcrumb-item >
        <a
          :href="publicPath + 'list/?modelName=' + modelName"
        >
          {{ state.modelInfo.title || state.modelInfo.name }} 管理
        </a>
      </n-breadcrumb-item>
      <n-breadcrumb-item >
        {{ state.modelInfo.title || state.modelInfo.name }} {{ state.editId ? '编辑' : '新增' }}
      </n-breadcrumb-item>
    </n-breadcrumb>
    <edit-form />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useEditPageStore } from './store';
import EditForm from './edit-form.vue';
import { getQuery } from '../../lib/query';
import { publicPath } from '../../lib/public-path';

const modelName = getQuery('modelName') || '';

const store = useEditPageStore();

const state = computed(() => {
  return store.$state;
});

onMounted(() => {
  store.fetchEditFormFields();
  store.fetchEditData();
});

</script>

<style lang="scss">
body {
   background: #f5f6f7;
}
.model-admin-edit-page {
  padding: 1em 0;
  margin: 0 1.2em;
}
.ant-breadcrumb {
  padding: 1em 0;
}

</style>
