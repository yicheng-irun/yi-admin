<template>
  <div class="model-admin-list-page">
    <n-breadcrumb separator=">">
      <n-breadcrumb-item>
        <a
          :href="publicPath"
          target="_top"
        >
          首页
        </a>
      </n-breadcrumb-item>
      <n-breadcrumb-item v-if="!state.hasFilterQuery">
        {{ state.modelInfo.title || state.modelInfo.name }} 管理
      </n-breadcrumb-item>
      <n-breadcrumb-item v-if="state.hasFilterQuery">
        <a
          :href="publicPath + 'list/?modelName='+state.modelInfo.name"
        >
          {{ state.modelInfo.title || state.modelInfo.name }} 管理
        </a>
      </n-breadcrumb-item>
      <n-breadcrumb-item v-if="state.hasFilterQuery">
        带条件:{{ state.filterQueryStr }} 的数据管理
      </n-breadcrumb-item>
    </n-breadcrumb>
    <TableView />
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { publicPath } from '../../lib/public-path';
import { useListPageStore } from './store';
import TableView from './table-view.vue';


const store = useListPageStore();

const state = computed(() => {
  return store.$state;
});


onMounted(() =>{
  Promise.all([
    store.fetchListActions(),
    store.fetchListData(),
    store.fetchListFields(),
  ]);
});
</script>

<style lang="scss">
body {
   background: #f6f6f6;
}
.model-admin-list-page {
  padding: 1em 0;
  margin: 0 1.2em;
}
</style>
