import { createApp } from './create-app';
import { renderToString } from '@vue/server-renderer';

/**
 * 服务端渲染函数
 * @param page
 * @param manifest
 * @returns
 */
export async function render(page: string, context: {
    query?: Record<string, any>;
    baseURL: string;
    ssrParams: any
  }, manifest: Record<string, string[]>) {
  const { app, store, matchedRouter } = await createApp(page, context.query || {});

  // @ts-ignore
  if (typeof matchedRouter.components.default.fetch === 'function') {
    // @ts-ignore
    await typeof matchedRouter.components.default.fetch({
      store,
    });
  }

  // 生成html字符串
  const ctx: {
      modules?: Set<string>
  } = {};
  const html = await renderToString(app, ctx);

  // 根据打包时生成的服务端预取清单manifest，生成资源预取数组
  const preloadLinks = ctx.modules ?
    renderPreloadLinks(ctx.modules, manifest) :
    [];

  const initState = {
    page,
    query: context.query || {},
    state: store ? store.state : {},
    baseURL: context.baseURL,
  };

  return [html, preloadLinks, initState];
}

function renderPreloadLinks(
    modules: Set<string>,
    manifest: Record<string, string[]>,
) {
  let links = '';
  const seen = new Set<string>();
  modules.forEach((id) => {
    const files = manifest[id];
    if (files) {
      files.forEach((file) => {
        if (!seen.has(file)) {
          seen.add(file);
          links += renderPreloadLink(file);
        }
      });
    }
  });
  return links;
}

function renderPreloadLink(file: string): string {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`;
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`;
  } else if (file.endsWith('.woff')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff" crossorigin>`;
  } else if (file.endsWith('.woff2')) {
    return ` <link rel="preload" href="${file}" as="font" type="font/woff2" crossorigin>`;
  } else if (file.endsWith('.gif')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/gif">`;
  } else if (file.endsWith('.jpg') || file.endsWith('.jpeg')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/jpeg">`;
  } else if (file.endsWith('.png')) {
    return ` <link rel="preload" href="${file}" as="image" type="image/png">`;
  } else {
    // TODO
    return '';
  }
}
