import {createApp} from './create-app';


const initState: {
  page: string;
  state: Record<string, unknown>
} =
  // @ts-ignore
  window.__INIT_STATE__ || {
    page: window.location.pathname,
    state: {},
  };

async function start() {
  const {
    app,
    store,
  } = await createApp(initState.page);

  console.log(JSON.stringify(store?.state));
  if (store) {
    console.log(initState);
    store.replaceState(initState.state);
  }
  app.mount('#app');
}

start().catch(console.error);

// 开启路由后置钩子，进行页面数据请求
// router.afterEach(() => {
//   getAsyncData(router, store, false);
// })
