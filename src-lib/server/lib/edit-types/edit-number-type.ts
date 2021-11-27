import { EditBaseType, EditBaseTypeConfig, EditBaseComponentConfig } from './edit-base-type';

export class EditNumberType extends EditBaseType {
  /**
    * 前端的组件名称
    */
  public componentName = 'number';

  /**
    * 前端组件的参数
    */
  public componentConfig: EditBaseComponentConfig & {
      min?: number;
      max?: number;
      step: number;
   } = {
      ...this.componentConfig,
      min: undefined,
      max: undefined,
      step: 1,
    };

  constructor(
      config: EditBaseTypeConfig & {
         min?: number;
         max?: number;
         step?: number;
      },
  ) {
    super(config);
    if ('min' in config) {
      this.componentConfig.min = config.min;
    }
    if ('max' in config) {
      this.componentConfig.max = config.max;
    }
    if ('step' in config) {
      const step = config.step || 1;
      if (step <= 0) throw new Error('step 不能小于或等于0');
      this.componentConfig.step = step;
    }
  }
}
