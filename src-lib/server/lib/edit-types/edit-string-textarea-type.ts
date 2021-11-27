import { EditStringType } from './edit-string-type';
import { ListBaseType } from '../list-types/list-base-type';
import { ListStringTextareaType } from '../list-types/list-string-textarea-type';

export class EditStringTextareaType extends EditStringType {
  /**
    * 前端的组件名称
    */
  public componentName = 'string-textarea';

  public getListType(): ListBaseType {
    return new ListStringTextareaType({
      fieldNameAlias: this.fieldNameAlias,
    });
  }
}
