import { App } from 'vue';
import vuex from 'vuex';
import axios from 'axios';

export function axiosClientPlugin(baseURL: string, app: App) {
  const instance = axios.create({
    // baseURL,
  });

  app.config.globalProperties.$axios = instance;
  // @ts-ignore
  vuex.Store.prototype.$axios = instance;
}


