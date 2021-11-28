<template>
  <a-input-number
    v-model="editFormData[objectKey]"
    :placeholder="config.placeholder || ''"
    :min="config.min"
    :max="config.max"
    :step="config.step"
    class="form-component-number"
  />
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
  methods: {

  },
});
</script>

<style lang="scss">
.form-component-number {
}
</style>
