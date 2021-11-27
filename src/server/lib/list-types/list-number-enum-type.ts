import { ListBaseType, ListBaseTypeConfig } from './list-base-type';

export class ListNumberEnumType extends ListBaseType {
   /**
    * 前端的组件名称
    */
   public componentName = 'string-enum'

   /**
    * 前端组件的参数
    */
   public componentConfig: ListBaseTypeConfig & {
      /**
       * 枚举值列表, 当require设置为true时，用户必须选择一个enum，require设置为false时，用户可以不选择
       */
      enum: {
         /**
          * 值
          */
         value: number;
         /**
          * 显示的标签
          */
         label: string;
      }[];
   } = {
      ...this.componentConfig,
      enum: [],
   }

   constructor (config: ListBaseTypeConfig & {
      enum: (number | {
         value: number;
         label: string;
      })[];
   }) {
      super(config);
      if (config.enum && Array.isArray(config.enum)) {
         this.componentConfig.enum = config.enum.map((item) => {
            if (typeof item === 'number') {
               return {
                  value: item,
                  label: String(item),
               };
            }
            if (typeof item === 'string') {
               const t = Number(item);
               return {
                  value: t,
                  label: String(item),
               };
            }
            return item;
         });
      }
   }
}
