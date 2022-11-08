import express, { NextFunction } from 'express';
import { ModelAdminBase } from './model-admin-base';
import { SiteNavMenu } from './site-nav-menu';
import { EditTypes, ListTypes } from './types';
import { createExpressRouter } from './router-express';
import { Server } from 'http';

interface CsrfParamResult {
   query?: {
      [key: string]: string;
   };
   body?: {
      [key: string]: string;
   };
}

/**
 * admin站点
 */
export class YiAdmin {
  /**
    * 判断用户是否有权限
    * 如果没有权限，直接在里侧抛出异常
    */
  public permissionExpress: (req: Express.Request, res: Express.Response, next: NextFunction) => any = (req, res, next) => {
    next();
  };

  /**
    * 对应的express路由
    */
  expressRouter: express.Router;

  /**
    * 站点导航菜单
    */
  public siteNavMenu: SiteNavMenu = new SiteNavMenu({
    title: 'root',
  });

  public siteConfig: {
      siteName: string;
   };

  public options: {
      csrfParam?: (req: express.Request,
         res: express.Response) => CsrfParamResult;
   };

  public modelNavMenu: SiteNavMenu = new SiteNavMenu({
    title: '数据模型管理',
  });

  constructor({
    permissionExpress,
    siteConfig = {},
    csrfParam,
  }: {
      permissionExpress?: (req: Express.Request, res: Express.Response, next: NextFunction) => any;
      siteConfig?: {
         siteName?: string;
      };

      /**
       * 获取csrf参数的回调函数
       * 返回的数据会在post请求发起的时候拼入post请求的body或者query中
       */
       csrfParam?: (req: express.Request,
         res: express.Response) => CsrfParamResult;
   }) {
    this.options = {
      csrfParam,
    };

    if (permissionExpress) {
      this.permissionExpress = permissionExpress;
    }

    this.siteNavMenu.add(this.modelNavMenu);

    this.siteConfig = {
      siteName: siteConfig.siteName ?? 'yi-admin',
    };
  }

  public modelAdminsMap: {
    [name: string]: ModelAdminBase;
  } = {};

  createExpressRouter(basePath: string = '/', options: {
    hmr?: {
      server: Server;
      clientPort: number;
    }
  } = {}): Promise<express.Router> {
    return createExpressRouter({
      yiAdmin: this,
      basePath,
    });
  }

  /**
    * 添加一个modelAdmin到yi-admin实例中
    * @param modelAdmin
    */
  addModelAdmin(modelAdmin: ModelAdminBase, {
    addToSiteNavMenu = true,
  }: {
      addToSiteNavMenu?: boolean;
   } = {}): void {
    if (this.modelAdminsMap[modelAdmin.name]) {
      throw new Error(`已经存在一个name为${modelAdmin.name}的model-admin实体在本站点中`);
    }
    this.modelAdminsMap[modelAdmin.name] = modelAdmin;

    if (addToSiteNavMenu) {
      this.modelNavMenu.add(new SiteNavMenu({
        title: `管理 ${modelAdmin.title || modelAdmin.name}`,
        link: `model-admin/${modelAdmin.name}/`,
      }));
    }
  }


  static EditTypes = EditTypes;

  static ListTypes = ListTypes;
}
