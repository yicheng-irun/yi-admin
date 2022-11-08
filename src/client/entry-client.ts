// @ts-ignore
const dynamicBasePath = window.__vite_public_path__ || '';
// @ts-ignore
window.__dynamicImportPreload__ = function(preloads: string[]) {
  return preloads.map((preload) => dynamicBasePath + preload);
};

import { createApp } from './create-app';
import { axiosClientPlugin } from './plugins/axiox.client';


interface CSRFParam {
  query?: {
    [key: string]: string;
  };
  body?: {
    [key: string]: string;
  };
}

const initState: {
  page: string;
  query: Record<string, any>;
  baseURL: string;
  csrfParam: CSRFParam
} =
  // @ts-ignore
  window.__INIT_STATE__ || {
    page: window.location.pathname,
    query: {},
    baseURL: '/',
    csrfParam: {},
  };

async function start() {
  const {
    app,
  } = await createApp();
  // @ts-ignore
  axiosClientPlugin(app, initState.csrfParam);

  app.mount('body>#app', true);
}

start().catch(console.error);
