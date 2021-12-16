<template>
  <div
    class="list-components-object"
    v-text="value"
  />
</template>

<script setup lang="ts">
defineProps({
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
});
</script>

<style lang="scss">
.list-components-object {
   text-align: center;
   word-break: break-all;
}
</style>
