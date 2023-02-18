import { FilterStringSearchInterface } from '../../lib/filter-types/filter-string-search-interface';
import { FilterBaseType } from '../../lib/filter-types/filter-base-type';
import { FilterBaseTypeConfig } from '../../lib/filter-types/filter-base-interface';

/**
 * 字符串搜索类型，不仅可用于字符串字段，也可用于数组内的字符串搜索
 */
export class FilterStringSearchType extends FilterBaseType implements FilterStringSearchInterface {
  public componentName: 'string-search' = 'string-search';
  public conditionType: string = 'reg'; // 默认为reg

  constructor(config: FilterBaseTypeConfig = {}) {
    const tempConfig = {
      placeholder: '搜索',
      conditionType: 'reg', // 默认是正则
      ...config,
    };
    super({ ...config });
    this.conditionType = tempConfig.conditionType;
  }

  /**
    * 获取orm框架的查询条件
    * @param fieldParam 前端组件传上来的参数
    */
  public getConditions(fieldParam: string, conditionType: 'string' | 'reg' = 'reg'): {
      [key: string]: RegExp | string;
      } {
    if (fieldParam) {
      if (this.conditionType === 'reg') {
        const reg = new RegExp(String(fieldParam).replace(/([*.?+$^[\](){}|\\/])/g, '\\$1'));
        return {
          [this.fieldName]: reg,
        };
      } else if (this.conditionType === 'string') {
        return {
          [this.fieldName]: fieldParam,
        };
      }
    }
    return {};
  }
}
