import { ListBaseTypeConfig, ListBaseType } from './list-base-type';


export class ListStringTextareaType extends ListBaseType {
   /**
    * 前端的组件名称
    */
   public componentName = 'string-textarea'

   /**
    * 前端组件的参数
    */
   public componentConfig: ListBaseTypeConfig & {
      /**
       * default: 200
       */
      styleMaxTextLength: number;
   } = {
      ...this.componentConfig,
      styleMaxTextLength: 200,
   }
}
