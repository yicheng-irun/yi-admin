<template>
  <div
    class="list-components-date"
  >{{showValue}}</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
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
});

const showValue = computed<string>(() => {
  if (props.value) {
    const date = new Date(props.value);
    return date.toLocaleString();
  }
  return '';
});

</script>

<style lang="scss" scoped>
.list-components-date {
   text-align: center;
   word-break: break-all;
}
</style>
