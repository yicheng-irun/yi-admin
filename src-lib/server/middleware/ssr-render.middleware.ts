import express, { Handler } from 'express';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { ViteDevServer } from 'vite';


export type expressRenderFunction = (pagePath: string, ssrParams?: any) => Promise<void>;

type Response = express.Response & {
  yiAdminSSRRender?: expressRenderFunction;
}


export function createExpressSsrMiddleware(param: {
  vite: ViteDevServer;
  baseURL: string;
}): Handler {
  const baseURL = /\/$/.test(param.baseURL) ? param.baseURL : param.baseURL + '/';

  const ssrRender: Handler = function(req: express.Request, res: Response, next) {
    res.yiAdminSSRRender = async (page: string, ssrParams?: any) => {
      console.log(page);
      try {
        const url = req.originalUrl;
        const template = readFileSync(resolve(__dirname, '../../../index.html'), 'utf-8').toString();
        const templateT = await param.vite.transformIndexHtml(url, template);
        const render = (await param.vite.ssrLoadModule(resolve(__dirname, '../../../src/client/entry-server.ts'))).render;

        const [serverRenderHtml, preloadLinks, initState] = (await render(
            page, {
              ssrParams,
              baseURL,
            }, {})) as [string, string, {
          page: string;
        }];
        const html = templateT.replace(`<!--preload-links-->`, preloadLinks)
            .replace('<!--app-html-->', serverRenderHtml)
            .replace('<!--init-state-->', `<script>var __INIT_STATE__=${JSON.stringify(initState)}</script>`);
        res.send(html);
      } catch (e) {
        res.status(500).send(e.message);
      }
    };
    next();
  };

  return ssrRender;
}
