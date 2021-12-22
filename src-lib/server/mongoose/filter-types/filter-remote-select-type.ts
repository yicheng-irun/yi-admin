/* eslint-disable class-methods-use-this */
import { FilterBaseType } from '../../lib/filter-types/filter-base-type';
import { FilterRemoteSelectInterface } from '../../lib/filter-types/filter-remote-select-interface';
import { ModelAdminBase } from '../../lib/model-admin-base';
import { FilterBaseTypeConfig } from '../../lib/filter-types/filter-base-interface';
import { MongooseModelAdmin } from '../mongoose-model-admin';
import { ReqData, JsonReturnType } from '../../lib/common-types';

export interface FilterRemoteSelectTypeParam {
   /**
    * 通过value获取label，用户表单初始化时，传了value给组件但是其实应该显示一个对应的名称
    */
   getLabelByValue?: (value: string | number | boolean) => Promise<string>;

   /**
    * 获取可选项
    */
   getOptions?: (search: string, reqData: ReqData, modelAdmin: MongooseModelAdmin) => Promise<({
      /**
       * 值
       */
      value: string | number | boolean;
      /**
       * 显示的标签
       */
      label: string;
   })[]>;
}

/**
 * 字符串远程选择类型，也可用于数组内的字符串的选择
 */
export class FilterRemoteSelectType extends FilterBaseType implements FilterRemoteSelectInterface {
  public componentName: 'remote-select' = 'remote-select';

  public componentConfig: FilterBaseTypeConfig & {
      multiSelect: boolean;
   } = {
      ...this.componentConfig,
      multiSelect: false,
    };

  constructor(config: FilterBaseTypeConfig & FilterRemoteSelectTypeParam & {
      multiSelect?: boolean;
   } = {}) {
    super(config);
    if (config.multiSelect === true) {
      this.componentConfig.multiSelect = true;
    }
    if (typeof config.getLabelByValue === 'function') this.getLabelByValue = config.getLabelByValue;
    if (typeof config.getOptions === 'function') this.getOptions = config.getOptions;
  }

  public getLabelByValue: (value: string | number | boolean) => Promise<string> = (value: string | number | boolean) => Promise.resolve(`${value}`);

  public getOptions: (search: string, reqData: ReqData, modelAdmin: MongooseModelAdmin) => Promise<({
      /**
       * 值
       */
      value: string | number | boolean;
      /**
       * 显示的标签
       */
      label: string;
   })[]> = async (search: string, reqData: ReqData, modelAdmin: MongooseModelAdmin) => {
      const options: ({
         value: string | number | boolean;
         label: string;
      })[] = [];
      const distinctData = await modelAdmin.model.distinct(this.fieldName).exec();
      distinctData.forEach((item) => {
        options.push({
          value: item,
          label: String(item),
        });
      });
      return options;
    };

  /**
    * 前端组件依靠这个来获取action
    * @param actionName
    * @param actionData
    */
  public async action(actionName: string, actionData: any, reqData: ReqData, modelAdmin: ModelAdminBase): Promise<JsonReturnType<({
      label: string;
      value: string | number | boolean;
   }[]) | string>> {
    if (actionName === 'getOptions') {
      const options = await this.getOptions(actionData, reqData, modelAdmin as MongooseModelAdmin);
      return {
        success: true,
        data: options,
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
      return {
        success: true,
        data: actionData,
      };
    }
    throw new Error(`接收到非法actionName ${actionName}`);
  }


  public getConditions(fieldParam: (string | number | boolean) | (string | number | boolean)[]): {
      [key: string]: any;
      } {
    if (fieldParam !== null && fieldParam !== undefined) {
      if (Array.isArray(fieldParam)) {
        if (fieldParam.length > 0) {
          return {
            [this.fieldName]: {
              $in: fieldParam,
            },
          };
        }
      } else {
        return {
          [this.fieldName]: fieldParam,
        };
      }
    }
    return {};
  }
}
