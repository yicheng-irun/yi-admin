import { App, createSSRApp } from 'vue';
import {
  createMemoryHistory,
  createRouter as _createRouter,
  RouteLocationMatched,
  Router,
  RouteRecordRaw,
} from 'vue-router';
import { Store } from 'vuex';
import RootApp from './App.vue';
import NoSsr from './components/no-ssr.vue';
import './components/base-layout.scss';
import { useNaiveUi } from './plugins/naive-ui';
import { publicPath } from './lib/public-path';

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

console.log(routes)

export function createRouter(page: string): Router {
  return _createRouter({
    history: createMemoryHistory(),
    routes,
  });
}


export async function createApp(): Promise<{
  app: App<Element>;
  router: Router,
  matchedRouter: RouteLocationMatched
  store?: Store<unknown>,
  }> {
  const app = createSSRApp(RootApp);
  app.component('no-ssr', NoSsr);
  // useAntDesign(app);
  useNaiveUi(app);


  const router = createRouter( window.location.pathname);

  await router.isReady();
  app.use(router);

  if (!router.currentRoute.value.matched.length) {
    throw new Error('404');
  }
  const [matchedRouter] = router.currentRoute.value.matched;
  const components = matchedRouter.components;

  let store: Store<unknown> | undefined;

  console.log(matchedRouter)

  // @ts-ignore
  if (typeof components.default.createStore === 'function') {
    // @ts-ignore
    store = components.default.createStore({
      router,
    });
    if (store) {
      app.use(store);
    }
  }

  return { app, router, matchedRouter, store };
}
