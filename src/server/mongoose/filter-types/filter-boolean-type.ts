/* eslint-disable class-methods-use-this */
import { FilterSelectType } from './filter-select-type';
import { FilterBaseTypeConfig } from '../../lib/filter-types/filter-base-interface';

export class FilterBooleanType extends FilterSelectType {
  constructor(config: FilterBaseTypeConfig = {}) {
    super({
      ...config,
      options: [{
        label: '是',
        value: 'true',
      }, {
        label: '否',
        value: 'false',
      }, {
        label: '全部',
        value: '',
      }],
    });
  }

  public getConditions(fieldParam: string): {
      [key: string]: any;
      } {
    if (fieldParam) {
      return {
        [this.fieldName]: fieldParam === 'true',
      };
    }
    return {};
  }
}
