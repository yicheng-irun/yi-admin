<template>

  <a-breadcrumb separator=">">
    <a-breadcrumb-item>
      <a
        href="../../"
        target="_top"
      >
        首页
      </a>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="!state.hasFilterQuery">
      {{ state.modelInfo.title || state.modelInfo.name }} 管理
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="state.hasFilterQuery">
      <a
        href="./"
      >
        {{ state.modelInfo.title || state.modelInfo.name }} 管理
      </a>
    </a-breadcrumb-item>
    <a-breadcrumb-item v-if="state.hasFilterQuery">
      带条件:{{ state.filterQueryStr }} 的数据管理
    </a-breadcrumb-item>
  </a-breadcrumb>
  <TableView />
  <!-- <pre v-text="JSON.stringify(state, null, '  ')" /> -->
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
#app {
   padding: 0 0 2em;
   transition: opacity 0.3s;
   >.ant-breadcrumb {
      padding: 1em 0;
      margin: 0 1.2em;
   }
   >pre {
      font-size: 12px;
   }
}
</style>
