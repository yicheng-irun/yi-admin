import { App, createSSRApp } from 'vue'
import {
    createMemoryHistory,
    createRouter as _createRouter,
    createWebHistory,
    Router,
    RouteRecordRaw
  } from 'vue-router'
  import RootApp from './App.vue'
  
// Auto generates routes from vue files under ./pages
// https://vitejs.dev/guide/features.html#glob-import
const pages = import.meta.glob('./pages/*.vue')

const routes: RouteRecordRaw[] = [];
  
Object.keys(pages).forEach((path: string) => {
    const match = path.match(/\.\/pages(.*)\.vue$/);
    if (match) {
        const name = match[1].toLocaleLowerCase();
        console.log(path, name)
        routes.push({
            path: name === '/index' ? '/' : name,
            component: pages[path]
        })
    }
})

console.log(routes)

export function createRouter(): Router {
    return _createRouter({
        // use appropriate history implementation for server/client
        // import.meta.env.SSR is injected by Vite.
        history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
        routes
    })
}
  


export function createApp(): {
    app: App<Element>;
    router: Router
} {
    const app = createSSRApp(RootApp);
    const router = createRouter()

    app.use(router)

    return {app, router}
}