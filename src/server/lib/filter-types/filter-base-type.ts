/* eslint-disable class-methods-use-this */
import { FilterBaseInterface, FilterBaseTypeConfig } from './filter-base-interface';
import { ModelAdminBase } from '../model-admin-base';
import { ReqData, JsonReturnType } from '../common-types';


export class FilterBaseType implements FilterBaseInterface {
  public componentName: string;

  public fieldName: string;

  public fieldNameAlias: string;

  public componentConfig: FilterBaseTypeConfig = {

  };

  constructor(config: FilterBaseTypeConfig = {}) {
    if (config.tip) {
      this.componentConfig.tip = config.tip;
    }
    this.componentConfig.placeholder = config.placeholder || '';
  }

  /**
    * 前端过滤器组件通过这个action来拉取数据
    * @param actionName 操作名称
    * @param actionData 动作数据
    */
  public async action(actionName: string, actionData: any, reqData: ReqData, modelAdmin: ModelAdminBase): Promise<JsonReturnType> {
    throw new Error(`接收到非法actionName ${actionName}`);
  }

  /**
    * 获取orm框架的查询条件
    * @param fieldParam 前端组件传上来的参数
    */
  getConditions(fieldParam: any): {
         [key: string]: any;
      } {
    throw new Error('请在子类中实现这个函数');
  }
}
