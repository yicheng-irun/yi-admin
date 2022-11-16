<template>
  <div
    v-if="filterFields.length"
    class="table-filter"
  >
    <span class="action-lable">过滤:</span>
    <div class="filter-item">
      <div class="filter-item-wrap">
        <label class="filter-item-label">id: </label>
        <div class="filter-fields-wrap">
          <NInput
            v-model:value="filterForm['_id']"
            placeholder="输入ID进行查询"
            clearable
            class="filter-component-string"
            @keydown.enter="emit('reloadData')"
          />
        </div>
      </div>
    </div>
    <div
      v-for="(fItem, idx) in filterFields"
      :key="idx"
      class="filter-item"
    >
      <template v-if="fItem.componentConfig.tip">
        <n-tooltip
          trigger="hover"
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
                  @reload-data="() => emit('reloadData')"
                />
              </div>
            </div>
          </template>
          <span>{{ fItem.componentConfig.tip }}</span>
        </n-tooltip>
      </template>
      <div v-else class="filter-item-wrap">
        <label class="filter-item-label">{{ fItem.fieldNameAlias || fItem.fieldName }}: </label>
        <div class="filter-fields-wrap">
          <component
            :is="getComponent(fItem.componentName)"
            :filter-form-data="filterForm"
            :object-key="fItem.fieldName"
            :config="fItem.componentConfig"
            :field-name="fItem.fieldName"
            @reload-data="() => emit('reloadData')"
          />
        </div>
      </div>
    </div>
    <n-button
      dashed
      type="primary"
      icon="search"
      @click="emit('reloadData')"
    >
      查找
    </n-button>
  </div>
</template>
<script setup lang="ts">
import { NInput } from 'naive-ui';
import { computed } from 'vue';
import FilterComponents from './filter-components';
import { useListPageStore } from './store';

const store = useListPageStore();

const emit = defineEmits(['reloadData']);

const filterFields = computed(() => {
  return store.$state.filterFields;
});

const filterForm = computed(() => {
  return store.$state.filterForm;
});

function getComponent(componentName: string) {
  if (Object.prototype.hasOwnProperty.call(FilterComponents, componentName)) {
    return FilterComponents[componentName];
  }
  return FilterComponents.base;
}
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
        vertical-align: middle;
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
