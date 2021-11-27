import Router from '@koa/router';
import { join, resolve, extname } from 'path';
import { existsSync, createReadStream } from 'fs';
import { Context } from 'koa';

export const uploadsRouter = new Router<{}, Context>();


const allowFile = ['.js', '.css', '.html', '.tff', '.woff', '.png', '.jpg', '.gif',
  '.json', '.eot', '.svg', '.swf',
];

const uploadsPath = resolve(__dirname, '../../uploads');
uploadsRouter.get(/uploads\/(.*)/, async (ctx) => {
  const file = ctx.params['0'];
  const filePath = join(uploadsPath, file);
  if (filePath.startsWith(uploadsPath) && existsSync(filePath)) {
    const extName = extname(filePath);
    if (allowFile.includes(extName)) {
      ctx.type = extName;
      ctx.body = createReadStream(filePath);
    }
  }
});

export default uploadsRouter;
