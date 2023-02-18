import express from 'express';
import Koa from 'koa';
import mongoose from 'mongoose';
import { config } from 'dotenv';
import { resolve } from 'path';
import myadmin from './admin';
import myadmin2 from './admin2';
import uploadsRouter from './uploads-router';
import { getEnv } from './get-env';
import koaConnect from 'koa-connect';
import { createServer } from 'http';
import { Book, sequelizeObj } from './sequelizeModels/book.model';


config();

const MONGODB_URI = getEnv('MONGODB_URI', 'mongodb://localhost:27017/');

export default async function createApp(): Promise<Koa> {
  await mongoose.connect(MONGODB_URI, { });

  const app = new Koa();

  const adminRouter1 = await myadmin.createExpressRouter('/router1/');
  const adminRouter2 = await myadmin2.createExpressRouter('/router2/');

  // @ts-ignore
  app.use(koaConnect((...t) => adminRouter1(...t)));
  // @ts-ignore
  app.use(koaConnect((...t) => adminRouter2(...t)));

  app.use(uploadsRouter.routes());

  return app;
}

export async function createApp2() {
  // 连接mongoosedb数据库
  await mongoose.connect(MONGODB_URI, {});
  // sequlize连接mysql数据库


  // 验证是否连接成功
  sequelizeObj.authenticate().then(async () => {
    console.log('Connection has been established successfully.');
    Book.sync({
      alter: true,
    }).then((res) => {
      console.log('res:==', res);
    });
    // Book.sync();
  }).catch((err) => {
    console.error('Unable to connect to the database:', err);
  });
  // await sequelizeObj.sync({ force: true });
  const app = express();
  const server = createServer(app);

  app.use('/uploads', express.static(resolve(__dirname, '../../uploads')));

  app.use('/test/', await myadmin.createExpressRouter('/test/', { }));

  app.use('/test2/', await myadmin2.createExpressRouter('/test2/', { }));

  return server;
}

async function start(): Promise<void> {
  const app = await createApp2();

  const port = Number.parseInt(getEnv('PORT', '5000'), 10);
  const host = getEnv('HOST', '0.0.0.0');

  app.listen(port, host, () => {
    console.log(`server is listening on ${host}:${port}`);
  });
}

start().catch(console.error);
