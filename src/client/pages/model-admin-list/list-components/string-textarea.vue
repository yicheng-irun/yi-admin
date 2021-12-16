<template>
  <div
    class="list-components-string-textarea"
  >
    {{ showValue }}
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props =defineProps({
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
});

const showValue = computed(() => {
  const v = String(props.value);
  const maxLength = props.config?.styleMaxTextLength || 200;
  if (v.length > maxLength) {
    return `${v.substr(0, 200)}...`;
  }
  return v;
});

</script>

<style lang="scss">
.list-components-string-textarea {
   text-align: center;
   word-break: break-all;
}
</style>
