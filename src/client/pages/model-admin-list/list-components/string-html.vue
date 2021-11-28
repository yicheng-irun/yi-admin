<template>
  <div
    class="list-components-string-html"
    v-html="value"
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
      type: [String, Number, Boolean, Date],
      default: '',
    },
  },
});
</script>

<style lang="scss">
.list-components-string-html {
   text-align: center;
   word-break: break-all;
}
</style>
