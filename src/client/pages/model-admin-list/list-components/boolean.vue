<template>
  <div
    v-if="typeof value === 'boolean'"
    class="list-components-boolean"
  >
    <span :class="value ? 'success' : 'error'">
      <Icon v-if="value" icon="ok"></Icon>
      <Icon v-else icon="close"></Icon>
      {{ value ? '是' : '否' }}
    </span>
  </div>
  <div v-else>
    {{ value }}
  </div>
</template>

<script setup lang="ts">
import Icon from '../../../components/Icon.vue';

defineProps({
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
});

</script>

<style lang="scss">
.list-components-boolean {
   font-size: 1em;
   font-weight: bold;
   >.success {
      color: #52c41a;
   }
   >.error {
      color: #f5222d;
   }
}
</style>
