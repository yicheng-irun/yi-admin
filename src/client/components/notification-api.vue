<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import { useNotification } from 'naive-ui';

export default defineComponent({
  setup() {
    const ctx = getCurrentInstance();
    if (ctx && !import.meta.env.SSR) {
      const notification = useNotification();
      ctx.appContext.config.globalProperties.$notification = notification;
    }
  },
});
</script>
