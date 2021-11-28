<template>
  <a-select
    v-model="editFormData[objectKey]"
    :placeholder="config.placeholder == null ? '请选择' : config.placeholder"
    :clearable="config.required ? false : true"
    :allow-clear="true"
    class="form-component-string-enum"
  >
    <a-select-option
      v-for="item in options"
      :key="item.value"
      :value="item.value"
    >
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    editFormData: {
      type: [Object, Array],
      default() {
        return {};
      },
    },
    objectKey: {
      type: [String, Number],
      default: '',
    },
  },

  computed: {
    options() {
      return this.config.enum || [];
    },
  },
  methods: {
  },
});
</script>

<style lang="scss">
.form-component-string-enum.ant-select {
   max-width: 20em;
}
</style>
