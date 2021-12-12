<template>
  <div
    v-if="filterFields.length"
    class="table-filter"
  >
    <span class="action-lable">过滤:</span>
    <div
      v-for="(fItem, idx) in filterFields"
      :key="idx"
      class="filter-item"
    >
      <n-tooltip
        trigger="hover"
        :title="fItem.componentConfig.tip"
      >
        <template #trigger>
          <div class="filter-item-wrap">
            <label class="filter-item-label">{{ fItem.fieldNameAlias || fItem.fieldName }}: </label>
            <div class="filter-fields-wrap">
              <component
                :is="getComponent(fItem.componentName)"
                :filter-form-data="filterForm"
                :object-key="fItem.fieldName"
                :config="fItem.componentConfig"
                :field-name="fItem.fieldName"
                @reloadData="reloadData"
              />
            </div>
          </div>
        </template>
        <span>{{ fItem.componentConfig.tip || "暂无提示" }}</span>
      </n-tooltip>
    </div>
    <n-button
      dashed
      type="primary"
      icon="search"
      @click="reloadData"
    >
      查找
    </n-button>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import FilterComponents from './filter-components';
import { ListFilterFieldsItem, ModelAdminListStateType } from './store';

export default defineComponent({
  components: {},
  computed: {
    state(): ModelAdminListStateType {
      return this.$store.state;
    },
    filterFields(): ListFilterFieldsItem[] {
      return this.state.filterFields;
    },
    filterForm(): Record<string, unknown> {
      return this.state.filterForm;
    },
  },
  methods: {
    getComponent(componentName: string) {
      if (Object.prototype.hasOwnProperty.call(FilterComponents, componentName)) {
        return FilterComponents[componentName];
      }
      return FilterComponents.base;
    },
    reloadData() {
      this.$emit('reloadData');
    },
  },
});
</script>

<style lang="scss">
.table-filter {
   >.action-lable {
      line-height: 2.5em;
   }
   >.filter-item {
      display: inline-block;
      vertical-align: top;
      margin: 0 1em 1em 0em;
      >.filter-item-wrap {
         >.filter-item-label {
            color: #000;
            margin: 0 0.2em 0 0;
            display: inline-block;
         }
         >.filter-fields-wrap {
          display: inline-block;
          min-width: 80px;
         }
      }
   }
   button.text-button {
      border: none;
      background: none;
      font-size: 1em;
      color: #409eff;
      cursor: pointer;
      &.danger {
         color: #f56c6c;
      }
   }
}
</style>
