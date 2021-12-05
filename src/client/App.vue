
<template>
  <n-message-provider>
    <message-api ></message-api>
  </n-message-provider>
  <n-notification-provider>
    <notification-api></notification-api>
  </n-notification-provider>
  <router-view />
</template>

<script setup lang="ts">
import MessageApi from './components/message-api.vue';
import NotificationApi from './components/notification-api.vue';
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
