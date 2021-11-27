import express from 'express';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createServer } from 'vite';

const app = express();

async function start(): Promise<void> {
  const vite = await createServer({
    root: resolve(__dirname, '../../'),
    server: {
      middlewareMode: 'ssr',
      watch: {
        usePolling: false,
        interval: 100,
      },
    },
  });

  app.use(vite.middlewares);


  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;
      const template = readFileSync(resolve(__dirname, '../../index.html'), 'utf-8').toString();
      const templateT = await vite.transformIndexHtml(url, template);
      const render = (await vite.ssrLoadModule(resolve(__dirname, '../../src/client/entry-server.ts'))).render;

      const [serverRenderHtml, preloadLinks, initState] = (await render(url, {}, resolve(__dirname, '../../'))) as [string, string, {
        page: string;
      }];
      const html = templateT.replace(`<!--preload-links-->`, preloadLinks)
          .replace('<!--app-html-->', serverRenderHtml)
          .replace('<!--init-state-->', `<script type="javascript">var __INIT_STATE__="${JSON.stringify(initState)}"</script>`);
      res.send(html);
    } catch (e) {
      console.error(e);
      res.status(500).send(e);
    }
  });
  app.listen(process.env.PORT || 3001, () => {
    console.log('ok');
  });
}

start().catch(console.error);
