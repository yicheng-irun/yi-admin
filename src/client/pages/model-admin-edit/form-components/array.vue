<template>
  <div
    v-if="value"
    class="form-components-array"
  >
    <div
      v-for="(item, index) in value"
      :key="index"
      class="form-components-array-item"
    >
      <div class="delete-btn">
        <n-button
          type="error"
          size="small"
          circle
          @click="value.splice(index, 1)"
        >
          <Icon icon="close" ></Icon>
        </n-button>
      </div>
      <component
        :is="getComponent()"
        :edit-form-data="value"
        :object-key="index"
        :name="`${index}`"
        :config="componentConfig"
        :field-name="fieldName"
      />
    </div>
    <n-button
      v-if="value.length < maxLength"
      type="primary"
      size="small"
      circle
      @click="pushItem"
    >
      <Icon icon="plus" ></Icon>
    </n-button>
    <p
      v-if="componentConfig.helpText"
      class="ya-help-text"
      v-text="componentConfig.helpText"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, PropType } from 'vue';
import { FormComponents } from '../form-components';
import Icon from '../../../components/Icon.vue';


const props = defineProps({
  config: {
    type: Object as PropType<{
      required?: boolean;
      helpText?: string;
      minLength?: number;
      maxLength?: number;
      childrenType: {
        componentName: string;
        fieldName: string;
        componentConfig: {
          required?: boolean;
          helpText?: string;
        };
        fieldNameAlias?: string;
      }
    }>,
  },
  editFormData: {
    type: Object as PropType<Record<string, any[]>>,
    default() {
      return {};
    },
  },
  name: String,
  fieldName: String,
  objectKey: {
    type: [String, Number] as PropType<string|number>,
    default: '',
  },
});

const componentConfig = computed(() => {
  return props.config?.childrenType?.componentConfig || {};
});

const maxLength = computed(() => props.config?.maxLength || Infinity);

const value = computed((): any[] => {
  return props.editFormData[props.objectKey];
});

function getComponent() {
  const componentName = props.config?.childrenType?.componentName;
  if (componentName && Object.prototype.hasOwnProperty.call(FormComponents, componentName)) {
    return FormComponents[componentName];
  }
  return FormComponents.base;
}

function pushItem() {
  if (props.config?.childrenType?.componentName === 'object') {
    value.value.push({});
    return;
  }
  value.value.push(null);
}

onMounted(() => {
  if (!value.value) {
    props.editFormData[props.objectKey] = [];
  }
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
