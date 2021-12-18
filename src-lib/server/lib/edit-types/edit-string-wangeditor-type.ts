import { existsSync, unlinkSync } from 'fs';
import { EditStringTextareaType } from './edit-string-textarea-type';
import { EditBaseComponentConfig, EditBaseTypeConfig } from './edit-base-type';
import { getFileWriter } from '../../tools/file-writer';
import { ReqData, JsonReturnType } from '../common-types';
import { File } from 'formidable';

/**
 * 富文本编辑器类型  wangeditor
 * https://www.wangeditor.com/
 */
export class EditStringWangEditorType extends EditStringTextareaType {
  /**
    * 前端的组件名称
    */
  public componentName = 'string-wang-editor';

  /**
    * 前端组件的参数
    */
  public componentConfig: EditBaseComponentConfig & {
      placeholder: string;
      /**
       * 最小长度
       */
      minLength: number;
      /**
       * 最大长度
       */
      maxLength?: number;

      uploadImgMaxSize: number;
   } = {
      ...this.componentConfig,
      /**
       * 注意，文件大小限制除了这里进行了限制，同时也受到koa-body这个库的限制
       */
      uploadImgMaxSize: 10 * 1000 * 1000,
    };

  constructor(
      config: EditBaseTypeConfig & {
         minLength?: number;
         maxLength?: number;
         placeholder?: string;

         uploadImgMaxSize?: number;

         /**
          * 文件上传此函数调用完毕后会自动清理掉暂存文件
          */
         writeFile: (file: File) => Promise<{
           url: string;
        }>;
      },
  ) {
    super(config);

    if (config.uploadImgMaxSize !== undefined) {
      this.componentConfig.uploadImgMaxSize = config.uploadImgMaxSize;
    }

    if (typeof config.writeFile !== 'function') throw new Error('writeFile 必须是一个合适的函数');
    this.writeFile = config.writeFile;
  }

  public writeFile: (file: File) => Promise<{
     url: string;
  }>;

  public async action(actionName: string, actionData: any, reqData: ReqData): Promise<JsonReturnType<{
     url: string;
   }
   >> {
    if (actionName === 'uploadImage') {
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
