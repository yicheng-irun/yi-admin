<template>
  <div
    class="list-components-string-textarea"
  >
    {{ showValue }}
  </div>
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
    config: {
      type: Object,
      default() {
        return {
          styleMaxTextLength: 200,
        };
      },
    },
  },
  computed: {
    showValue(): string {
      const v = String(this.value);
      const maxLength = this.config?.styleMaxTextLength || 200;
      if (v.length > maxLength) {
        return `${v.substr(0, 200)}...`;
      }
      return v;
    },
  },
});
</script>

<style lang="scss">
.list-components-string-textarea {
   text-align: center;
   word-break: break-all;
}
</style>
