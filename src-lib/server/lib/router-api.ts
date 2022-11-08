import express from 'express';
import { apiAction } from '../tools/api-action';
import type { YiAdmin } from './yi-admin';

export function createApiRouter({
  yiAdmin,
  basePath,
}: {
    yiAdmin: YiAdmin;
    basePath: string;
  }) {
  // eslint-disable-next-line new-cap
  const router = express.Router();
  router.get('/site-menu/', apiAction(async () => {
    return {
      success: true,
      data: yiAdmin.siteNavMenu,
    };
  }));
  router.get('/site-config/', apiAction(async () => {
    return {
      success: true,
      data: yiAdmin.siteConfig,
    };
  }));


  return router;
}


