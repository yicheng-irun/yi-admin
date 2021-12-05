<template>
  <div
    class="form-components-array"
  >
    <div
      v-for="(item, index) in value"
      :key="index"
      class="form-components-array-item"
    >
      <div class="delete-btn">
        <n-button
          type="danger"
          icon="close"
          size="small"
          circle
          @click="value.splice(index, 1)"
        />
      </div>
      <component
        :is="getComponent"
        v-model="value[index]"
        :edit-form-data="value"
        :object-key="index"
        :name="index"
        :config="componentConfig"
        :field-name="fieldName"
      />
    </div>
    <n-button
      v-if="value.length < maxLength"
      icon="plus"
      type="primary"
      size="small"
      circle
      @click="pushItem"
    />
    <p
      v-if="componentConfig.helpText"
      class="ya-help-text"
      v-text="componentConfig.helpText"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    config: {
      type: Object,
      default() {
        return {
          required: false,
          helpText: '',
          minLength: 0,
          maxLength: 100,
          childrenType: {
            componentName: 'base',
            fieldName: '',
            componentConfig: {
              required: false,
              helpText: '',
            },
            fieldNameAlias: '',
          },
        };
      },
    },
    fieldName: {
      type: String,
      default: '',
    },
  },
  computed: {
    componentConfig() {
      return this.config?.childrenType?.componentConfig || {};
    },
    maxLength() {
      return this.config?.maxLength || Infinity;
    },
  },
  methods: {
    async getComponent() {
      const componentName = this.config?.childrenType?.componentName;
      const { FormComponents } = await import('../form-components');
      if (Object.prototype.hasOwnProperty.call(FormComponents, componentName)) {
        return FormComponents[componentName]();
      }
      return FormComponents.base();
    },
    pushItem() {
      if (this.config?.childrenType?.componentName === 'object') {
        this.value.push({});
        return;
      }
      this.value.push(null);
    },
  },
});
</script>

<style lang="scss">
.form-components-array {
   color: #606266;
   >.form-components-array-item {
      position: relative;
      margin: 0 0 0.5em 2.4em;
      min-height: 2em;
      >.delete-btn {
         position: absolute;
         left: -2.4em;
      }
   }
}
</style>
