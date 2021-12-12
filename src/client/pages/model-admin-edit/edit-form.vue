<template>
  <n-spin
    :show="state.loading"
    class="edit-form"
  >
    <div>
      <n-form-item
        v-if="editId"
        label="id:"
      >
        <div class="edit-id">
          {{ editId }}
        </div>
      </n-form-item>
      <n-form-item
        v-for="(item, index) in editFormFields"
        :key="index"
        :label="`${item.fieldNameAlias || item.fieldName}:`"
        :name="item.fieldName"
        :required="item.componentConfig.required"
        :rule="{}"
      >
        <div class="form-item-wrap">
          <component
            :is="getComponent(item.componentName)"
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
      </n-form-item>
      <n-form-item>
        <n-space>
          <n-button
            type="primary"
            @click="submit"
          >
            {{ editId ? '保存' : '提交' }}
          </n-button>
          <n-button
            dashed
            @click="reset"
          >
            重置
          </n-button>
        </n-space>
      </n-form-item>
    </div>
  </n-spin>
  <pre>
    {{JSON.stringify(editFormData)}}
  </pre>
  <pre>
    {{ JSON.stringify(editFormFields)}}
  </pre>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { FormComponents } from './form-components';
import { EditFieldItem } from './store';

export default defineComponent({
  components: {
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
          this.$notification.success({
            title: '保存成功',
            description: '保存成功',
            duration: 5000,
          });
        } else {
          throw new Error(data?.message || '保存失败');
        }
      } catch (e) {
        if (e instanceof Error) {
          this.$notification.error({
            title: '提交出错了',
            description: e?.message || `${e}`,
            duration: 5000,
          });
        }
      }

      this.$store.commit('setLoading', false);
    },
    reset() {
      try {
        this.$store.commit('resetEditFormData');
        this.$notification.success({
          title: '重置好了',
          description: '重置好了',
          duration: 5000,
        });
      } catch (e) {
        if (e instanceof Error) {
          this.$notification.error({
            title: '重置出错了',
            description: e?.message || `${e}`,
            duration: 5000,
          });
        }
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
   .form-item-wrap {
     min-width: 120px
   }

   .ya-help-text {
      margin: 0.5em 0 0;
      color: #0007;
      font-size: 0.8em;
      line-height: 1.5;
   }
}
</style>
