import { EditStringType } from './edit-string-type';
import { ListBaseType } from '../list-types/list-base-type';
import { ListStringTextareaType } from '../list-types/list-string-textarea-type';

export class EditStringJsonType extends EditStringType {
  /**
    * 前端的组件名称
    */
  public componentName = 'string-json';

  public getListType(): ListBaseType {
    return new ListStringTextareaType({
      fieldNameAlias: this.fieldNameAlias,
    });
  }
}
