import { createApp } from "./create-app";
import { renderToString } from "@vue/server-renderer";

export async function render(url: string, manifest: Record<string, string[]>) {
  const { app, router } = createApp();

  // 同步url
  router.push(url);
//   store.$setSsrPath(url);
  await router.isReady();
  // 新加 + 当路由准备完毕，调用自定义钩子，在服务端获取数据
//   await getAsyncData(router, store, true);

  // 生成html字符串
  const ctx: {
      modules?: string[]
  } = {};
  const html = await renderToString(app, ctx);

  // 根据打包时生成的服务端预取清单manifest，生成资源预取数组
  const preloadLinks = ctx.modules
    ? renderPreloadLinks(ctx.modules, manifest)
    : [];
  return [html, preloadLinks];
}

function renderPreloadLinks(modules: string[], manifest: Record<string, string[]>) {
    let links = ''
    const seen = new Set<string>()
    modules.forEach((id) => {
      const files = manifest[id]
      if (files) {
        files.forEach((file) => {
          if (!seen.has(file)) {
            seen.add(file)
            links += renderPreloadLink(file)
          }
        })
      }
    })
    return links
  }
  
  function renderPreloadLink(file: string) {
    if (file.endsWith('.js')) {
      return `<link rel="modulepreload" crossorigin href="${file}">`
    } else if (file.endsWith('.css')) {
      return `<link rel="stylesheet" href="${file}">`
    } else {
      // TODO
      return ''
    }
  }
