import express, { NextFunction } from 'express';
import { resolve } from 'path';
import url, { URL } from 'url';
import bodyParse from 'co-body';
import { IncomingForm, Files, Fields } from 'formidable';
import { YiAdmin } from './yi-admin';
import { EditBaseType } from './edit-types/edit-base-type';
import { ListBaseType } from './list-types/list-base-type';
import { FilterBaseType } from './filter-types/filter-base-type';
import { ModelAdminListAction } from '..';
import { createServer } from 'vite';
import { createExpressSsrMiddleware, expressRenderFunction } from '../middleware/ssr-render.middleware';

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

function safeJson(func: (req: express.Request, res: express.Response) => any): express.Handler {
  return async (req: express.Request, res: express.Response): Promise<void> => {
    try {
      await func(req, res);
    } catch (e) {
      console.error(e);
      res.json({
        success: false,
        data: null,
        message: e?.message ?? '',
      });
    }
  };
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

  // 获取表单编辑页的字段
  modelRouter.get('/edit/fields/', safeJson((req, res: Response) => {
    const { modelName } = req.params;
    const modelAdmin = yiAdmin.modelAdminsMap[modelName];
    const fields = modelAdmin.getEditFormFieldsAfterFilter();
    res.json({
      success: true,
      data: {
        fields,
        modelInfo: {
          title: modelAdmin.title,
          name: modelAdmin.name,
        },
      },
    });
  }));

  modelRouter.get('/edit/values/', safeJson(async (req, res: Response) => {
    const { modelName } = req.params;
    const { id } = req.query;
    const values = await yiAdmin.modelAdminsMap[modelName].getEditData(String(id), {
      req, res,
    });
    res.json({
      success: true,
      data: values,
    });
  }));

  // 表单组件的请求
  modelRouter.all('/edit/component-action/', safeJson(async (req: Request, res: Response) => {
    const { modelName } = req.params;
    const fields = yiAdmin.modelAdminsMap[modelName].getEditFormFields();
    const { fieldName, actionName, actionData } = {
      ...req.query,
      ...req.body,
    } as Record<string, any>;

    let editField: EditBaseType | null = null;

    for (let i = 0; i < fields.length; i += 1) {
      const f = fields[i];
      if (f.fieldName === fieldName) {
        editField = f;
        break;
      }
    }

    if (editField) {
      const result = await editField.action(actionName, actionData, {
        method: req.method.toUpperCase(),
        query: req.query,
        body: req.body,
        files: req.files,
      });
      if (result !== undefined) {
        res.json(result);
        return;
      }
    }

    res.json({
      success: false,
      message: '未找到该字段对应的组件',
    });
  }));

  modelRouter.post('/edit/submit/', safeJson(async (req, res: Response) => {
    const { modelName } = req.params;
    const { editId = '', formData = {} } = req.body;
    const value = await yiAdmin.modelAdminsMap[modelName].formSubmit(editId, formData, { req, res });
    res.json({
      success: true,
      data: value,
    });
  }));

  /**
    * 拉取列表页的字段信息
    */
  modelRouter.get('/list/fields/', safeJson((req, res: Response) => {
    const { modelName } = req.params;
    const modelAdmin = yiAdmin.modelAdminsMap[modelName];
    const fields = modelAdmin.getDataListFieldsAfterFilter();
    const filterFields = modelAdmin.getFilterFields();
    res.json({
      success: true,
      data: {
        fields,
        filterFields,
        modelInfo: {
          title: modelAdmin.title,
          name: modelAdmin.name,
        },
      },
    });
  }));

  /**
       * 拉取列表页的字段信息
       */
  modelRouter.get('/list/actions/', safeJson((req, res: Response) => {
    const { modelName } = req.params;
    const actions = yiAdmin.modelAdminsMap[modelName].listActions;
    res.json({
      success: true,
      data: actions,
    });
  }));

  // 表单组件的请求
  modelRouter.post('/list/component-action/', safeJson(async (req: Request, res: Response) => {
    const { modelName } = req.params;
    const fields = yiAdmin.modelAdminsMap[modelName].getDataListFields();

    const { fieldName, actionName, actionData } = {
      ...req.query,
      ...req.body,
    } as Record<string, any>;
    let listField: ListBaseType | null = null;

    for (let i = 0; i < fields.length; i += 1) {
      const f = fields[i];
      if (f.fieldName === fieldName) {
        listField = f;
        break;
      }
    }

    if (listField) {
      const result = await listField.action(actionName, actionData, {
        method: req.method.toUpperCase(),
        query: req.query,
        body: req.body,
        files: req.files,
      });
      if (result !== undefined) {
        res.json(result);
      }
      return;
    }

    res.json({
      success: false,
      message: '未找到该字段对应的组件',
    });
  }));

  // filter组件的请求
  modelRouter.post('/list/filter-component-action/', safeJson(async (req: Request, res: Response) => {
    const { modelName } = req.params;
    const fields = yiAdmin.modelAdminsMap[modelName].getFilterFields();

    const { fieldName, actionName, actionData } = {
      ...req.query,
      ...req.body,
    } as Record<string, any>;
    let listFilterField: FilterBaseType | null = null;

    for (let i = 0; i < fields.length; i += 1) {
      const f = fields[i];
      if (f.fieldName === fieldName) {
        listFilterField = f;
        break;
      }
    }

    if (listFilterField) {
      const result = await listFilterField.action(actionName, actionData, {
        method: req.method.toUpperCase(),
        query: req.query,
        body: req.body,
        files: req.files,
      }, yiAdmin.modelAdminsMap[modelName]);
      if (result !== undefined) {
        res.json(result);
      }
      return;
    }

    res.json({
      success: false,
      message: '未找到该字段对应的组件',
    });
  }));

  /**
       * 拉取列表页的数据
       */
  modelRouter.get('/list/data/', safeJson(async (req, res: Response) => {
    const { modelName } = req.params;
    const {
      pageIndex = '1', pageSize = '10', sort = '', filter = '{}',
    } = req.query;
    const pageIndexNumber = Number.parseInt(String(pageIndex), 10);
    const pageSizeNumber = Number.parseInt(String(pageSize), 10);
    if (typeof pageIndexNumber !== 'number' || pageIndexNumber < 1) throw new Error('pageIndex必须是>=1的整数');
    if (typeof pageSizeNumber !== 'number' || pageSizeNumber < 1) throw new Error('pageSize必须是>=1的整数');

    const filterData = JSON.parse(String(filter));
    const parsedFilter: {
            [key: string]: any;
         } = {
           ...filterData,
         };
    const filterFields = yiAdmin.modelAdminsMap[modelName].getFilterFields();
    filterFields.forEach((filterItem: { fieldName: string | number; getConditions: (arg0: any) => any }) => {
      if (Object.prototype.hasOwnProperty.call(filterData, filterItem.fieldName)) {
        const condition = filterItem.getConditions(filterData[filterItem.fieldName]);
        delete parsedFilter[filterItem.fieldName];
        Object.assign(parsedFilter, condition);
      }
    });

    const afterFilterData = await yiAdmin.modelAdminsMap[modelName].getDataListAfterFilter({
      pageIndex: pageIndexNumber,
      pageSize: pageSizeNumber,
      sort: String(sort),
      conditions: parsedFilter,
    }, { req, res });
    res.json({
      success: true,
      data: afterFilterData,
    });
  }));

  /**
    * 执行列表操作
    */
  modelRouter.post('/list/action/', safeJson(async (req, res: Response) => {
    const { modelName } = req.params;
    const actions = yiAdmin.modelAdminsMap[modelName].listActions;
    const {
      actionName = '',
      idList = [],
    } = req.body;

    let action: ModelAdminListAction | null = null;
    for (let i = 0; i < actions.length; i += 1) {
      if (actions[i].actionName === actionName) {
        action = actions[i];
        break;
      }
    }

    if (!action) throw new Error('未找到对应的操作动作');

    const result = await action.actionFunc(idList);

    res.json({
      success: true,
      data: result || {
        successfulNum: 0,
        failedNum: 0,
      },
    });
  }));

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
  // eslint-disable-next-line new-cap
  const router = express.Router();

  const vite = await createServer({
    root: resolve(__dirname, '../../../'),
    base: basePath,
    server: {
      middlewareMode: 'ssr',
      watch: {
        usePolling: false,
        interval: 100,
      },
    },
  });

  router.use(vite.middlewares);

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


  router.use(createExpressSsrMiddleware({
    vite,
    baseURL: basePath,
  }));

  router.use((req, res, next) => {
    yiAdmin.permissionExpress(req, res, next);
  });

  router.get('/', checkRedirectMiddleware, async (req: express.Request, res: Response) => {
    if (res.yiAdminSSRRender) {
      await res.yiAdminSSRRender('/', getBaseRenderSSRParams(yiAdmin, req, res, ''));
    }
  });
  router.get('/site-menu/', safeJson(async (req, res) => {
    res.json({
      success: true,
      data: yiAdmin.siteNavMenu,
    });
  }));
  router.get('/site-config/', safeJson(async (req, res) => {
    res.json({
      success: true,
      data: yiAdmin.siteConfig,
    });
  }));

  appendModelAdminRouter(yiAdmin, router);

  return router;
}
