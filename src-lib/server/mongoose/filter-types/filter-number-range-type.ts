import { FilterBaseType } from '../../lib/filter-types/filter-base-type';
import { FilterNumberRangeInterface } from '../../lib/filter-types/filter-number-range-interface';

/**
 * 字符串搜索类型，不仅可用于字符串字段，也可用于数组内的字符串搜索
 */
export class FilterNumberRangeType extends FilterBaseType implements FilterNumberRangeInterface {
  public componentName: 'number-range' = 'number-range';

  /**
    * 获取orm框架的查询条件
    * @param fieldParam 前端组件传上来的参数
    */
  public getConditions(fieldParam: {
    lessThan: number;
    lessEqual: boolean;
    greaterThan: number;
    greaterEqual: boolean;
  }): {
      [key: string]: {
        $lt?: number;
        $lte?: number;
        $gt?: number;
        $gte?: number;
      };
      } {
    if (fieldParam) {
      const params: {
        $lt?: number;
        $lte?: number;
        $gt?: number;
        $gte?: number;
      } = {};

      if (fieldParam.lessThan !== null && !Number.isNaN(fieldParam.lessThan)) {
        if (fieldParam.lessEqual) {
          params.$lte = fieldParam.lessThan;
        } else {
          params.$lt = fieldParam.lessThan;
        }
      }
      if (fieldParam.greaterThan !== null && !Number.isNaN(fieldParam.greaterThan)) {
        if (fieldParam.greaterEqual) {
          params.$gte = fieldParam.greaterThan;
        } else {
          params.$gt = fieldParam.greaterThan;
        }
      }
      if (Object.keys(params).length) {
        return {
          [this.fieldName]: params,
        };
      }
      return {};
    }
    return {};
  }
}
