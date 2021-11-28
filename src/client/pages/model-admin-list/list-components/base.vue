<template>
  <div
    class="list-components-base"
    v-text="value"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: [String, Number, Boolean, Date, Object],
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
.list-components-base {
   text-align: center;
   word-break: break-all;
}
</style>
