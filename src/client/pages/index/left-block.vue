<template>
  <div class="left-block">
    <NMenu
      :options="menuOption?.children || []"
      v-model="data.menuKey"
      :collapsed="collapsed"
      :indent="14"
      accordion
      :on-update:value="onUpdate"
    ></NMenu>
  </div>
</template>

<script lang="ts" setup>
import { NMenu } from 'naive-ui';
import { OnUpdateValue } from 'naive-ui/es/menu/src/interface';
import { computed, onMounted, reactive } from 'vue';
import { transformSiteMenuOptions } from './index-page-utils';
import { useStore } from './index.store';

defineProps({
  collapsed: {
    type: Boolean,
    default: false,
  },
});

const store = useStore();

const data = reactive({
  menuKey: '',
});

const siteMenu = computed(() => {
  return store.$state.siteMenu;
});

const menuOption = computed(() => {
  if (siteMenu.value) {
    return transformSiteMenuOptions(siteMenu.value);
  }
  return null;
});

onMounted(() => {
  const navHash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
  if (navHash) {
    try {
      const value = JSON.parse(navHash) as {
          link?: string;
          menuKey?: string;
        };
      const link = value?.link;
      if (link) {
        window.open(link, 'main_frame');
      }
      const menuKey = value?.menuKey;
      console.log(menuKey);
      if (menuKey) {
        data.menuKey = menuKey;
      }
    } catch (e) {
      console.error(e);
    }
  }
});

const onUpdate: OnUpdateValue = function(key: string, item) {
  const link = item.link;
  if (link) {
    const hashData = JSON.stringify({
      link,
      menuKey: key,
    });
    window.history.replaceState(null, '', `#${hashData}`);
  }
};

</script>

<style lang="scss">
.left-block {
  .menu-text-icon {
    display: inline-block;
    font-size: 12px;
    line-height: 16px;
    border: 1px solid;
    border-radius: 12px;
    width: 18px;
    height: 18px;
    text-align: center;
  }
}

</style>
