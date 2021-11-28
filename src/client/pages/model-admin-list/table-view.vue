<template>
  <div class="table-view">
    <a-spin
      :spinning="state.loading"

    >
      <div class="top-action">
        <TableAction
          class="top-action-row"
          @createData="createData"
          @reloadData="reloadData"
        />
        <TableSort class="top-action-row" />
        <TableFilter
          class="top-action-row"
          @reloadData="reloadData"
        />
        <div class="top-action-row">
          <span class="action-lable">对选中项进行</span>
          <a-select
            v-if="checkedIdList"
            v-model="batchActionIndex"
            placeholder="请选择操作"
            style="min-width: 150px"
            :class="checkedIdList.length === 0 ? 'dashed' : ''"
          >
            <a-select-option
              v-for="item in batchActionOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </a-select-option>
          </a-select>
          <a-popconfirm
            v-if="selectedBatchAction && selectedBatchAction.popConfirm"
            title="确定执行这个操作吗？"
            ok-text="是"
            cancel-text="否"
            :ok-type="selectedBatchAction.buttonType || 'primary'"
            @confirm="doBatchAction(selectedBatchAction)"
          >
            <a-button
              :type="selectedBatchAction.buttonType || 'default'"
            >
              <Icon v-if="selectedBatchAction.buttonIcon" :icon="selectedBatchAction.buttonIcon" ></Icon>
              执行
            </a-button>
          </a-popconfirm>
          <a-button
            v-else
            :type="(selectedBatchAction && selectedBatchAction.buttonType) || 'default'"
            :disabled="selectedBatchAction == null"
            @click="doBatchAction(selectedBatchAction)"
          >
            <Icon v-if="selectedBatchAction && selectedBatchAction.buttonIcon" :icon="selectedBatchAction.buttonIcon" ></Icon>
            执行
          </a-button>
          <span
            v-if="checkedIdList"
            class="batch-action-helptext"
          >
            {{ checkedIdList.length === 0 ? '当前未勾选任何项目' : `已选中${checkedIdList.length}条记录` }}
          </span>
        </div>
      </div>
      <div class="panel-box">
        <div class="table-wrapper">
          <table class="table-view-table">
            <thead class="table-view-thead">
              <tr>
                <th class="checkbox-all">
                  <a-checkbox
                    :checked="allChecked"
                    @change="handelCheckAll"
                  />
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
                <td><a-checkbox v-model="listCheckedStatusArray[index]" /></td>
                <td class="index-td">
                  {{ index + 1 }}
                </td>
                <td>
                  <a :href="`edit/?id=${item.id}`">{{ item.id }}</a>
                </td>
                <td class="actions-td">
                  <template
                    v-for="(actionItem, actionIndex) in rowListActions"
                  >
                    <a-popconfirm
                      v-if="actionItem.popConfirm"
                      :key="actionIndex"
                      title="确定执行这个操作吗？"
                      ok-text="是"
                      cancel-text="否"
                      :ok-type="actionItem.buttonType || 'primary'"
                      @confirm="doActions(actionItem, [item.id])"
                    >
                      <a-button
                        size="small"
                        :type="actionItem.buttonType || ''"
                        :icon="actionItem.buttonIcon || ''"
                      >
                        {{ actionItem.actionName }}
                      </a-button>
                    </a-popconfirm>
                    <a-button
                      v-else
                      :key="actionIndex + 'b'"
                      size="small"
                      :type="actionItem.buttonType || ''"
                      :icon="actionItem.buttonIcon || ''"
                      @click="doActions(actionItem, [item.id])"
                    >
                      {{ actionItem.actionName }}
                    </a-button>
                  </template>
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
          <a-pagination
            :current="pageIndex"
            :page-size-options="['10', '20', '50', '100', '200']"
            :page-size="state.pageSize"
            :total="state.total"
            :show-total="(total: number) => `总共 ${total} 项记录`"
            show-size-changer
            show-quick-jumper
            @showSizeChange="handleSizeChange"
            @change="handleCurrentChange"
          />
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { notification } from 'ant-design-vue';
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
      pageIdx: 0,
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
    batchActionOptions() { // 批量操作的下拉选择框选项
      const options = [];
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
  watch: {
    'state.sortList': function _() {
      this.$nextTick(() => {
        this.reloadData();
      });
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
        this.$set(this.listCheckedStatusArray, i, v);
      }
    },
    async handleSizeChange(a, v) {
      this.$store.commit('setPageIndex', 1);
      this.$store.commit('setPageSize', v);
      try {
        await this.$store.dispatch('fetchListData');
      } catch (e) {
        notification.error({
          message: '出错了',
          description: e?.message || '拉取数据出错了',
        });
      }
    },
    handleCurrentChange(v) {
      const oldPageIndex = this.state.pageIndex;
      this.$store.commit('setPageIndex', 0); // 这么做是禁止element的翻页组件提前跳页
      this.$nextTick(async () => {
        this.$store.commit('setPageIndex', oldPageIndex); // 这么做是触发
        try {
          await this.$store.dispatch('fetchListData', { pageIndex: v });
        } catch (e) {
          notification.error({
            message: '出错了',
            description: e?.message || '拉取数据出错了',
          });
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
        notification.error({
          message: '出错了',
          description: e?.message || '拉取数据出错了',
        });
      }
    },

    async doBatchAction(actionObj: ListActionsItem) {
      const idList = this.checkedIdList;
      if (idList.length <= 0) {
        notification.error({
          message: '未勾选任何项目',
        });
        return;
      }
      this.doActions(actionObj, idList);
    },

    async doActions(actionObj: ListActionsItem, ids: string[] = []) {
      if (this.state.loading) return;
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
          notification.success({
            message: `${actionObj.actionName} 执行完成`,
            description: `${successfulNum} 项执行成功，${failedNum} 项执行失败`,
          });
        } else {
          throw new Error(result?.message || `执行 ${actionObj.actionName} 操作失败了`);
        }
      } catch (e) {
        notification.error({
          message: `${actionObj.actionName} 未执行完成`,
          description: e?.message || `执行 ${actionObj.actionName} 操作失败了`,
        });
      } finally {
        this.$store.commit('setLoading', false);
      }

      try {
        await this.$store.dispatch('fetchListData');
      } catch (e) {
        notification.error({
          message: '出错了',
          description: e?.message || '拉取数据出错了',
        });
      }
    },
  },
});
</script>

<style lang="scss">
.table-view {
  font-size: 12px;
  margin: 0 1.5em;
  .top-action {
    padding: 0.8em 0 0.5em;
    >.top-action-row {
      font-size: 0.9em;
      color: #000a;
      padding: 0.6em 0;
      >.ant-btn {
        margin: 0 0.3em;
      }
      >.action-lable {
        margin: 0 0.8em 0 0;
      }
      >.ant-select {
        margin: 0 0.8em 0 0;
        &.dashed>.ant-select-selection {
          border-style: dashed;
        }
      }
      >.batch-action-helptext {
        font-size: 12px;
        margin: 0 0.3em;
        padding: 0 0.3em;
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
                .ant-btn {
                    margin: 0.1em;
                }
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
        line-height: 3em;
        background: #fff;
        padding: 1em 1em;
        color: #000a;
    }
  }
}
</style>
