<template>
  <a-input
    v-model="value"
    :placeholder="config.placeholder || ''"
    :max-length="config.maxLength"
    @change="onChange"
    class="form-component-string"
  />
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

export default defineComponent({
  props: {
    config: {
      type: Object,
      default() {
        return {};
      },
    },
    editFormData: {
      type: Object as PropType<Record<string, unknown>>,
      default() {
        return {};
      },
    },
    objectKey: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      value: this.editFormData[this.objectKey] || '',
    };
  },
  methods: {
    onChange(ttt, a) {
      console.log(ttt, a, this.value);
    },
  },
});
</script>

<style lang="scss">
.form-component-string {
   max-width: 20em;
}
</style>
