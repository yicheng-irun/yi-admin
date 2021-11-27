import { EditBaseType, EditBaseComponentConfig, EditBaseTypeConfig } from './edit-base-type';
import { ListBaseType } from '../list-types/list-base-type';
import { ListArrayType } from '../list-types/list-array-type';
import { ReqData, JsonReturnType } from '../common-types';

export class EditArrayType extends EditBaseType {
  /**
    * 前端的组件名称
    */
  public componentName = 'array';

  /**
    * 前端组件的参数
    */
  public componentConfig: EditBaseComponentConfig & {
      /**
      * 最小长度
      */
      minLength: number;
      /**
      * 最大长度
      */
      maxLength?: number;

      /**
       * 数组的子类型
       */
      childrenType: EditBaseType;

      /**
       * 在列表中展示时使用inline的方式
       */
      listStyleInline?: boolean;
   } = {
      ...this.componentConfig,
      minLength: 0,
      maxLength: undefined,
    };

  constructor(
      config: EditBaseTypeConfig & {
         minLength?: number;
         maxLength?: number;

         /**
          * 数组的子类型
          */
         childrenType: EditBaseType;

         /**
          * 设置列表中是否换行
          */
         listStyleInline?: boolean;
      },
  ) {
    super(config);
    if (typeof config.minLength === 'number') {
      this.componentConfig.minLength = config.minLength;
    }
    if (typeof config.maxLength === 'number') {
      this.componentConfig.maxLength = config.maxLength;
    }
    if (config.childrenType instanceof EditBaseType) {
      this.componentConfig.childrenType = config.childrenType;
    } else {
      throw new Error('数组的子类型childrenType 必须是一个EditBaseType');
    }
    this.componentConfig.listStyleInline = config.listStyleInline;
  }

  /**
    * 交给子组件去处理
    * @param actionName
    * @param actionData
    * @param ctx
    * @override
    */
  public async action(actionName: string, actionData: any, reqData: ReqData): Promise<JsonReturnType> {
    const result = await this.componentConfig.childrenType.action(actionName, actionData, reqData);
    return result;
  }

  public getListType(): ListBaseType {
    return new ListArrayType({
      fieldNameAlias: this.fieldNameAlias,
      childrenType: this.componentConfig.childrenType.getListType(),
      listStyleInline: this.componentConfig.listStyleInline,
    });
  }
}
