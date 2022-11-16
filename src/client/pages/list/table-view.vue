<template>
  <div class="table-view">
    <n-spin
      :show="state.loading"

    >
      <div class="top-action">
        <TableAction
          class="top-action-row"
          @createData="createData"
          @reloadData="reloadData"
        />
        <TableSort class="top-action-row" @reload-data="reloadData" />
        <TableFilter
          class="top-action-row"
          @reload-data="reloadData"
        />

        <div class="top-action-row">
          <n-space>
            <span class="action-label">对选中项进行</span>
            <no-ssr>
              <n-select
                v-if="checkedIdList"
                v-model:value="data.batchActionIndex"
                placeholder="请选择操作"
                style="min-width: 150px"
                :class="checkedIdList.length === 0 ? 'dashed' : ''"
                :options="batchActionOptions"
              ></n-select>
            </no-ssr>
            <n-popconfirm
              v-if="selectedBatchAction && selectedBatchAction.popConfirm"
              positive-text="是"
              negative-text="否"
              :on-positive-click="() => doBatchAction(selectedBatchAction)"
            >
              <template #trigger>
                <n-button
                  :type="selectedBatchAction.buttonType || ''"
                  :dashed="!!selectedBatchAction.buttonDashed"
                >
                  <Icon v-if="selectedBatchAction.buttonIcon" :icon="selectedBatchAction.buttonIcon" ></Icon>
                  执行
                </n-button>
              </template>
              <span>确定执行这个操作吗？</span>
            </n-popconfirm>
            <n-button
              v-else-if="selectedBatchAction"
              :type="selectedBatchAction.buttonType || ''"
              :dashed="!!selectedBatchAction.buttonDashed"
              @click="doBatchAction(selectedBatchAction)"
            >
              <Icon v-if="selectedBatchAction.buttonIcon" :icon="selectedBatchAction.buttonIcon" ></Icon>
              执行
            </n-button>
            <span
              v-if="checkedIdList"
              class="batch-action-help-text"
            >
              {{ checkedIdList.length === 0 ? '当前未勾选任何项目' : `已选中${checkedIdList.length}条记录` }}
            </span>
          </n-space>
        </div>
      </div>
      <div class="panel-box">
        <div class="table-wrapper">
          <table class="table-view-table">
            <thead class="table-view-thead">
              <tr>
                <th class="checkbox-all">
                  <no-ssr>
                    <n-checkbox
                      :checked="allChecked"
                      :on-update:checked="handelCheckAll"
                    />
                  </no-ssr>
                </th>
                <th>#</th>
                <th>id</th>
                <th>操作</th>
                <th
                  v-for="(item, idx) in listFields"
                  :key="idx"
                  class="field"
                >
                  <span
                    :field-name="item.fieldName"
                    v-text="item.fieldNameAlias || item.fieldName"
                  />
                </th>
              </tr>
            </thead>
            <tbody class="table-view-tbody">
              <tr
                v-for="(item, index) in listData"
                :key="item.id || index"
              >
                <td><n-checkbox v-model:checked="listCheckedStatusArray[index]" /></td>
                <td class="index-td">
                  {{ index + 1 }}
                </td>
                <td>
                  <a :href="getDetailUrl(item.id)">{{ item.id }}</a>
                </td>
                <td class="actions-td">
                  <n-space>
                    <template
                      v-for="(actionItem, actionIndex) in rowListActions"
                    >
                      <n-popconfirm
                        v-if="actionItem.popConfirm"
                        :key="actionIndex"
                        positive-text="是"
                        negative-text="否"
                        :on-positive-click="() => doActions(actionItem, [item.id])"
                      >
                        <template #trigger>
                          <n-button
                            size="small"
                            :type="actionItem.buttonType || ''"
                            :dashed="!!actionItem.buttonDashed"
                          >
                            <Icon v-if="actionItem.buttonIcon" :icon="actionItem.buttonIcon" ></Icon>
                            {{ actionItem.actionName }}
                          </n-button>
                        </template>
                        <div>确定执行这个操作吗？</div>
                      </n-popconfirm>
                      <n-button
                        v-else
                        :key="actionIndex + 'b'"
                        size="small"
                        :type="actionItem.buttonType || ''"
                        @click="() => doActions(actionItem, [item.id])"
                        :dashed="!!actionItem.buttonDashed"
                      >
                        <Icon v-if="actionItem.buttonIcon" :icon="actionItem.buttonIcon" ></Icon>
                        {{ actionItem.actionName }}
                      </n-button>
                    </template>
                  </n-space>
                </td>
                <td
                  v-for="(fieldItem, fieldIndex) in listFields"
                  :key="fieldIndex"
                >
                  <div class="fields-wrap">
                    <component
                      :is="getComponent(fieldItem.componentName)"
                      :id="item.id"
                      :config="fieldItem.componentConfig"
                      :field-name="fieldItem.fieldName"
                      :values="item.values"
                      :object-key="fieldItem.fieldName"
                      :value="item.values[fieldItem.fieldName]"
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="listData.length === 0"
            class="no-data"
          >
            暂时没有数据呦~
            <span v-if="state.total > 0">可能是您选择的页码太大，您可以前往 <a
              href="javascript:void(0)"
              @click="handleCurrentChange(1)"
            >第1页</a> </span>
          </div>
        </div>
        <div class="table-view-footer">
          <no-ssr>
            <n-pagination
              :page="pageIndex"
              :page-size="state.pageSize"
              :page-count="Math.ceil(state.total / state.pageSize)"
              :show-total="(total: number) => `总共 ${total} 项记录`"
              show-size-picker
              :page-sizes="[10, 20, 50, 100, 200]"
              show-quick-jumper
              :on-update:page="(page: number) => handleCurrentChange(page)"
              :on-update:page-size="(size: number) => handleSizeChange(size)"
            >
              <template #prefix>
                共{{ state.total }}项记录
              </template>
            </n-pagination>
          </no-ssr>
        </div>
      </div>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { nextTick, reactive } from 'vue';
import ListComponents from './list-components';
import { ListActionsItem, useListPageStore } from './store';
import TableSort from './table-sort.vue';
import TableFilter from './table-filter.vue';
import TableAction from './table-action.vue';
import Icon from '../../components/Icon.vue';
import { computed } from '@vue/reactivity';
import { useMessage, useNotification } from 'naive-ui';
import { publicPath } from '../../lib/public-path';
import { axiosInstance } from '../../plugins/axios.instance';

const notification = useNotification();
const message = useMessage();

const data = reactive({
  batchActionIndex: '',
});

const store = useListPageStore();
const state = computed(() => store.$state);

const pageIndex = computed(() => store.$state.pageIndex);
const listFields = computed(() => store.$state.listFields);
const listActions = computed(() => store.$state.listActions);
const listData = computed(() => store.$state.listData);
const listCheckedStatusArray = computed(() => store.$state.listCheckedStatusArray);

const checkedIdList = computed(() =>{
  const idList: string[] = [];
  const { listData, listCheckedStatusArray } = store.$state;
  for (let i = 0; i < listData.length; i += 1) {
    const item = listData[i];
    const status = listCheckedStatusArray[i] === true;
    if (status) {
      idList.push(item.id);
    }
  }
  return idList;
});

const betListActions= computed(() => {
  return store.$state.listActions.filter((t: ListActionsItem) => t.isBatchAction);
});

const batchActionOptions = computed(() => {
  const options: {
        value: number | string;
        label: any;
      }[] = [{
        value: '',
        label: '请选择',
      }];
  const actions = betListActions.value;
  for (let i = 0; i < actions.length; i += 1) {
    const element = actions[i];
    options.push({
      value: i,
      label: element.actionName,
    });
  }
  return options;
});

const selectedBatchAction = computed(() => {
  if (typeof data.batchActionIndex === 'number') {
    return betListActions.value[data.batchActionIndex];
  }
  return null;
});

const rowListActions = computed(() => {
  return listActions.value.filter((t) => t.isTableRowAction);
});

const allChecked = computed(() => {
  let isCheckedAll = true;
  const arr = listCheckedStatusArray.value;
  for (let i = 0; i < arr.length; i += 1) {
    if (!arr[i]) {
      isCheckedAll = false;
      break;
    }
  }
  return isCheckedAll;
});

function getComponent(componentName: string) {
  if (Object.prototype.hasOwnProperty.call(ListComponents, componentName)) {
    return ListComponents[componentName];
  }
  return ListComponents.base;
}

function handelCheckAll() {
  let v = true;
  if (allChecked.value) {
    v = false;
  }
  for (let i = 0; i < listCheckedStatusArray.value.length; i += 1) {
    listCheckedStatusArray.value[i] = v;
  }
}

async function handleSizeChange(pageSize: number) {
  store.$state.pageIndex = 1;
  store.$state.pageSize = pageSize;
  try {
    await store.fetchListData();
  } catch (e) {
    if (e instanceof Error) {
      notification.error({
        title: '出错了',
        description: e?.message || '拉取数据出错了',
        duration: 3000,
      });
    }
  }
}

function handleCurrentChange(v: number) {
  const oldPageIndex = store.$state.pageIndex;
  // this.$store.commit('setPageIndex', 0); // 这么做是禁止element的翻页组件提前跳页
  nextTick(async () => {
    store.$state.pageIndex= oldPageIndex; // 这么做是触发
    try {
      await store.fetchListData({ pageIndex: v });
    } catch (e) {
      if (e instanceof Error) {
        notification.error({
          title: '出错了',
          description: e?.message || '拉取数据出错了',
          duration: 3000,
        });
      }
    }
  });
}

function getDetailUrl(id: string | number) {
  return publicPath + 'edit/' + location.search + '&id='+id;
}

function createData() {
  window.location.href = publicPath + 'edit/' + location.search;
}

async function reloadData() {
  try {
    await store.fetchListData();
  } catch (e) {
    if (e instanceof Error) {
      notification.error({
        title: '出错了',
        description: e?.message || '拉取数据出错了',
        duration: 3000,
      });
    }
  }
}

async function doActions(actionObj: ListActionsItem, ids: string[] = []) {
  if (store.$state.loading) return;
  store.$state.loading = true;
  try {
    const rsp = await axiosInstance.post('/api/list-action/', {
      actionName: actionObj.actionName,
      idList: ids,
    });
    const result = rsp.data;
    if (result.success) {
      const {
        successfulNum = 0,
        failedNum = 0,
      } = result.data || {};
      notification.success({
        title: `${actionObj.actionName} 执行完成`,
        description: `${successfulNum} 项执行成功，${failedNum} 项执行失败`,
        duration: 3000,
      });
    } else {
      throw new Error(result?.message || `执行 ${actionObj.actionName} 操作失败了`);
    }
  } catch (e) {
    if (e instanceof Error) {
      notification.error({
        title: `${actionObj.actionName} 未执行完成`,
        description: e?.message || `执行 ${actionObj.actionName} 操作失败了`,
        duration: 3000,
      });
    }
  } finally {
    store.$state.loading = false;
  }

  try {
    await store.fetchListData();
  } catch (e) {
    if (e instanceof Error) {
      notification.error({
        title: '出错了',
        description: e?.message || '拉取数据出错了',
        duration: 3000,
      });
    }
  }
}

async function doBatchAction(actionObj: ListActionsItem | null) {
  const idList = checkedIdList.value;
  if (idList.length <= 0) {
    message.error('未勾选任何项目');
    return;
  }
  if (actionObj) {
    doActions(actionObj, idList);
  }
}

</script>

<style lang="scss">
.table-view {
  font-size: 12px;
  .top-action {
    padding: 0.8em 0 0.5em;
    >.top-action-row {
      // font-size: 0.9em;
      // color: #000a;
      margin: 0.8em 0;
      .action-label {
        line-height: 3;
      }

      .batch-action-help-text {
        line-height: 3;
      }
    }
  }
  .panel-box {
    box-shadow: 0 0 3px #0001;
    >.table-wrapper {
      overflow-x: auto;
      >table {
        min-width: 100%;
        background: #fff;
        border-collapse: collapse;
        font-size: 12px;
        >thead {
          border-bottom: 2px dotted #0004;
          line-height: 1.2;
          color: #000a;
          >tr {
            >th {
              padding: 1.2em 0.4em 1em;
              text-align: center;
              &.checkbox-all {
                padding: 1.2em 0.8em 1em;
                text-align: left;
              }
              &.field {
                min-width: 4em;
              }
            }
          }
        }
        >tbody {
          line-height: 1.5;
          >tr {
            >td {
              padding: 0.8em 0.8em;
              font-size: 12px;
              color: #000a;
              border-right: 1px dotted #0002;
              &:last-child {
                border-right: none;
              }
              &.index-td {
                text-align: center;
              }
              &.actions-td {
                text-align: center;
              }
              >.fields-wrap {
                text-align: center;
              }
            }
            &:nth-child(2n - 1) {
              background: #0000000a;
            }
          }
        }
      }
      >.no-data {
        text-align: center;
        line-height: 4;
        color: #0008;
        font-size: 1.3em;
      }
    }
    >.table-view-footer {
      border-top: 1px dashed #0003;
      background: #fff;
      padding: 1em 1em;
      color: #000a;
    }
  }
}
</style>
