<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent, getCurrentInstance } from 'vue';
import { useMessage } from 'naive-ui';

export default defineComponent({
  setup() {
    const ctx = getCurrentInstance();
    if (ctx && !import.meta.env.SSR) {
      const message = useMessage();
      ctx.appContext.config.globalProperties.$message = message;
    }
  },
});
</script>
