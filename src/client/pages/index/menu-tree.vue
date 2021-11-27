<template>
  <div class="menu-tree">
    <a-menu
      ref="mainMenu"
      mode="inline"
      :inline-collapsed="collapsed"
      theme="dark"
      @click="clickMenu"
    >
      <sub-menu v-for="(item1, index1) in siteMenus" :key="index1" :site-menu="item1"  />
    </a-menu>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { SiteMenu } from './index.store';
import SubMenu from './sub-menu.vue';


export default defineComponent({
  components: { SubMenu },
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
    siteMenus: {
      type: Array as PropType<SiteMenu[]>,
      default() {
        return [];
      },
    },
  },
  mounted() {
    const navHash = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (navHash) {
      try {
        console.log(navHash);
        const value = JSON.parse(navHash);
        const link = value?.link;
        if (link) {
          window.open(link, 'main_frame');
        }
        const menuPath = value?.menuPath ?? [];
        if (menuPath && Array.isArray(menuPath)) {
          //  this.$refs.mainMenu.setOpenKeys(menuPath);
        }
      } catch (e) {
        console.error(e);
      }
    }
  },
  methods: {
    clickMenu(a: {
       keyPath: (string|number)[],
       item: {
          danger: boolean;
          disabled: boolean;
          icon?: string;
          role?: string;
          title?: string;
          value?: string;
       }
    }) {
      const { keyPath } = a;
      const link = a.item.value;
      if (link) {
        const hashData = JSON.stringify({
          link,
          menuPath: keyPath,
        });
        window.history.replaceState(null, '', `#${hashData}`);
      }
    },
  },

});
</script>
