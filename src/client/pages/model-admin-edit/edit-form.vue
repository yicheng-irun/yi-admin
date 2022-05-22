<template>
  <n-spin
    :show="state.loading"
    class="edit-form"
  >
    <div>
      <no-ssr>
        <n-form-item
          v-if="editId"
          label="ID:"
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
      </no-ssr>
    </div>
  </n-spin>
  <!-- <pre>
    {{JSON.stringify(editFormData)}}
  </pre>
  <pre>
    {{ JSON.stringify(editFormFields, null, '  ')}}
  </pre> -->
</template>

<script setup lang="ts">
import { computed, getCurrentInstance } from 'vue';
import { useStore } from 'vuex';
import { FormComponents } from './form-components';
import { ModelAdminEditPageState } from './store';

const { state, commit, dispatch } = useStore<ModelAdminEditPageState>();

const editId = computed(() => state.editId);

const editFormData = computed(() => state.editFormData);
const editFormFields = computed(() => state.editFormFields);

function getComponent(componentName: string) {
  if (Object.prototype.hasOwnProperty.call(FormComponents, componentName)) {
    return FormComponents[componentName];
  }
  return FormComponents.base;
}

const ctx = getCurrentInstance();
const $notification = ctx?.appContext.config.globalProperties.$notification;

async function submit() {
  if (state.loading) return;
  commit('setLoading', true);
  // await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const data = await dispatch('formSubmit');
    if (data?.success) {
      $notification.success({
        title: '保存成功',
        description: '保存成功',
        duration: 5000,
      });
    } else {
      throw new Error(data?.message || '保存失败');
    }
  } catch (e) {
    if (e instanceof Error) {
      $notification.error({
        title: '提交出错了',
        description: e?.message || `${e}`,
        duration: 5000,
      });
    }
  }

  commit('setLoading', false);
}

function reset() {
  try {
    commit('resetEditFormData');
    $notification.success({
      title: '重置好了',
      description: '重置好了',
      duration: 5000,
    });
  } catch (e) {
    if (e instanceof Error) {
      $notification.error({
        title: '重置出错了',
        description: e?.message || `${e}`,
        duration: 5000,
      });
    }
  }
}
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
