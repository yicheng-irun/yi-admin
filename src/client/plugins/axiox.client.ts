import { App, inject } from 'vue';
import vuex from 'vuex';
import axios, { AxiosInstance } from 'axios';

const AxiosKey = 'yiadminAxios';

export function axiosClientPlugin(baseURL: string, app: App) {
  const instance = axios.create({
    // baseURL,
  });

  app.provide(AxiosKey, instance);

  app.config.globalProperties.$axios = instance;
  // @ts-ignore
  vuex.Store.prototype.$axios = instance;
}


export function useAxios(): AxiosInstance {
  return inject(AxiosKey) as AxiosInstance;
}
