import { Handler, Request, Response } from 'express';

export interface ResponseData<T> {
    success: boolean;
    msg?: string;
    data: T
}

export class ApiNextError extends Error {

}

export type ApiActionHandler<T = any> = (req: Request, res: Response) => Promise<ResponseData<T>>

/**
 * 接口格式响应函数
 */
export function apiAction<T>(handler: ApiActionHandler<T>): Handler {
  return async (req, res, next) => {
    try {
      const data = await handler(req, res);
      res.json(data);
      return;
    } catch (e) {
      console.error(e);
      if (e instanceof ApiNextError) {
        next();
        return;
      }
      res.json({
        success: false,
        msg: e instanceof Error ? e.message : '接口出错了',
        data: null,
      });
    }
  };
}
