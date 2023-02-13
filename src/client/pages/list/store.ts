import { defineStore } from 'pinia';
import { axiosInstance } from '../../plugins/axios.instance';

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
  values: Record<string, unknown>
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
   filterForm: Record<string, string>;

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


const filterForm = {
};

export const useListPageStore = defineStore('listPage', {
  state() {
    const state:ModelAdminListStateType = {
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
    };
    return state;
  },

  /*
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
  */
  actions: {
    async fetchListFields() {
      const rsp = await axiosInstance.get<{
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
        }>('/api/list-fields/', {
          params: {
            modelName: '',
          },
        });
      const result = rsp.data;
      if (result.success) {
        this.modelInfo = result.data.modelInfo;
        this.filterFields = result.data.filterFields;
        this.listFields = result.data.fields;
      } else {
        throw new Error(result?.message || '拉取字段信息出错了');
      }
    },

    async fetchListActions() {
      const rsp = await axiosInstance.get<{
           success: boolean;
           message?: string;
           data: ListActionsItem[]
        }>('/api/list-actions/', {});
      const result = rsp.data;
      if (result.success) {
        const actions: ListActionsItem[] = [];
        const exist: Record<string, boolean> = {};
        result.data.forEach((item) => {
          if (!Object.prototype.hasOwnProperty.call(exist, item.actionName)) {
            actions.push(item);
            exist[item.actionName] = true;
          }
        });
        this.listActions = actions;
      } else {
        throw new Error(result?.message || '拉取操作信息出错了');
      }
    },

    // 服务端请求，所以不需要错误请求
    async fetchListData( {
      pageIndex,
    }: { pageIndex?: number } = {}) {
      const pIndex = pageIndex ?? this.pageIndex;
      if (this.loading) return;
      this.loading = true;
      try {
        if (this.filterForm['_id'] === '') {
          delete this.filterForm['_id'];
        }
        const rsp = await axiosInstance.get<{
             success: boolean;
             message?: string;
             data: {
              dataList: ListDataItem[],
              total: number;
             }
          }>('/api/list-data/', {
            params: {
              pageIndex: pIndex,
              pageSize: this.pageSize,
              sort: this.sortList.filter((t) => !!t).join(' '),
              conditions: JSON.stringify(this.filterForm), // 后台没有使用filter，而是conditions
              filter: JSON.stringify(this.filterForm),
            },
          });
        const result = rsp.data;
        if (result.success) {
          const { dataList, total } = result.data;
          this.total = total;
          this.listData = dataList;
          const statusArray = new Array(dataList.length);
          statusArray.fill(false);
          this.listCheckedStatusArray = statusArray;
          this.pageIndex = pIndex;
        } else {
          throw new Error(result?.message || '拉取列表数据出错了');
        }
      } finally {
        this.loading = false;
      }
    },
  },
});
