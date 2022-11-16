import express, { Handler, NextFunction } from 'express';
import { resolve } from 'path';
import url, { URL } from 'url';
import bodyParse from 'co-body';
import { IncomingForm, Files, Fields } from 'formidable';
import { YiAdmin } from './yi-admin';
import { expressRenderFunction } from '../middleware/ssr-render.middleware';
import { readFileSync } from 'fs';
import { createApiRouter } from './router-api';

type Response = express.Response & {
   yiAdminSSRRender?: expressRenderFunction;
}

type Request = express.Request & {
   files?: Files;
}

function getFieldsAndFiles(req: express.Request): Promise<{
   fields: Fields;
   files: Files;
}> {
  return new Promise((resolveFunc, reject) => {
    // @ts-ignore
    const form = new IncomingForm({ multiples: true });
    form.parse(req, (err: Error, fields: any, files: Files) => {
      if (err) {
        reject(err);
        return;
      }
      resolveFunc({
        fields,
        files,
      });
    });
  });
}


function getBaseRenderSSRParams(yiAdmin: YiAdmin, req: express.Request, res: express.Response, rootPath = '../'): {
   assetsPath: string;
   csrfParam: {
      query?: {
         [key: string]: string;
      };
      body?: {
         [key: string]: string;
      };
   };
} {
  return {
    assetsPath: rootPath ? url.resolve(req.baseUrl, `${rootPath}__yi-admin-assets__/`) : `${req.baseUrl}/__yi-admin-assets__/`,
    csrfParam: yiAdmin.options.csrfParam ? yiAdmin.options.csrfParam(
        req,
        res,
    ) : {},
  };
}

function checkRedirectMiddleware(req: Request, res: Response, next): boolean {
  const url = new URL('https://test.com' + req.originalUrl);
  if (!url.pathname.endsWith('/')) {
    url.pathname += '/';
    res.redirect(url.pathname + url.search);
    return;
  }
  next();
}

function appendModelAdminRouter(yiAdmin: YiAdmin, router: express.Router): void {
  // eslint-disable-next-line new-cap
  const modelRouter = express.Router({
    mergeParams: true,
  });

  modelRouter.get('/', checkRedirectMiddleware, async (req, res: Response) => {
    if (res.yiAdminSSRRender) {
      await res.yiAdminSSRRender('/model-admin-list', getBaseRenderSSRParams(yiAdmin, req, res));
    }
  });

  modelRouter.get('/edit/', checkRedirectMiddleware, async (req, res: Response) => {
    if (res.yiAdminSSRRender) {
      await res.yiAdminSSRRender('/model-admin-edit', getBaseRenderSSRParams(yiAdmin, req, res));
    }
  });


  /**
    * 挂载统一路由
    */
  router.use('/model-admin/:modelName', async (req, res: Response, next: NextFunction) => {
    const { modelName } = req.params;
    if (Object.prototype.hasOwnProperty.call(yiAdmin.modelAdminsMap, modelName)) {
      next();
    } else {
      res.sendStatus(404);
    }
  }, modelRouter);
}


export async function createExpressRouter({
  yiAdmin,
  basePath,
}: {
  yiAdmin: YiAdmin;
  basePath: string;
}): Promise<express.Router> {
  if (!basePath.endsWith('/')) {
    throw new Error('"basePath" option should end with a slash');
  }

  // eslint-disable-next-line new-cap
  const router = express.Router();

  const clientStaticPath = resolve(__dirname, '../../../static');
  router.use('/__yi-admin-assets__/static', express.static(clientStaticPath));

  router.use(async (req: Request, res, next) => {
    if (req.body) {
      next();
      return;
    }
    try {
      const contentType = req.headers['content-type'] ?? '';
      if (/^multipart\/form-data;/.test(contentType)) {
        const t = await getFieldsAndFiles(req);
        req.body = t.fields;
        req.files = t.files;
      } else if (/^application\/json/.test(contentType)) {
        req.body = await bodyParse.json(req, {
          limit: '10mb',
        });
      }
    } catch (e) {
      next(e);
      return;
    }
    next();
  });

  router.use((req, res, next) => {
    yiAdmin.permissionExpress(req, res, next);
  });


  appendModelAdminRouter(yiAdmin, router);
  router.use('/api', createApiRouter({
    yiAdmin,
    basePath,
  }));


  const assetsPath = resolve(__dirname, '../../../dist/client/assets');
  router.use('/assets', express.static(assetsPath));

  const handler: Handler = (req, res) => {
    const html = readFileSync(resolve(__dirname, '../../../dist/client/index.html')).toString()
        .replace('window._publicPath="/"', 'window._publicPath="' + basePath + '"');
    res.type('html').send(html);
  };
  router.get('/', handler);
  router.get('/list', handler);
  router.get('/edit', handler);

  return router;
}
