<template>
  <div
    class="form-components-base"
    v-text="value"
  />
  <div>111111111</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    value: {
      type: String,
      default: '',
    },
    config: {
      type: Object,
      default() {
        return {};
      },
    },
  },
});
</script>

<style lang="scss">
.form-components-base {
   color: #606266
}
</style>
