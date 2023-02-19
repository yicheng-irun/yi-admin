/* eslint-disable class-methods-use-this */
/* eslint-disable @typescript-eslint/no-explicit-any */

export interface FilterBaseTypeConfig {
   /**
    * 气泡提示
    */
   tip?: string;

   /**
    * placeholder
    */
   placeholder?: string;

}

/**
 * 列表过滤的基础类
 */
export interface FilterBaseInterface {
   /**
    * 前端的组件名称
    */
   componentName: string;

   /**
    * 字段名称，对应db中的字段名称
    */
   fieldName: string;

   /**
    * 字段显示名称，对应表单中的label中的名称
    */
   fieldNameAlias: string;

   /**
    * 前端组件的参数
    */
   componentConfig: FilterBaseTypeConfig;

   /**
    * 获取orm框架的查询条件
    * @param fieldParam 前端组件传上来的参数
    */
   getConditions: (fieldParam: any) => {
      [key: string]: any;
   };
}
