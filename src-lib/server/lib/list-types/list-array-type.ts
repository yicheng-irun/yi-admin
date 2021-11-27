import { ListBaseType, ListBaseTypeConfig } from './list-base-type';
import { ReqData, JsonReturnType } from '../common-types';

export class ListArrayType extends ListBaseType {
  /**
    * 前端的组件名称
    */
  public componentName = 'array';

  /**
    * 前端组件的参数
    */
  public componentConfig: ListBaseTypeConfig & {
      /**
       * 数组的子类型
       */
      childrenType: ListBaseType;

      /**
       * 在列表中展示时使用inline的方式
       */
      listStyleInline: boolean;
   } = {
      ...this.componentConfig,

      listStyleInline: false,
    };

  constructor(config: ListBaseTypeConfig & {
      /**
       * 数组的子类型
       */
      childrenType: ListBaseType;

      /**
       * 在列表中展示时使用inline的方式
       */
      listStyleInline?: boolean;
   }) {
    super(config);
    if (config.childrenType instanceof ListBaseType) {
      this.componentConfig.childrenType = config.childrenType;
    } else {
      throw new Error('数组的子类型childrenType 必须是一个ListBaseType');
    }

    if (typeof config.listStyleInline === 'boolean') {
      this.componentConfig.listStyleInline = config.listStyleInline;
    }
  }


  /**
    * 交给子组件去处理
    * @param actionName
    * @param actionData
    * @param ctx
    */
  public async action(actionName: string, actionData: any, reqData: ReqData): Promise<JsonReturnType> {
    const result = await this.componentConfig.childrenType.action(actionName, actionData, reqData);
    return result;
  }
}
