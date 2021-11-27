import { EditBaseComponentConfig } from './edit-base-type';
import { EditStringFileType, EditStringFileTypeConfig } from './edit-string-file';
import { ListBaseType } from '../list-types/list-base-type';
import { ListStringImageType } from '../list-types/list-string-image-type';


export class EditStringImageType extends EditStringFileType {
  /**
    * 前端的组件名称
    */
  public componentName = 'string-image';

  /**
    * 前端组件的参数
    */
  public componentConfig: EditBaseComponentConfig & {
      placeholder: string;
      maxFileSize: number;
      mimeType: string;
      /**
       * max-width: 10em
       * 120px
       */
      listStyleMaxWidth?: string;
      /**
       * max-width: 6em
       * 72px
       */
      listStyleMaxHeight?: string;

      /**
       * 图片的最小宽度(前端校验)
       */
      minWidth?: number;

      /**
       * 图片的最大宽度(前端校验)
       */
      maxWidth?: number;

      /**
       * 图片的最小高度(前端校验)
       */
      minHeight?: number;

      /**
       * 图片的最大高度(前端校验)
       */
      maxHeight?: number;

      /**
       * 允许当图片超过宽高时，自动缩放裁剪
       */
      autoClip: boolean;
   } = {
      ...this.componentConfig,

      mimeType: 'image/*',

      /**
       * 当选取图片时超过最大宽度或者最大高度时自动裁剪
       */
      autoClip: true,
    };

  constructor(
      config: EditStringFileTypeConfig & {
         /**
          * max-width: 10em
          * 120px
          */
         listStyleMaxWidth?: string;
         /**
          * max-width: 6em
          * 72px
          */
         listStyleMaxHeight?: string;
      },
  ) {
    super(config);
    if (config.listStyleMaxWidth) {
      this.componentConfig.listStyleMaxWidth = config.listStyleMaxWidth;
    }
    if (config.listStyleMaxHeight) {
      this.componentConfig.listStyleMaxHeight = config.listStyleMaxHeight;
    }
  }

  public getListType(): ListBaseType {
    return new ListStringImageType({
      fieldNameAlias: this.fieldNameAlias,
      styleMaxWidth: this.componentConfig.listStyleMaxWidth,
      styleMaxHeight: this.componentConfig.listStyleMaxHeight,
    });
  }
}
