<template>
  <div class="table-sort-block">
    <span class="action-lable">排序:</span>
    <div
      v-for="(optionsItems, idx) in sortOptionsList"
      :key="idx"
      class="sort-item"
    >
      <no-ssr>
        <n-select
          v-model:value="state.sortList[idx]"
          placeholder="请选择"
          style="min-width:150px"
          :options="optionsItems"
        >
        </n-select>
      </no-ssr>
      <div class="sort-item-info">
        <button
          class="text-button danger"
          @click="removeRule(idx)"
        >
          删除
        </button>
        <span>该排序</span>
      </div>
    </div>
    <button
      class="text-button"
      @click="createNewRule"
    >
      增加
    </button>
    <span>排序规则</span>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import { useStore } from 'vuex';
import { ModelAdminListStateType } from './store';

interface SelectOption {
  label: string;
  value: string;
}

const { state } = useStore<ModelAdminListStateType>();

const emit = defineEmits(['reloadData']);

function getSortOptions(): SelectOption[] {
  const options : SelectOption[]= [];
  options.push({
    label: '+ id 增序',
    value: '_id',
  }, {
    label: '- id 降序',
    value: '-_id',
  });
  for (let i = 0; i < state.listFields.length; i += 1) {
    const field = state.listFields[i];
    const fieldNameAlias = field.fieldNameAlias || field.fieldName;
    options.push({
      label: `${fieldNameAlias} 增序(+)`,
      value: `${field.fieldName}`,
    }, {
      label: `${fieldNameAlias} 降序(-)`,
      value: `-${field.fieldName}`,
    });
  }
  return options;
}

const sortOptionsList = computed((): SelectOption[][] => {
  const sortOptions = getSortOptions();
  const result: SelectOption[][] = state.sortList.map((item, index) => {
    const newOptions: SelectOption[] = [];
    for (let i = 0; i < sortOptions.length; i += 2) {
      const option1 = sortOptions[i];
      const option2 = sortOptions[i + 1];
      if (item === option1.value || item === option2.value) {
        newOptions.push(option1, option2);
      } else if (state.sortList.includes(option1.value) || state.sortList.includes(option2.value)) {
        //
      } else {
        newOptions.push(option1, option2);
      }
    }
    return newOptions;
  });

  return result;
});

function removeRule(index: number) {
  state.sortList.splice(index, 1);
}

function createNewRule() {
  state.sortList.push('');
}

watch(state.sortList, () => {
  emit('reloadData');
});
</script>

<style lang="scss">
.table-sort-block {
  >.action-lable {
    line-height: 3em;
  }
  >.sort-item {
    display: inline-block;
    margin: 0 0.5em 0 0.2em;
    vertical-align: top;
    >.sort-item-info {
      line-height: 2;
      padding: 0 1em;
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
