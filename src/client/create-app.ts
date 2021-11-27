import {App, createSSRApp} from 'vue';
import {
  createMemoryHistory,
  createRouter as _createRouter,
  createWebHistory,
  RouteLocationMatched,
  Router,
  RouteRecordRaw,
} from 'vue-router';
import {Store} from 'vuex';
import RootApp from './App.vue';

// @ts-ignore
const pages = import.meta.glob('./pages/**/*.page.vue');
const routes: RouteRecordRaw[] = [];
Object.keys(pages).forEach((path: string) => {
  const match = path.match(/\.\/pages(.*)\.page\.vue$/);
  if (match) {
    const name = match[1].toLocaleLowerCase();
    let routerPath = name.replace(/\/index$/, '');
    if (routerPath === '/index') {
      routerPath = '/';
    }

    routes.push({
      path: routerPath,
      component: pages[path],
    });
  }
});

export function createRouter(): Router {
  return _createRouter({
    // @ts-ignore
    history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
    routes,
  });
}


export async function createApp(page: string): Promise<{
  app: App<Element>;
  router: Router,
  matchedRouter: RouteLocationMatched
  store?: Store<unknown>,
  }> {
  const app = createSSRApp(RootApp);
  const router = createRouter();
  router.push(page);
  app.use(router);

  await router.isReady();
  if (!router.currentRoute.value.matched.length) {
    throw new Error('404');
  }
  const [matchedRouter] = router.currentRoute.value.matched;
  const components = matchedRouter.components;

  let store: Store<unknown> | undefined;
  // @ts-ignore
  if (typeof components.default.createStore === 'function') {
    // @ts-ignore
    store = components.default.createStore();
    if (store) {
      app.use(store);
    }
  }

  return {app, router, matchedRouter, store};
}
