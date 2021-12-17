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
                v-model:value="batchActionIndex"
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
                  <a :href="`edit/?id=${item.id}`">{{ item.id }}</a>
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

<script lang="ts">
import { defineComponent } from 'vue';
import ListComponents from './list-components';
import { ListActionsItem, ListDataItem, ListFieldsItem, ModelAdminListStateType } from './store';
import TableSort from './table-sort.vue';
import TableFilter from './table-filter.vue';
import TableAction from './table-action.vue';
import Icon from '../../components/Icon.vue';

export default defineComponent({
  components: {
    TableSort,
    TableFilter,
    TableAction,
    Icon,
  },
  data() {
    return {
      batchActionIndex: '',
    };
  },
  computed: {
    state(): ModelAdminListStateType {
      return this.$store.state;
    },
    pageIndex(): number {
      return this.state.pageIndex;
    },
    listFields(): ListFieldsItem[] {
      return this.state.listFields;
    },
    listActions(): ListActionsItem[] {
      return this.state.listActions;
    },
    listData(): ListDataItem[] {
      return this.state.listData;
    },
    listCheckedStatusArray(): boolean[] {
      return this.state.listCheckedStatusArray;
    },

    checkedIdList(): string[] {
      const idList: string[] = [];
      const { listData } = this;
      const { listCheckedStatusArray } = this;
      for (let i = 0; i < listData.length; i += 1) {
        const item = listData[i];
        const status = listCheckedStatusArray[i] === true;
        if (status) {
          idList.push(item.id);
        }
      }
      return idList;
    },

    betListActions(): ListActionsItem[] {
      return this.listActions.filter((t: ListActionsItem) => t.isBatchAction);
    },
    batchActionOptions(): {
        value: number | string;
        label: any;
      }[] { // 批量操作的下拉选择框选项
      const options: {
        value: number | string;
        label: any;
      }[] = [{
        value: '',
        label: '请选择',
      }];
      const actions = this.betListActions;
      for (let i = 0; i < actions.length; i += 1) {
        const element = actions[i];
        options.push({
          value: i,
          label: element.actionName,
        });
      }
      return options;
    },
    selectedBatchAction(): ListActionsItem | null { // 选中的批量操作action
      if (typeof this.batchActionIndex === 'number') {
        return this.betListActions[this.batchActionIndex];
      }
      return null;
    },
    rowListActions(): ListActionsItem[] {
      return this.listActions.filter((t) => t.isTableRowAction);
    },
    allChecked(): boolean {
      let isCheckedAll = true;
      for (let i = 0; i < this.listCheckedStatusArray.length; i += 1) {
        if (!this.listCheckedStatusArray[i]) {
          isCheckedAll = false;
          break;
        }
      }
      return isCheckedAll;
    },
  },
  methods: {
    getComponent(componentName: string) {
      if (Object.prototype.hasOwnProperty.call(ListComponents, componentName)) {
        return ListComponents[componentName];
      }
      return ListComponents.base;
    },
    handelCheckAll() {
      let v = true;
      if (this.allChecked) {
        v = false;
      }
      for (let i = 0; i < this.listCheckedStatusArray.length; i += 1) {
        this.listCheckedStatusArray[i] = v;
      }
    },
    async handleSizeChange(pageSize: number) {
      this.$store.commit('setPageIndex', 1);
      this.$store.commit('setPageSize', pageSize);
      try {
        await this.$store.dispatch('fetchListData');
      } catch (e) {
        if (e instanceof Error) {
          this.$notification.error({
            title: '出错了',
            description: e?.message || '拉取数据出错了',
            duration: 3000,
          });
        }
      }
    },
    handleCurrentChange(v: number) {
      const oldPageIndex = this.state.pageIndex;
      // this.$store.commit('setPageIndex', 0); // 这么做是禁止element的翻页组件提前跳页
      this.$nextTick(async () => {
        this.$store.commit('setPageIndex', oldPageIndex); // 这么做是触发
        try {
          await this.$store.dispatch('fetchListData', { pageIndex: v });
        } catch (e) {
          if (e instanceof Error) {
            this.$notification.error({
              title: '出错了',
              description: e?.message || '拉取数据出错了',
              duration: 3000,
            });
          }
        }
      });
    },

    async createData() {
      window.location.href = 'edit/';
    },

    async reloadData() {
      try {
        await this.$store.dispatch('fetchListData');
      } catch (e) {
        if (e instanceof Error) {
          this.$notification.error({
            title: '出错了',
            description: e?.message || '拉取数据出错了',
            duration: 3000,
          });
        }
      }
    },

    async doBatchAction(actionObj: ListActionsItem | null) {
      const idList = this.checkedIdList;
      if (idList.length <= 0) {
        this.$message.error('未勾选任何项目');
        return;
      }
      if (actionObj) {
        this.doActions(actionObj, idList);
      }
    },

    async doActions(actionObj: ListActionsItem, ids: string[] = []) {
      if (this.state.loading) return;
      this.$store.commit('setLoading', true);
      try {
        const rsp = await this.$axios.post('list/action/', {
          actionName: actionObj.actionName,
          idList: ids,
        });
        const result = rsp.data;
        if (result.success) {
          const {
            successfulNum = 0,
            failedNum = 0,
          } = result.data || {};
          this.$notification.success({
            title: `${actionObj.actionName} 执行完成`,
            description: `${successfulNum} 项执行成功，${failedNum} 项执行失败`,
            duration: 3000,
          });
        } else {
          throw new Error(result?.message || `执行 ${actionObj.actionName} 操作失败了`);
        }
      } catch (e) {
        if (e instanceof Error) {
          this.$notification.error({
            title: `${actionObj.actionName} 未执行完成`,
            description: e?.message || `执行 ${actionObj.actionName} 操作失败了`,
            duration: 3000,
          });
        }
      } finally {
        this.$store.commit('setLoading', false);
      }

      try {
        await this.$store.dispatch('fetchListData');
      } catch (e) {
        if (e instanceof Error) {
          this.$notification.error({
            title: '出错了',
            description: e?.message || '拉取数据出错了',
            duration: 3000,
          });
        }
      }
    },
  },
});
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
