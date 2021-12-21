import { ListBaseType } from '../list-types/list-base-type';
import { ListDateTimeType } from '../list-types/list-date-time-type';
import { EditBaseType, EditBaseComponentConfig } from './edit-base-type';

export class EditDateTimeType extends EditBaseType {
  /**
    * 前端的组件名称
    */
  public componentName = 'date-time';

  /**
    * 前端组件的参数
    */
  public componentConfig: EditBaseComponentConfig = {
    ...this.componentConfig,
  };

  public getListType(): ListBaseType {
    return new ListDateTimeType({
      fieldNameAlias: this.fieldNameAlias,
    });
  }
}
