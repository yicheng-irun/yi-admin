import express, { Handler } from 'express';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import type { ViteDevServer } from 'vite';


export type expressRenderFunction = (pagePath: string, ssrParams?: any) => Promise<void>;

type Response = express.Response & {
  yiAdminSSRRender?: expressRenderFunction;
}


export async function createExpressSsrMiddleware(param: {
  vite?: ViteDevServer;
  baseURL: string;
}): Promise<Handler> {
  const baseURL = /\/$/.test(param.baseURL) ? param.baseURL : param.baseURL + '/';

  const template = param.vite ?
  readFileSync(resolve(__dirname, '../../../index.html'), 'utf-8').toString() :
  readFileSync(resolve(__dirname, '../../../dist/client/index.html'), 'utf-8').toString().replace('<!--dynamic-import-config-->', `<script>window.__vite_public_path__ = "${baseURL.replace(/^\//, '')}"</script>`);

  const manifest = param.vite ? {} : (await import('../../../dist/client/ssr-manifest.json'));

  const ssrRender: Handler = function(req: express.Request, res: Response, next) {
    res.yiAdminSSRRender = async (page: string, ssrParams?: any) => {
      try {
        const url = req.originalUrl;
        const templateT = param.vite ? await param.vite.transformIndexHtml(url, template) : template;
        const render = param.vite ? (await param.vite.ssrLoadModule(resolve(__dirname, '../../../src/client/entry-server.ts'))).render :
          (await import('../../../dist/server/entry-server')).render;

        const [serverRenderHtml, preloadLinks, initState] = (await render(
            page, {
              ssrParams,
              baseURL,
              query: req.query,
            }, manifest)) as [string, string, {
          page: string;
        }];
        const html = templateT.replace(`<!--preload-links-->`, preloadLinks)
            .replace(/="\/assets\//g, () => {
              return `="${baseURL}assets/`;
            })
            .replace('<!--app-html-->', serverRenderHtml)
            .replace('<!--init-state-->', `<script>var __INIT_STATE__=${JSON.stringify(initState)}</script>`);
        res.send(html);
      } catch (e) {
        if (param.vite) {
          param.vite.ssrFixStacktrace(e);
        }
        console.error(e);
        res.status(500).send(e.message);
      }
    };
    next();
  };

  return ssrRender;
}
