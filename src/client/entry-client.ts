import { createApp } from './create-app';
import { axiosClientPlugin } from './plugins/axiox.client';
import './components/base-layout.scss';
import 'ant-design-vue/dist/antd.css';


const initState: {
  page: string;
  query: Record<string, any>;
  baseURL: string;
  state: Record<string, unknown>;
} =
  // @ts-ignore
  window.__INIT_STATE__ || {
    page: window.location.pathname,
    query: {},
    state: {},
    baseURL: '/',
  };

async function start() {
  const {
    app,
    store,
  } = await createApp(initState.page, initState.query);
  axiosClientPlugin(initState.baseURL, app);
  if (store) {
    store.replaceState(initState.state);
  }
  app.mount('#app');
}

start().catch(console.error);

// 开启路由后置钩子，进行页面数据请求
// router.afterEach(() => {
//   getAsyncData(router, store, false);
// })
