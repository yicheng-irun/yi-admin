import axios from 'axios';
import { publicPath } from '../lib/public-path';

export const axiosInstance = axios.create({
  baseURL: publicPath,
});

// @ts-expect-error
const csrfParam = (window.csrfParam || {} ) as {
  query?: Record<string, string>;
  body?: Record<string, string>;
};

axiosInstance.interceptors.request.use((config) => {
  const url = new window.URL(window.location.href);
  if (!config.params) {
    config.params = {};
  }
  config.params.modelName = url.searchParams.get('modelName');

  if (config.method === 'post') {
    if (csrfParam.body) {
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
    }
    if (csrfParam.query) {
      config.params = {
        ...config.params,
        ...csrfParam.query,
      };
    }
  }

  return config;
});
