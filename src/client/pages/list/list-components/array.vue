<template>
  <div
    class="list-components-array"
  >
    <div
      v-for="(item, index) in value"
      :key="index"
      class="list-components-array-item"
      :class="config.listStyleInline ? 'inline-type' : ''"
    >
      <component
        :is="getComponent()"
        :id="id"
        :config="componentConfig"
        :field-name="fieldName"
        :values="value"
        :object-key="index"
        :value="value[index]"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import ListComponents from '../list-components';

const props = defineProps({
  value: {
    type: Array as PropType<(string|number| boolean| Date| Object)[]>,
    default: () => [],
  },
  id: {
    type: String,
    default: '',
  },
  fieldName: {
    type: String,
    default: '',
  },
  config: {
    type: Object as PropType<{
      listStyleInline?: boolean;
      childrenType: {
        componentName: string;
        fieldName: string;
        componentConfig: Record<string, string>
        fieldNameAlias: string;
      }
    }>,
    default() {
      return {
        listStyleInline: false,
        childrenType: {
          componentName: 'base',
          fieldName: '',
          componentConfig: {},
          fieldNameAlias: '',
        },
      };
    },
  },
});

const componentConfig = computed(() => {
  return props.config?.childrenType?.componentConfig || {};
});

function getComponent() {
  const componentName = props.config?.childrenType?.componentName;
  if (componentName && Object.prototype.hasOwnProperty.call(ListComponents, componentName)) {
    return ListComponents[componentName];
  }
  return ListComponents.base;
}
</script>

<style lang="scss">
.list-components-array {
   text-align: center;
   .list-components-array-item {
      position: relative;
      margin: 0.3em;
      &.inline-type {
        display: inline-block;
        background: #0001;
      }
   }
}
</style>
