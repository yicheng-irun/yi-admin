import { Context, Next } from 'koa';

export async function jsonErrorMiddleware(ctx: Context, next: Next): Promise<void> {
  try {
    await next();
  } catch (e) {
    ctx.body = {
      success: false,
      message: e?.message || '出错了',
    };
  }
}
