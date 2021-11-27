import { EditBaseType } from './edit-base-type';
import { ListBaseType } from '../list-types/list-base-type';
import { ListBooleanType } from '../list-types/list-boolean-type';

export class EditBooleanType extends EditBaseType {
  /**
    * 前端的组件名称
    */
  public componentName = 'boolean';

  public getListType(): ListBaseType {
    return new ListBooleanType({
      fieldNameAlias: this.fieldNameAlias,
    });
  }
}
