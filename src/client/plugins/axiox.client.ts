import { App, inject } from 'vue';
import vuex from 'vuex';
import axios, { AxiosInstance } from 'axios';

const AxiosKey = 'yiadminAxios';

export function axiosClientPlugin(app: App, csrfParam: {
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
      if (config.data instanceof FormData) {
        if (csrfParam.body) {
          Object.keys(csrfParam.body).forEach((key) => {
            config.data.append(key, csrfParam.body?.[key]);
          });
        }
      } else if (typeof config.data === 'object') {
        config.data = {
          ...config.data,
          ...csrfParam.body,
        };
      } else {
        config.data = {
          ...csrfParam.body,
        };
      }
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
