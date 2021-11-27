import { EditBaseType, EditBaseTypeConfig, EditBaseComponentConfig } from './edit-base-type';

export class EditStringType extends EditBaseType {
  /**
    * 前端的组件名称
    */
  public componentName = 'string';

  /**
    * 前端组件的参数
    */
  public componentConfig: EditBaseComponentConfig & {
      /**
       * 最小长度
       */
      minLength: number;
      /**
       * 最大长度
       */
      maxLength?: number;

      placeholder: string;
   } = {
      ...this.componentConfig,
      minLength: 0,
      maxLength: undefined,
      placeholder: '',
    };

  constructor(
      config: EditBaseTypeConfig & {
         minLength?: number;
         maxLength?: number;
         placeholder?: string;
      },
  ) {
    super(config);
    if (typeof config.minLength === 'number') {
      this.componentConfig.minLength = config.minLength;
    }
    if (typeof config.maxLength === 'number') {
      this.componentConfig.maxLength = config.maxLength;
    }
    this.componentConfig.placeholder = config.placeholder || '';
  }
}
