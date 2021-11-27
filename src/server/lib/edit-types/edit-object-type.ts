import { EditBaseType, EditBaseComponentConfig, EditBaseTypeConfig } from './edit-base-type';

export class EditObjectType extends EditBaseType {
  /**
    * 前端的组件名称
    */
  public componentName = 'object';

  /**
    * 前端组件的参数
    */
  public componentConfig: EditBaseComponentConfig & {
      editFields: EditBaseType[];
   } = {
      ...this.componentConfig,
      editFields: [],
    };

  constructor(config: EditBaseTypeConfig & {
      editFields?: EditBaseType[];
   }) {
    super(config);
    if (config.editFields) {
      this.componentConfig.editFields = config.editFields;
    }
  }
}
