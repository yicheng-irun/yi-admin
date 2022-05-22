import { App, inject } from 'vue';
import vuex from 'vuex';
import axios, { AxiosInstance } from 'axios';

const AxiosKey = 'yiadminAxios';

export function axiosClientPlugin(baseURL: string, app: App, csrfParam: {
  query?: {
     [key: string]: string;
  };
  body?: {
     [key: string]: string;
  };
}) {
  const instance = axios.create({
    // baseURL,
  });

  instance.interceptors.request.use((config) => {
    if (config.method === 'post') {
      if (!config.data) {
        config.data = {};
      }
      config.data = {
        ...config.data,
        ...csrfParam.body,
      };
      config.params = {
        ...config.params,
        ...csrfParam.query,
      };
    }
    return config;
  });

  app.provide(AxiosKey, instance);

  app.config.globalProperties.$axios = instance;
  // @ts-ignore
  vuex.Store.prototype.$axios = instance;
}


export function useAxios(): AxiosInstance {
  return inject(AxiosKey) as AxiosInstance;
}
