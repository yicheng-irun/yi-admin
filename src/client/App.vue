
<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-message-provider>
      <message-api ></message-api>
    </n-message-provider>
    <n-notification-provider>
      <notification-api></notification-api>
    </n-notification-provider>
    <router-view />
  </n-config-provider>
</template>

<script setup lang="ts">
import MessageApi from './components/message-api.vue';
import NotificationApi from './components/notification-api.vue';
import type { GlobalThemeOverrides } from 'naive-ui';

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#1890ff',
    primaryColorHover: '#40a9ff',
    primaryColorPressed: '#096dd9',
  },
};

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  >.n-config-provider {
    height: 100%;
    width: 100%;
  }
}
</style>
