<template>
  <YiAdminIcon :type="'icon-' + icon" :title="icon"  class="yiadmin-icon" />
</template>

<script lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue';
import { defineComponent } from 'vue';

const YiAdminIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2970375_tboacmtefzm.js', // 在 iconfont.cn 上生成
});

export default defineComponent({
  props: {
    icon: {
      type: String,
      default: 'ok',
    },
  },
  components: {
    YiAdminIcon,
  },
});
</script>

<style lang="scss">
.yiadmin-icon {
  font-size: 1em;
}
</style>
