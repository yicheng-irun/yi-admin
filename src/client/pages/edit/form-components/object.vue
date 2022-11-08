<template>
  <div
    class="form-components-object"
  >
    <a-form-item
      v-for="(item, index) in config.editFields"
      :key="index"
      :label="`${item.fieldNameAlias || item.fieldName}:`"
      :prop="item.fieldName"
      :required="item.componentConfig.required"
    >
      <div class="form-item-wrap">
        <component
          :is="getComponent(item.componentName)"
          v-model="value[item.fieldName]"
          :edit-form-data="value"
          :object-key="item.fieldName"
          :name="item.fieldName"
          :config="item.componentConfig"
          :field-name="item.fieldName"
        />
      </div>
    </a-form-item>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { FormComponents } from '../form-components';

export default defineComponent({
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: Object,
      default() {
        return {};
      },
    },
    config: {
      type: Object,
      default() {
        return {
          required: false,
          helpText: '',
          editFields: [
            // {
            //    componentName: 'base',
            //    fieldName: '',
            //    componentConfig: {
            //       required: false,
            //       helpText: '',
            //    },
            //    fieldNameAlias: '',
            // },
          ],
        };
      },
    },
    fieldName: {
      type: String,
      default: '',
    },
  },
  methods: {
    getComponent(componentName: string) {
      if (Object.prototype.hasOwnProperty.call(FormComponents, componentName)) {
        return FormComponents[componentName];
      }
      return FormComponents.base;
    },
  },
});
</script>

<style lang="scss">
.form-components-object {
   background: #00000006;
   padding: 0 0.8em 0.1em;
   border-radius: 0.5em;
   >.ant-form-item {
      margin: 0 0 0.5em 0;
   }
}
</style>
