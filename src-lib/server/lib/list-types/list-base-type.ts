/* eslint-disable @typescript-eslint/no-unused-vars */
import { Files } from 'formidable';
import { JsonReturnType, ReqData } from '../common-types';

export interface ListBaseTypeConfig {
   /**
    * 字段显示名称，对应表单中的label中的名称
    */
   fieldNameAlias?: string;
}

export class ListBaseType {
   /**
    * 前端的组件名称
    */
   public componentName = 'base'

   /**
    * 字段名称，对应db中的字段名称
    */
   public fieldName = ''

   /**
    * 字段显示名称，对应表单中的label中的名称
    */
   public fieldNameAlias: string;

   /**
    * 前端组件的参数
    */
   public componentConfig = {};

   constructor (
      config: ListBaseTypeConfig,
   ) {
      this.fieldNameAlias = config.fieldNameAlias || '';
   }

   // eslint-disable-next-line class-methods-use-this
   public async action (actionName: string, actionData: any, reqData: ReqData): Promise<JsonReturnType> {
      throw new Error('收到非法请求');
   }
}
