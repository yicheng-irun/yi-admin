import { Router } from 'vue-router';
import { createStore } from 'vuex';

export interface EditFieldItem {
  componentConfig: Record<string, unknown>
  componentName: string;
  fieldName: string;
  fieldNameAlias: string;
}

export interface ModelAdminEditPageState {
   modelInfo: {
      name: string;
      title: string;
   };

   editId: string;
   editFormFields: EditFieldItem[];
   editFormData: Record<string, unknown>;
   editFormDataResetJson: string;

   loading: boolean;
}


export function createPageStore(ctx: {
  router: Router
}) {
  const editId = String(ctx.router.currentRoute.value.query.id || '');
  return createStore<ModelAdminEditPageState>({
    state: {
      modelInfo: {
        name: '',
        title: '',
      },

      editId,
      editFormFields: [],
      editFormData: {},
      editFormDataResetJson: '{}',
      loading: false,
    },

    mutations: {
      setEditId(state, data: { id: string }) {
        state.editId = data.id;
      },

      resetEditFormData(state) {
        state.editFormData = JSON.parse(state.editFormDataResetJson);
      },

      setEditFormData(state, { values }: {
        values: Record<string, unknown>
      }) {
        state.editFormDataResetJson = JSON.stringify(values);
        state.editFormData = values;
      },

      setLoading(state, value) {
        state.loading = !!value;
      },
    },

    actions: {
      async fetchEditFormFields() {
        const rsp = await this.$axios.get<{
          success: boolean;
          message?: string;
          data: {
            fields: EditFieldItem[],
            modelInfo: {
              title: string;
              name: string;
            }
          }
        }>('fields/', { });
        const result = rsp.data;
        if (!result.success) {
          throw new Error(result.message || '获取表单结构失败了');
        }
        this.state.editFormFields = result.data.fields;
        this.state.modelInfo = result.data.modelInfo;
      },

      async fetchEditData({ state }) {
        const rsp = await this.$axios.get<{
          success: boolean;
          message?: string;
          data: {
            id: string;
            values: Record<string, unknown>
          }
        }>('values/', {
          params: {
            id: state.editId,
          },
        });
        const result = rsp.data;
        if (!result.success) {
          throw new Error(result.message || '获取初始化数据失败了');
        }
        this.commit('setEditFormData', result.data);
      },

      async formSubmit({ state }) {
        const rsp = await this.$axios.post('submit/', {
          editId: state.editId,
          formData: state.editFormData,
        });
        const result = rsp.data;
        if (result?.success && result?.data?.id) {
          this.commit('setEditId', result.data);
          this.commit('setEditFormData', result.data);
        }
        return rsp.data;
      },
    },
  });
}
