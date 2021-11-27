import { createStore } from 'vuex';

export interface SiteMenu {
  icon: string;
  link: string;
  target: string;
  title: string;
  children: SiteMenu[];
}

export interface SiteConfig {
  siteName: string;
}

export interface IndexPageState {
    siteMenu: SiteMenu | null;
    siteConfig: SiteConfig | null;
    iframeSrc: string;
    testValue: string,
}

export function createPageStore() {
  return createStore<IndexPageState>({
    state: {
      siteMenu: null,
      siteConfig: null,
      iframeSrc: '',
      testValue: new Date().toString(),
    },
    actions: {
      async loadSiteMenu() {
        if (this.state.siteMenu) return;
        try {
          const rsp = await this.$axios.get<{
            success: boolean;
            data: SiteMenu
          }>('site-menu/');
          if (rsp.data.success) {
            this.state.siteMenu = rsp.data.data;
          }
        } catch (e) {
          console.error(e);
        }
      },
      async loadSiteConfig() {
        if (this.state.siteConfig) return;
        try {
          const rsp = await this.$axios.get<{
            success: boolean;
            data: SiteConfig
          }>('site-config/');
          if (rsp.data.success) {
            this.state.siteConfig = rsp.data.data;
          }
        } catch (e) {
          console.error(e);
        }
      },
      async loadData() {
        await Promise.all([
          this.dispatch('loadSiteMenu'),
          this.dispatch('loadSiteConfig'),
        ]);
      },
    },
  });
}
