<template>
  <YiAdminIcon :type="'icon-' + icon" :title="icon" />
</template>

<script lang="ts">
import { createFromIconfontCN } from '@ant-design/icons-vue';
import { defineComponent } from 'vue';

const YiAdminIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2970375_fukpi012pih.js', // 在 iconfont.cn 上生成
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
