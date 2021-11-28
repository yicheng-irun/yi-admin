<template>
  <div
    class="list-components-object"
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
      type: Object,
      default: null,
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
.list-components-object {
   text-align: center;
   word-break: break-all;
}
</style>
