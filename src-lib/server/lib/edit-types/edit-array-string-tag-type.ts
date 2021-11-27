import { EditBaseType, EditBaseComponentConfig, EditBaseTypeConfig } from './edit-base-type';
import { ListBaseType } from '../list-types/list-base-type';
import { ListArrayStringTagType } from '../list-types/list-array-string-tag-type';
import { ReqData, JsonReturnType } from '../common-types';

export class EditArrayStringTagType extends EditBaseType {
  /**
    * 前端的组件名称
    */
  public componentName = 'array-string-tag';

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
   } = {
      ...this.componentConfig,
      minLength: 0,
      maxLength: undefined,
    };

  constructor(
      config: EditBaseTypeConfig & {
         /**
          * 最小长度
          */
         minLength?: number;
         /**
          * 最大长度
          */
         maxLength?: number;
         /**
          * 获取标签
          */
         getTags: (search: string) => Promise<string[]>;
      },
  ) {
    super(config);
    if (typeof config.minLength === 'number') {
      this.componentConfig.minLength = config.minLength;
    }
    if (typeof config.maxLength === 'number') {
      this.componentConfig.maxLength = config.maxLength;
    }
    this.getTags = config.getTags;
  }

  public getTags: (search: string) => Promise<string[]> = (search) => Promise.resolve([String(search).trim()]);

  /**
    * 交给子组件去处理
    * @param actionName
    * @param actionData
    * @param ctx
    */
  public async action(actionName: string, actionData: any, reqData: ReqData): Promise<JsonReturnType> {
    if (actionName === 'getTags') {
      return {
        success: true,
        data: await this.getTags(actionData),
      };
    }
    throw new Error(`接收到非法actionName ${actionName}`);
  }

  public getListType(): ListBaseType {
    return new ListArrayStringTagType({
      fieldNameAlias: this.fieldNameAlias,
    });
  }
}
