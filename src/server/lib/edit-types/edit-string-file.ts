import { unlinkSync, existsSync } from 'fs';
import { EditBaseType, EditBaseTypeConfig, EditBaseComponentConfig } from './edit-base-type';
import { getFileWriter } from '../../tools/file-writer';
import { ReqData, JsonReturnType } from '../common-types';
import { File } from 'formidable';


export type EditStringFileTypeConfig = EditBaseTypeConfig & {
   minLength?: number;
   maxLength?: number;
   placeholder?: string;
   maxFileSize?: number;

   /**
    * https://www.w3school.com.cn/media/media_mimeref.asp
    */
   mimeType?: string;

   /**
    * 文件上传，此函数调用完毕后会自动清理掉暂存文件
    */
   writeFile: (file: File) => Promise<{
     url: string;
  }>;
}

export class EditStringFileType extends EditBaseType {
  /**
    * 前端的组件名称
    */
  public componentName = 'string-file';

  /**
    * 前端组件的参数
    */
  public componentConfig: EditBaseComponentConfig & {
      placeholder: string;
      maxFileSize: number;
      /**
       * https://www.w3school.com.cn/media/media_mimeref.asp
       */
      mimeType: string;
   } = {
      ...this.componentConfig,
      placeholder: '',
      /**
       * 注意，文件大小限制除了这里进行了限制，
       */
      maxFileSize: 10 * 1000 * 1000,

      mimeType: '*',
    };

  constructor(
      config: EditStringFileTypeConfig,
  ) {
    super(config);
    this.componentConfig.placeholder = config.placeholder || '';
    if (config.maxFileSize !== undefined) {
      this.componentConfig.maxFileSize = config.maxFileSize;
    }
    if (config.mimeType !== undefined) {
      this.componentConfig.mimeType = config.mimeType;
    }

    if (typeof config.writeFile !== 'function') throw new Error('writeFile 必须是一个合适的函数');
    this.writeFile = config.writeFile;
  }

  public writeFile: (file: File) => Promise<{
     url: string;
  }>;

  public async action(actionName: string, actionData: any, reqData: ReqData): Promise<JsonReturnType<{
      url: string;
   }>> {
    if (actionName === 'upload') {
      const { files } = reqData;
      if (!files) throw new Error('未识别到上传的文件');
      const file = Array.isArray(files.file) ? files.file[0] : files.file;
      try {
        const result = await this.writeFile(file);
        if (!result?.url) throw new Error('上传文件失败');
        return {
          success: true,
          data: {
            url: result.url,
          },
        };
      } finally {
        try {
          // 上传完毕后，清理缓存文件
          if (existsSync(file.filepath)) {
            unlinkSync(file.filepath);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    throw new Error(`接收到非法actionName ${actionName}`);
  }

  static getFileWriter = getFileWriter;
}
