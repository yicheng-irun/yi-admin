import { createStore } from 'vuex';

export interface ListActionsItem {
   actionName: string;
   buttonIcon: string;
   buttonType: string;
   buttonDashed?: boolean;
   isBatchAction: boolean;
   isTableRowAction: boolean;
   popConfirm: boolean;
}

export interface ListFieldsItem {
   fieldName: string;
   fieldNameAlias: string;
   componentName: string;
   componentConfig: Record<string, unknown>
}

export interface ListFilterFieldsItem {
   componentName: string;
   componentConfig: Record<string, unknown>
   fieldName: string;
   fieldNameAlias: string;
}

export interface ListDataItem {
   id: string;
   [key: string]: unknown;
}

export interface ModelAdminListStateType {
   modelInfo: {
      title: string;
      name: string;
   }

   loading: boolean;
   pageIndex: number;
   pageSize: number;
   total: number;

   sortList: string[];
   hasFilterQuery: boolean;
   filterQueryStr: string;
   filterForm: Record<string, unknown>;

   /**
    * 字段信息
    */
   listFields: ListFieldsItem[];

   filterFields: ListFilterFieldsItem[];

   listActions: ListActionsItem[];

   listData: ListDataItem[];
   /**
    * 列表选中态数组
    */
   listCheckedStatusArray: boolean[];
}


export function createPageStore() {
  const filterForm = {
  };
  // if (runtime.query.filter) {
  //    try {
  //       const filterTemp = JSON.parse(runtime.query.filter);
  //       filterForm = {
  //          ...filterTemp,
  //       };
  //    } catch (e) {
  //       //
  //    }
  // }

  return createStore<ModelAdminListStateType>({
    state: {
      modelInfo: {
        title: '',
        name: '',
      },

      loading: false,
      pageIndex: 1,
      pageSize: 10,
      total: 0,

      sortList: ['-_id'],

      hasFilterQuery: Object.keys(filterForm).length > 0,
      filterQueryStr: JSON.stringify(filterForm),
      filterForm,

      // 字段信息
      listFields: [],
      // 列表的过滤字段信息
      filterFields: [],
      // 列表的操作动作信息
      listActions: [],

      listData: [],
      listCheckedStatusArray: [],
    },

    mutations: {
      setLoading(state, value) {
        state.loading = !!value;
      },
      setListActions(state, { data = [] } : { data: ListActionsItem[] }) {
        const actions: ListActionsItem[] = [];
        const exist: Record<string, boolean> = {};
        data.forEach((item) => {
          if (!Object.prototype.hasOwnProperty.call(exist, item.actionName)) {
            actions.push(item);
            exist[item.actionName] = true;
          }
        });
        state.listActions = actions;
      },
      setListData(state, { dataList, total }) {
        state.total = total;
        state.listData = dataList;
        const statusArray = new Array(dataList.length);
        statusArray.fill(false);
        state.listCheckedStatusArray = statusArray;
      },
      setPageSize(state, pageSize) {
        state.pageSize = pageSize;
      },
      setPageIndex(state, pageIndex) {
        state.pageIndex = pageIndex;
      },
    },

    actions: {
      async fetchListFields() {
        const rsp = await this.$axios.get<{
           success: boolean;
           message?: string;
           data: {
            modelInfo: {
               title: string;
               name: string;
            };
            filterFields: ListFilterFieldsItem[];
            fields: ListFieldsItem[]
           }
        }>('list/fields/', { });
        const result = rsp.data;
        if (result.success) {
          this.state.modelInfo = result.data.modelInfo;
          this.state.filterFields = result.data.filterFields;
          this.state.listFields = result.data.fields;
        } else {
          throw new Error(result?.message || '拉取字段信息出错了');
        }
      },

      async fetchListActions() {
        const rsp = await this.$axios.get<{
           success: boolean;
           message?: string;
           data: ListActionsItem[]
        }>('list/actions/', { });
        const result = rsp.data;
        if (result.success) {
          this.commit('setListActions', result);
        } else {
          throw new Error(result?.message || '拉取操作信息出错了');
        }
      },

      // 服务端请求，所以不需要错误请求
      async fetchListData({ state }, {
        pageIndex = state.pageIndex,
      } = {}) {
        if (state.loading) return;
        this.commit('setLoading', true);
        try {
          const rsp = await this.$axios.get<{
             success: boolean;
             message?: string;
             data: ListDataItem[]
          }>('list/data/', {
            params: {
              pageIndex,
              pageSize: state.pageSize,
              sort: state.sortList.join(' '),
              filter: JSON.stringify(state.filterForm),
            },
          });
          const result = rsp.data;
          if (result.success) {
            this.commit('setListData', result.data);
            this.commit('setPageIndex', pageIndex);
          } else {
            throw new Error(result?.message || '拉取列表数据出错了');
          }
        } finally {
          this.commit('setLoading', false);
        }
      },
    },
  });
}
