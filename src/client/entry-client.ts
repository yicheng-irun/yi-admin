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
  state: Record<string, unknown>;
  csrfParam: CSRFParam
} =
  // @ts-ignore
  window.__INIT_STATE__ || {
    page: window.location.pathname,
    query: {},
    state: {},
    baseURL: '/',
    csrfParam: {},
  };

async function start() {
  const {
    app,
    store,
  } = await createApp(initState.page, initState.query);
  axiosClientPlugin(initState.baseURL, app, initState.csrfParam);
  if (store) {
    store.replaceState(initState.state);
  }
  app.mount('body>#app', true);
}

start().catch(console.error);
