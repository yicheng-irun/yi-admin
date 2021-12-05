<template>
  <div
    v-if="typeof value === 'boolean'"
    class="list-components-boolean"
  >
    <n-icon
      :type="value ? 'check-circle' : 'close-circle'"
      :class="value ? 'success' : 'error'"
    />
  </div>
  <div v-else>
    {{ value }}
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
      type: Boolean,
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
.list-components-boolean {
   font-size: 1.5em;
   >.success {
      color: #52c41a;
   }
   >.error {
      color: #f5222d;
   }
}
</style>
