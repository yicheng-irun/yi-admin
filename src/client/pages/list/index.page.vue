<template>
  <div class="model-admin-list-page">
    <n-breadcrumb separator=">">
      <n-breadcrumb-item>
        <a
          href="../../"
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
          href="./"
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

<script lang="ts">
import { defineComponent } from 'vue';
import { createPageStore, ModelAdminListStateType } from './store';
import TableView from './table-view.vue';

export default defineComponent({
  components: {
    TableView,
  },
  createStore: createPageStore,
  computed: {
    state(): ModelAdminListStateType {
      return this.$store.state;
    },
  },
  mounted() {
    Promise.all([
      this.$store.dispatch('fetchListFields'),
      this.$store.dispatch('fetchListActions'),
      this.$store.dispatch('fetchListData'),
    ]);
  },
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
