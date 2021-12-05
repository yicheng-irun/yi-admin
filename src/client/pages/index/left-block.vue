<template>
  <div class="left-block">
    <n-menu
      :options="menuOption?.children || []"
      v-model="menuKey"
      :collapsed="collapsed"
      :indent="14"
      accordion
      :on-update:value="onUpdate"
    ></n-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MenuOptionsItem, transformSiteMenuOptions } from './index-page-utils';
import { IndexPageState, SiteMenu } from './index.store';


export default defineComponent({
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      menuKey: '',
    };
  },
  watch: {
    menuKey(v) {
      console.log('update', v);
    },
  },
  computed: {
    state(): IndexPageState {
      return this.$store.state;
    },
    siteMenu(): SiteMenu | null {
      return this.state.siteMenu;
    },
    menuOption(): MenuOptionsItem | null {
      if (this.siteMenu) {
        return transformSiteMenuOptions(this.siteMenu);
      }
      return null;
    },
  },
  mounted() {
    const navHash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (navHash) {
      try {
        console.log(navHash);
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
          this.menuKey = menuKey;
        }
      } catch (e) {
        console.error(e);
      }
    }
  },
  methods: {
    onUpdate(key: string, item: MenuOptionsItem) {
      const link = item.link;
      if (link) {
        const hashData = JSON.stringify({
          link,
          menuKey: key,
        });
        window.history.replaceState(null, '', `#${hashData}`);
      }
    },
  },
});

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
