/* eslint-disable @typescript-eslint/no-unused-vars */
import { ListBaseType } from '../list-types/list-base-type';
import { ReqData, JsonReturnType } from '../common-types';


export interface EditBaseTypeConfig {
   required?: boolean;

   /**
    * 字段显示名称，对应表单中的label中的名称
    */
   fieldNameAlias?: string;

   /**
    * 编辑组件的下方的帮助提示文本
    */
   helpText?: string;
}

export interface EditBaseComponentConfig {
   /**
    * 是否必填
    */
   required: boolean;

   helpText: string;
}

export class EditBaseType {
  /**
    * 前端的组件名称
    */
  public componentName = 'base';

  /**
    * 字段名称，对应db中的字段名称
    */
  public fieldName = '';

  /**
    * 字段显示名称，对应表单中的label中的名称
    */
  public fieldNameAlias: string;

  /**
    * 前端组件的参数
    */
  public componentConfig: EditBaseComponentConfig = {
    required: false,

    helpText: '',
  };

  constructor(
      config: EditBaseTypeConfig,
  ) {
    this.componentConfig.required = config.required || false;
    this.componentConfig.helpText = config.helpText || '';
    this.fieldNameAlias = config.fieldNameAlias || '';
  }

  // eslint-disable-next-line class-methods-use-this
  public async action(actionName: string, actionData: any, reqData: ReqData): Promise<JsonReturnType> {
    throw new Error(`接收到非法actionName ${actionName}`);
  }

  /**
    * 实现 edit-type 生成对应的 list-type
    */
  public getListType(): ListBaseType {
    return new ListBaseType({
      fieldNameAlias: this.fieldNameAlias,
    });
  }
}
