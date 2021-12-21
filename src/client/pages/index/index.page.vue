<template>
  <div id="admin-site-page">
    <div class="admin-header">
      <span
        class="collapse-icon"
        @click="collapsed = !collapsed"
      >
        <Icon :icon="collapsed ? 'zhedie2' : 'zhedie1'" />
      </span>
      <span class="site-name">
        {{ siteConfig?.siteName }}
      </span>
    </div>
    <div class="admin-main">
      <n-layout has-sider>
        <n-layout-sider
          collapse-mode="width"
          :collapsed-width="50"
          :width="240"
          :collapsed="collapsed"
          show-trigger="arrow-circle"
          content-style="padding: 0px;"
          bordered
          @collapse="collapsed = true"
          @expand="collapsed = false"
        >
          <left-block v-if="siteMenu" :collapsed="collapsed" />
        </n-layout-sider>

        <n-layout-content>
          <iframe
            class="main-iframe"
            ref="iframe"
            name="main_frame"
            :src="state.iframeSrc"
          />
        </n-layout-content>
      </n-layout>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { createPageStore, IndexPageState, SiteConfig, SiteMenu } from './index.store';
import Icon from '../../components/Icon.vue';
import LeftBlock from './left-block.vue';

export default defineComponent({
  components: {
    Icon,
    LeftBlock,
  },
  createStore: createPageStore,
  data() {
    return {
      collapsed: false,
    };
  },
  mounted() {
    this.$store.dispatch('loadData').then(() => {
      window.document.title = this.siteConfig?.siteName || 'yi-admin';
    });
  },
  computed: {
    state(): IndexPageState {
      return this.$store.state;
    },
    siteMenu(): SiteMenu | null {
      return this.state.siteMenu;
    },
    siteConfig(): SiteConfig | null {
      return this.state.siteConfig;
    },
  },
});
</script>


<style lang="scss">
html, body {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden
}
#app {
  position: relative;
  width: 100%;
  height: 100%;
}

#admin-site-page {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f5f6f7;
  color: #000a;
  overflow: hidden;
  >.admin-header {
    position: relative;
    top: 0;
    width: 100%;
    min-width: 1100px;
    height: 3em;
    line-height: 3em;
    z-index: 10;
    background: #fff;
    box-shadow: 0 0 0.4em #0001;
    border-bottom: dotted 1px #0002;
    text-align: left;
    >.collapse-icon {
      display: inline-block;
      width: 50px;
      text-align: center;
      box-sizing: border-box;
      border-right: dotted 1px #0002;
      cursor: pointer;
      font-size: 14px;
      &:hover {
          background: #0001
      }
      >i {
        font-size: 1.2em
      }
    }
    >.site-name {
      display: inline-block;
      vertical-align: top;
      font-size: 1.1em;
      padding: 0 1em;
      margin: 0 0.2em;
    }
  }

  >.admin-main {
    position: absolute;
    top: 3em;
    bottom: 0;
    width: 100%;
    min-width: 1100px;
    z-index: 5;

    >.n-layout {
      height: 100%;
    }
    .main-iframe {
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}
</style>
