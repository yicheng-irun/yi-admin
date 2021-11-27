/* eslint-disable class-methods-use-this */
import { FilterBaseType } from '../../lib/filter-types/filter-base-type';
import { FilterSelectInterface } from '../../lib/filter-types/filter-select-interface';
import { FilterBaseTypeConfig } from '../../lib/filter-types/filter-base-interface';

export class FilterSelectType extends FilterBaseType implements FilterSelectInterface {
  public componentName: 'select' = 'select';

  public componentConfig: FilterBaseTypeConfig & {
      options: {
         label: string;
         value: string | number;
      }[];
      multiSelect: boolean;
   } = {
      ...this.componentConfig,
      options: [],
      multiSelect: false,
    };

  constructor(config: FilterBaseTypeConfig & {
      options: {
         label: string;
         value: string | number;
      }[];
      multiSelect?: boolean;
   }) {
    super(config);
    this.componentConfig.options = config.options;
    if (config.multiSelect === true) {
      this.componentConfig.multiSelect = true;
    }
  }

  public getConditions(fieldParam: (string | number | boolean) | (string | number | boolean)[]): {
      [key: string]: any;
      } {
    if (fieldParam) {
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
