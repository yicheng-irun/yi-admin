import { App, createSSRApp } from 'vue';
import {
  createRouter as _createRouter,
  createWebHistory,
  Router,
  RouteRecordRaw,
} from 'vue-router';
import RootApp from './App.vue';
import NoSsr from './components/no-ssr.vue';
import './components/base-layout.scss';
import { useNaiveUi } from './plugins/naive-ui';
import { publicPath } from './lib/public-path';
import { createPinia } from 'pinia';

// @ts-ignore
const pages = import.meta.glob('./pages/**/*.page.vue');
const routes: RouteRecordRaw[] = [];
Object.keys(pages).forEach((path: string) => {
  const match = path.match(/\.\/pages(.*)\.page\.vue$/);
  if (match) {
    const name = match[1].toLocaleLowerCase();
    let routerPath = name.replace(/\/index$/, '').replace(/^\//, '');
    if (routerPath === 'index') {
      routerPath = '';
    }

    routes.push({
      path: publicPath + routerPath,
      component: pages[path],
    });
  }
});

console.log(routes);

export function createRouter(page: string): Router {
  return _createRouter({
    history: createWebHistory(),
    routes,
  });
}


export async function createApp(): Promise<{
  app: App<Element>;
  router: Router,
  }> {
  const app = createSSRApp(RootApp);
  app.component('no-ssr', NoSsr);
  useNaiveUi(app);

  const router = createRouter( window.location.pathname);
  const pinia = createPinia();
  app.use(pinia);

  // await router.isReady();
  // console.log('router ready');
  app.use(router);

  // console.log(router.currentRoute);

  // if (!router.currentRoute.value.matched.length) {
  //   throw new Error('404');
  // }
  // const [matchedRouter] = router.currentRoute.value.matched;
  // const components = matchedRouter.components;

  // let store: Store<unknown> | undefined;

  // console.log(matchedRouter);

  // // @ts-ignore
  // if (typeof components.default.createStore === 'function') {
  //   // @ts-ignore
  //   store = components.default.createStore({
  //     router,
  //   });
  //   if (store) {
  //     app.use(store);
  //   }
  // }

  return { app, router };
}
