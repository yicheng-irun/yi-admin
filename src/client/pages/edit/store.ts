import { defineStore } from 'pinia';
import { getQuery } from '../../lib/query';
import { axiosInstance } from '../../plugins/axios.instance';

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


const editId = getQuery('id') || '';
export const useEditPageStore = defineStore('editPage', {
  state() {
    const state: ModelAdminEditPageState = {
      modelInfo: {
        name: '',
        title: '',
      },

      editId,
      editFormFields: [],
      editFormData: {},
      editFormDataResetJson: '{}',
      loading: false,
    };
    return state;
  },

  actions: {
    setEditId( data: { id: string }) {
      this.editId = data.id;
    },

    resetEditFormData() {
      this.editFormData = JSON.parse(this.editFormDataResetJson);
    },

    setEditFormData( { values }: {
        values: Record<string, unknown>
      }) {
      this.editFormDataResetJson = JSON.stringify(values);
      this.editFormData = values;
    },

    setLoading(value: boolean) {
      this.loading = !!value;
    },
    async fetchEditFormFields() {
      const rsp = await axiosInstance.get<{
          success: boolean;
          message?: string;
          data: {
            fields: EditFieldItem[],
            modelInfo: {
              title: string;
              name: string;
            }
          }
        }>('/api/edit-fields/', { });
      const result = rsp.data;
      if (!result.success) {
        throw new Error(result.message || '获取表单结构失败了');
      }
      this.editFormFields = result.data.fields;
      this.modelInfo = result.data.modelInfo;
    },

    async fetchEditData() {
      const rsp = await axiosInstance.get<{
          success: boolean;
          message?: string;
          data: {
            id: string;
            values: Record<string, unknown>
          }
        }>('/api/edit-values/', {
          params: {
            id: this.editId,
          },
        });
      const result = rsp.data;
      if (!result.success) {
        throw new Error(result.message || '获取初始化数据失败了');
      }
      this.setEditFormData( result.data);
    },

    async formSubmit() {
      const rsp = await axiosInstance.post('/api/edit-submit/', {
        editId: this.editId,
        formData: this.editFormData,
      });
      const result = rsp.data;
      if (result?.success && result?.data?.id) {
        this.setEditId(result.data);
        this.setEditFormData(result.data);
      }
      return rsp.data;
    },
  },
});
