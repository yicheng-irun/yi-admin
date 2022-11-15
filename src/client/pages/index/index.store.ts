import { defineStore } from 'pinia';
import { axiosInstance } from '../../plugins/axios.instance';
import { menuLinkCheck } from './menu-link-check';

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
}

export const useStore = defineStore('indexPage', {
  state() {
    const state: IndexPageState = {
      siteMenu: null,
      siteConfig: null,
      iframeSrc: '',
    };
    return state;
  },
  actions: {
    async loadSiteMenu() {
      if (this.siteMenu) return;
      try {
        const rsp = await axiosInstance.get<{
            success: boolean;
            data: SiteMenu
          }>('/api/site-menu/');
        if (rsp.data.success) {
          menuLinkCheck(rsp.data.data);
          this.siteMenu = rsp.data.data;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async loadSiteConfig() {
      if (this.siteConfig) return;
      try {
        const rsp = await axiosInstance.get<{
            success: boolean;
            data: SiteConfig
          }>('/api/site-config/');
        if (rsp.data.success) {
          this.siteConfig = rsp.data.data;
        }
      } catch (e) {
        console.error(e);
      }
    },
    async loadData() {
      await Promise.all([
        this.loadSiteMenu(),
        this.loadSiteConfig(),
      ]);
    },
  },
});
