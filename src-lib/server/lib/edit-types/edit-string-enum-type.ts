import { EditBaseType, EditBaseTypeConfig, EditBaseComponentConfig } from './edit-base-type';
import { ListBaseType } from '../list-types/list-base-type';
import { ListStringEnumType } from '../list-types/list-string-enum-type';

export class EditStringEnumType extends EditBaseType {
  /**
    * 前端的组件名称
    */
  public componentName = 'string-enum';

  /**
    * 前端组件的参数
    */
  public componentConfig: EditBaseComponentConfig & {
      /**
       * 枚举值列表, 当require设置为true时，用户必须选择一个enum，require设置为false时，用户可以不选择
       */
      enum: {
         /**
          * 值
          */
         value: string;
         /**
          * 显示的标签
          */
         label: string;
      }[];
   } = {
      ...this.componentConfig,
      enum: [],
    };

  constructor(config: EditBaseTypeConfig & {
         enum: (string | {
            value: string;
            label: string;
         })[];
      }) {
    super(config);
    if (config.enum && Array.isArray(config.enum)) {
      this.componentConfig.enum = config.enum.map((item) => {
        if (typeof item === 'string') {
          return {
            value: item,
            label: item,
          };
        }
        return item;
      });
    }
  }

  public getListType(): ListBaseType {
    return new ListStringEnumType({
      fieldNameAlias: this.fieldNameAlias,
      enum: this.componentConfig.enum,
    });
  }
}
