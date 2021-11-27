import { EditBaseType, EditBaseTypeConfig } from './edit-base-type';
import { ListBaseType } from '../list-types/list-base-type';
import { ListNumberRemoteSelectType } from '../list-types/list-number-remote-select-type';
import { JsonReturnType } from '../common-types';

export class EditNumberRemoteSelectType extends EditBaseType {
  /**
    * 前端的组件名称
    */
  public componentName = 'number-remote-select';

  /**
    * 获取可选项
    */
  constructor(config: EditBaseTypeConfig & {
         /**
          * 通过value获取label，用户表单初始化时，传了value给组件但是其实应该显示一个对应的名称
          */
         getLabelByValue?: (value: number) => Promise<string>;
         getOptions: (search: string) => Promise<(number | {
            /**
             * 值
             */
            value: number;
            /**
             * 显示的标签
             */
            label: string;
         })[]>;
      }) {
    super(config);

    if (!config.getOptions || typeof config.getOptions !== 'function') {
      throw new Error('getOptions 不是一个函数');
    }
    this.getOptions = config.getOptions;

    if (config.getLabelByValue) {
      if (typeof config.getLabelByValue !== 'function') throw new Error('getLabelByValue 不是一个函数');
      this.getLabelByValue = config.getLabelByValue;
    }
  }

  public getLabelByValue?: (value: number) => Promise<string>;

  public getOptions: (search: string) => Promise<(number | {
      /**
       * 值
       */
      value: number;
      /**
       * 显示的标签
       */
      label: string;
   })[]>;

  public async action(actionName: string, actionData: any): Promise<JsonReturnType<((number | {
      value: number;
      label: string;
   })[]) | string>> {
    if (actionName === 'getOptions') {
      const options = await this.getOptions(actionData);
      const data = options.map((item) => {
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
      return {
        success: true,
        data,
      };
    }
    if (actionName === 'getLabelByValue') {
      if (this.getLabelByValue) {
        const data = await this.getLabelByValue(actionData);
        return {
          success: true,
          data,
        };
      }
      return actionData;
    }
    throw new Error(`接收到非法actionName ${actionName}`);
  }

  public getListType(): ListBaseType {
    return new ListNumberRemoteSelectType({
      fieldNameAlias: this.fieldNameAlias,
      getLabelByValue: this.getLabelByValue,
    });
  }
}
