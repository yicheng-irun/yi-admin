import { ListBaseType, ListBaseTypeConfig } from './list-base-type';
import { JsonReturnType } from '../common-types';

export class ListNumberRemoteSelectType extends ListBaseType {
   /**
    * 前端的组件名称
    */
   public componentName = 'string-remote-select'

   constructor (config: ListBaseTypeConfig & {
      /**
       * 通过value获取label，用户表单初始化时，传了value给组件但是其实应该显示一个对应的名称
       */
      getLabelByValue?: (value: number) => Promise<string>;
   }) {
      super(config);
      if (config.getLabelByValue) {
         if (typeof config.getLabelByValue !== 'function') throw new Error('getLabelByValue 不是一个函数');
         this.getLabelByValue = config.getLabelByValue;
      }
   }

   public getLabelByValue?: (value: number) => Promise<string>;

   public async action (actionName: string, actionData: any): Promise<JsonReturnType<string>> {
      if (actionName === 'getLabelByValue') {
         const t = Number(actionData);
         if (this.getLabelByValue) {
            const data = await this.getLabelByValue(t);
            return {
               success: true,
               data,
            };
         }
         return {
            success: true,
            data: actionData,
         };
      }
      throw new Error(`接收到非法actionName ${actionName}`);
   }
}
