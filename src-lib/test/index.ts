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

config();

process.env.YI_ADMIN_DEV_MODE = 'false';

const MONGODB_URI = getEnv('MONGODB_URI', 'mongodb://localhost:27017/');

export default async function createApp(): Promise<Koa> {
  await mongoose.connect(MONGODB_URI, { });

  const app = new Koa();

  const adminRouter1 = await myadmin.createExpressRouter('/router1');
  const adminRouter2 = await myadmin2.createExpressRouter('/router2');

  // @ts-ignore
  app.use(koaConnect((...t) => adminRouter1(...t)));
  // @ts-ignore
  app.use(koaConnect((...t) => adminRouter2(...t)));

  app.use(uploadsRouter.routes());

  return app;
}

export async function createApp2(): Promise<express.Application> {
  await mongoose.connect(MONGODB_URI, {});

  const app = express();

  app.use('/uploads', express.static(resolve(__dirname, '../../uploads')));

  app.use('/test', await myadmin.createExpressRouter('/test'));

  app.use('/test2', await myadmin2.createExpressRouter('/test2'));

  return app;
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
