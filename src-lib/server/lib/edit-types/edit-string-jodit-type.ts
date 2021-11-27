import { existsSync, unlinkSync } from 'fs';
import mime from 'mime';
import { EditStringTextareaType } from './edit-string-textarea-type';
import { EditBaseComponentConfig, EditBaseTypeConfig } from './edit-base-type';
import { getFileWriter } from '../../tools/file-writer';
import { ReqData, JsonReturnType } from '../common-types';
import { File } from 'formidable';

/**
 * 富文本编辑器类型  jodit
 */
export class EditStringJoditEditorType extends EditStringTextareaType {
  /**
    * 前端的组件名称
    */
  public componentName = 'string-jodit-editor';

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

      maxFileSize: number;
      /**
       * https://www.w3school.com.cn/media/media_mimeref.asp
       */
      mimeType: string;
   } = {
      ...this.componentConfig,
      /**
       * 注意，文件大小限制除了这里进行了限制，同时也受到koa-body这个库的限制
       */
      maxFileSize: 10 * 1000 * 1000,

      mimeType: '*',
    };

  constructor(
      config: EditBaseTypeConfig & {
         minLength?: number;
         maxLength?: number;
         placeholder?: string;

         maxFileSize?: number;

         /**
          * https://www.w3school.com.cn/media/media_mimeref.asp
          */
         mimeType?: string;

         /**
          * 文件上传此函数调用完毕后会自动清理掉暂存文件
          */
         writeFile: (file: File) => Promise<{
           url: string;
        }>;
      },
  ) {
    super(config);

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

  // eslint-disable-next-line class-methods-use-this
  public async action(actionName: string, actionData: any, reqData: ReqData): Promise<JsonReturnType<{
      files: string[];
      path: string;
      baseurl: '';
      isImages: boolean[];
   }
   >> {
    if (actionName === 'uploader') {
      const { files } = reqData;
      const results: string[] = [];
      for (let i = 0; ; i += 1) {
        const fname = `files[${i}]`;
        if (files && files[fname]) {
          const fileValue = files[fname];
          const file = Array.isArray(fileValue)? fileValue[0] : fileValue;
          try {
            // eslint-disable-next-line no-await-in-loop
            const result = await this.writeFile(file);
            if (!result?.url) throw new Error('上传文件失败');
            results.push(result.url);
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
        } else {
          break;
        }
      }
      return {
        success: true,
        data: {
          files: results,
          path: '',
          baseurl: '',
          isImages: results.map((t: string) => {
            const a = mime.lookup(t);
            if (a && /^image\//.test(a)) {
              return true;
            }
            return false;
          }),
        },
      };
    }
    throw new Error(`接收到非法actionName ${actionName}`);
  }

  static getFileWriter = getFileWriter;
}
