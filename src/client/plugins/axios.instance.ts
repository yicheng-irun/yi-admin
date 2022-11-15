import axios from 'axios';
import { publicPath } from '../lib/public-path';

export const axiosInstance = axios.create({
  baseURL: publicPath,
});

axiosInstance.interceptors.request.use((config) => {
  const url = new window.URL(window.location.href);
  if (!config.params) {
    config.params = {};
  }
  config.params.modelName = url.searchParams.get('modelName');

  return config;
});
