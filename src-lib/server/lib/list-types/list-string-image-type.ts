import { ListBaseType, ListBaseTypeConfig } from './list-base-type';

export class ListStringImageType extends ListBaseType {
   /**
    * 前端的组件名称
    */
   public componentName = 'string-image'

   /**
    * 前端组件的参数
    */
   public componentConfig: ListBaseTypeConfig & {
      /**
       * max-width: 10em
       * 120px
       */
      styleMaxWidth: string;
      /**
       * max-width: 6em
       * 72px
       */
      styleMaxHeight: string;
   } = {
      ...this.componentConfig,
      styleMaxWidth: '10em',
      styleMaxHeight: '6em',
   }

   constructor (config: ListBaseTypeConfig & {
      /**
       * max-width: 10em
       * 120px
       */
      styleMaxWidth?: string;
      /**
       * max-width: 6em
       * 72px
       */
      styleMaxHeight?: string;
   }) {
      super(config);
      if (config.styleMaxWidth) this.componentConfig.styleMaxWidth = config.styleMaxWidth;
      if (config.styleMaxHeight) this.componentConfig.styleMaxHeight = config.styleMaxHeight;
   }
}
