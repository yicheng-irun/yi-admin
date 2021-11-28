<template>
  <a-spin
    :spinning="state.loading"
    class="edit-form"
  >
    <a-form
      ref="form"
      :model="editFormData"
      layout="horizontal"
    >
      <a-form-item
        v-if="editId"
        label="id:"
      >
        <div class="edit-id">
          {{ editId }}
        </div>
      </a-form-item>
      <a-form-item
        v-for="(item, index) in editFormFields"
        :key="index"
        :label="`${item.fieldNameAlias || item.fieldName}:`"
        :name="item.fieldName"
        :required="item.componentConfig.required"
      >
        <div class="form-item-wrap">
          <component
            :is="getComponent(item.componentName)"
            v-model="editFormData[item.fieldName]"
            :edit-form-data="editFormData"
            :object-key="item.fieldName"
            :name="item.fieldName"
            :config="item.componentConfig"
            :field-name="item.fieldName"
          />
        </div>
        <p
          v-if="item.componentConfig.helpText"
          class="ya-help-text"
          v-text="item.componentConfig.helpText"
        />
      </a-form-item>
      <a-form-item>
        <a-button-group>
          <a-button
            type="primary"
            icon="check"
            @click="submit"
          >
            {{ editId ? '保存' : '提交' }}
          </a-button>
          <a-button
            type="dashed"
            icon="undo"
            @click="reset"
          >
            重置
          </a-button>
        </a-button-group>
      </a-form-item>
    </a-form>
  </a-spin>
  <pre>
    {{JSON.stringify(editFormData)}}
  </pre>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { notification } from 'ant-design-vue';
import { FormComponents } from './form-components';
import { EditFieldItem } from './store';

export default defineComponent({
  components: {
    // ...FormComponents,
  },

  props: {
    editId: {
      type: String,
      default: '',
    },
    editFormData: {
      type: Object as PropType<Record<string, unknown>>,
      default() {
        return {};
      },
    },
    editFormFields: {
      type: Array as PropType<EditFieldItem[]>,
      default() {
        return [];
      },
    },
  },

  computed: {
    state() {
      return this.$store.state;
    },
  },

  methods: {
    getComponent(componentName: string) {
      if (Object.prototype.hasOwnProperty.call(FormComponents, componentName)) {
        return FormComponents[componentName];
      }
      return FormComponents.base;
    },
    async submit() {
      if (this.state.loading) return;
      this.$store.commit('setLoading', true);
      // await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const data = await this.$store.dispatch('formSubmit');
        if (data?.success) {
          notification.success({
            message: '保存成功',
            description: '保存成功',
          });
        } else {
          throw new Error(data?.message || '保存失败');
        }
      } catch (e) {
        if (e instanceof Error) {
          notification.error({
            message: '提交出错了',
            description: e?.message || `${e}`,
          });
        }
      }

      this.$store.commit('setLoading', false);
    },
    reset() {
      try {
        this.$store.commit('resetEditFormData');
        notification.success({
          message: '重置好了',
          description: '重置好了',
        });
      } catch (e) {
        notification.error({
          message: '重置出错了',
          description: e?.message || `${e}`,
        });
      }
    },
  },
});
</script>

<style lang="scss">
.edit-form {
   padding: 2em 0em;
   margin: 0 1em;
   >div.ant-spin-container {
      >.ant-form {
         >.ant-form-item {
            >.ant-form-item-label {
            }
            >.ant-form-item-control-wrapper {
            }
            @media (min-width: 576px) {
               >.ant-form-item-label {
                  position: absolute;
                  width: 10em;
               }
               >.ant-form-item-control-wrapper {
                  position: relative;
                  min-height: 1em;
                  margin: 0 0 0 10.5em;
               }
            }
         }
      }
   }

   .ya-help-text {
      margin: 0.5em 0 0;
      color: #0007;
      font-size: 0.8em;
      line-height: 1.5;
   }
}
</style>
