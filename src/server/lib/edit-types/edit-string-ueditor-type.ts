import { existsSync, unlinkSync, writeFileSync } from 'fs';
import mime from 'mime';
import { join, dirname } from 'path';
import { createHash } from 'crypto';
import { EditStringTextareaType } from './edit-string-textarea-type';
import { EditBaseComponentConfig, EditBaseTypeConfig } from './edit-base-type';
import { getFileWriter, mkdirTraverse } from '../../tools/file-writer';
import { ReqData } from '../common-types';
import { File } from 'formidable';

/* 前后端通信相关的配置,注释只允许使用多行方式 */
const ueditorConfig = {
  /* 上传图片配置项 */
  imageActionName: 'uploadimage', /* 执行上传图片的action名称 */
  imageFieldName: 'upfile', /* 提交的图片表单名称 */
  imageMaxSize: 2048000, /* 上传大小限制，单位B */
  imageAllowFiles: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'], /* 上传图片格式显示 */
  imageCompressEnable: true, /* 是否压缩图片,默认是true */
  imageCompressBorder: 1600, /* 图片压缩最长边限制 */
  imageInsertAlign: 'none', /* 插入的图片浮动方式 */
  imageUrlPrefix: '', /* 图片访问路径前缀 */
  imagePathFormat: '/uploads/{yyyy}/{mm}/{dd}/{time}{rand:6}', /* 上传保存路径,可以自定义保存路径和文件名格式 */
  /* {filename} 会替换成原文件名,配置这项需要注意中文乱码问题 */
  /* {rand:6} 会替换成随机数,后面的数字是随机数的位数 */
  /* {time} 会替换成时间戳 */
  /* {yyyy} 会替换成四位年份 */
  /* {yy} 会替换成两位年份 */
  /* {mm} 会替换成两位月份 */
  /* {dd} 会替换成两位日期 */
  /* {hh} 会替换成两位小时 */
  /* {ii} 会替换成两位分钟 */
  /* {ss} 会替换成两位秒 */
  /* 非法字符 \ : * ? ' < > | */
  /* 具请体看线上文档: fex.baidu.com/ueditor/#use-format_upload_filename */
  /* 涂鸦图片上传配置项 */
  scrawlActionName: 'uploadscrawl', /* 执行上传涂鸦的action名称 */
  scrawlFieldName: 'upfile', /* 提交的图片表单名称 */
  scrawlPathFormat: '/uploads/{yyyy}/{mm}/{dd}/{time}{rand:6}', /* 上传保存路径,可以自定义保存路径和文件名格式 */
  scrawlMaxSize: 2048000, /* 上传大小限制，单位B */
  scrawlUrlPrefix: '', /* 图片访问路径前缀 */
  scrawlInsertAlign: 'none',

  /* 截图工具上传 */
  snapscreenActionName: 'uploadimage', /* 执行上传截图的action名称 */
  snapscreenPathFormat: '/uploads/{yyyy}/{mm}/{dd}/{time}{rand:6}', /* 上传保存路径,可以自定义保存路径和文件名格式 */
  snapscreenUrlPrefix: '', /* 图片访问路径前缀 */
  snapscreenInsertAlign: 'none', /* 插入的图片浮动方式 */

  /* 抓取远程图片配置 */
  catcherLocalDomain: ['127.0.0.1', 'localhost', 'img.baidu.com'], // 'img.baidu.com'
  catcherActionName: 'catchimage', /* 执行抓取远程图片的action名称 */
  catcherFieldName: 'source', /* 提交的图片列表表单名称 */
  catcherPathFormat: '/uploads/{yyyy}/{mm}/{dd}/{time}{rand:6}', /* 上传保存路径,可以自定义保存路径和文件名格式 */
  catcherUrlPrefix: '', /* 图片访问路径前缀 */
  catcherMaxSize: 2048000, /* 上传大小限制，单位B */
  catcherAllowFiles: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'], /* 抓取图片格式显示 */

  /* 上传视频配置 */
  videoActionName: 'uploadvideo', /* 执行上传视频的action名称 */
  videoFieldName: 'upfile', /* 提交的视频表单名称 */
  videoPathFormat: '/uploads/{yyyy}/{mm}/{dd}/{time}{rand:6}', /* 上传保存路径,可以自定义保存路径和文件名格式 */
  videoUrlPrefix: '', /* 视频访问路径前缀 */
  videoMaxSize: 102400000, /* 上传大小限制，单位B，默认100MB */
  videoAllowFiles: [
    '.flv', '.swf', '.mkv', '.avi', '.rm', '.rmvb', '.mpeg', '.mpg',
    '.ogg', '.ogv', '.mov', '.wmv', '.mp4', '.webm', '.mp3', '.wav', '.mid'], /* 上传视频格式显示 */

  /* 上传文件配置 */
  fileActionName: 'uploadfile', /* controller里,执行上传视频的action名称 */
  fileFieldName: 'upfile', /* 提交的文件表单名称 */
  filePathFormat: '/uploads/{yyyy}/{mm}/{dd}/{time}{rand:6}', /* 上传保存路径,可以自定义保存路径和文件名格式 */
  fileUrlPrefix: '', /* 文件访问路径前缀 */
  fileMaxSize: 51200000, /* 上传大小限制，单位B，默认50MB */
  fileAllowFiles: [
    '.png', '.jpg', '.jpeg', '.gif', '.bmp',
    '.flv', '.swf', '.mkv', '.avi', '.rm', '.rmvb', '.mpeg', '.mpg',
    '.ogg', '.ogv', '.mov', '.wmv', '.mp4', '.webm', '.mp3', '.wav', '.mid',
    '.rar', '.zip', '.tar', '.gz', '.7z', '.bz2', '.cab', '.iso',
    '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.md', '.xml',
  ], /* 上传文件格式显示 */

  /* 列出指定目录下的图片 */
  imageManagerActionName: 'listimage', /* 执行图片管理的action名称 */
  imageManagerListPath: '/uploads/', /* 指定要列出图片的目录 */
  imageManagerListSize: 20, /* 每次列出文件数量 */
  imageManagerUrlPrefix: '', /* 图片访问路径前缀 */
  imageManagerInsertAlign: 'none', /* 插入的图片浮动方式 */
  imageManagerAllowFiles: ['.png', '.jpg', '.jpeg', '.gif', '.bmp'], /* 列出的文件类型 */

  /* 列出指定目录下的文件 */
  fileManagerActionName: 'listfile', /* 执行文件管理的action名称 */
  fileManagerListPath: '/uploads/', /* 指定要列出文件的目录 */
  fileManagerUrlPrefix: '', /* 文件访问路径前缀 */
  fileManagerListSize: 20, /* 每次列出文件数量 */
  fileManagerAllowFiles: [
    '.png', '.jpg', '.jpeg', '.gif', '.bmp',
    '.flv', '.swf', '.mkv', '.avi', '.rm', '.rmvb', '.mpeg', '.mpg',
    '.ogg', '.ogv', '.mov', '.wmv', '.mp4', '.webm', '.mp3', '.wav', '.mid',
    '.rar', '.zip', '.tar', '.gz', '.7z', '.bz2', '.cab', '.iso',
    '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.pdf', '.txt', '.md', '.xml',
  ], /* 列出的文件类型 */
};

/**
 * 富文本编辑器类型  UEditor
 */
export class EditStringUEditorType extends EditStringTextareaType {
  /**
    * 前端的组件名称
    */
  public componentName = 'string-ueditor';

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
          * 文件上传，使用koa-body，此函数调用完毕后会自动清理掉暂存文件
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
  public async action(actionName: string, actionData: any, reqData: ReqData): Promise<any> {
    try {
      if (reqData.method === 'GET') {
        if (actionName === 'config') {
          return ueditorConfig;
        } if (actionName === 'listimage') {
          return {
            state: 'SUCCESS',
            list: [],
            start: 0,
            total: 0,
          };
        } if (actionName === 'listfile') {
          return {
            state: 'SUCCESS',
            list: [],
            start: 0,
            total: 0,
          };
        }
      } else if (reqData.method === 'POST') {
        if (actionName === 'uploadimage' || actionName === 'uploadfile') {
          const { files } = reqData;
          if (!files) throw new Error('未识别到上传的文件');
          const file = Array.isArray(files.upfile) ? files.upfile[0] : files.upfile;
          try {
            const result = await this.writeFile(file);
            if (!result?.url) throw new Error('上传文件失败');
            return {
              state: 'SUCCESS',
              url: result.url,
              title: result.url,
              original: result.url,
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
        } if (actionName === 'uploadscrawl') {
          if (reqData.body?.upfile) {
            let file: File | null = null;
            try {
              const bf = Buffer.from(reqData.body.upfile, 'base64');
              const hash = createHash('md5').update(bf).digest('hex');
              const name = `${hash}.jpg`;
              const path = join(process.cwd(), 'temp', name);
              mkdirTraverse(dirname(path));
              writeFileSync(path, bf);
              // @ts-ignore
              file = {
                size: bf.length,
                filepath: path,
                originalFilename: name,
                newFilename: name,
                mimetype: mime.lookup('.jpg') || '',
                hashAlgorithm: 'md5',
                hash,
              };
              const result = await this.writeFile(file);
              if (!result?.url) throw new Error('上传文件失败');
              return {
                state: 'SUCCESS',
                url: result.url,
                title: result.url,
                original: result.url,
              };
            } finally {
              try {
                // 上传完毕后，清理缓存文件
                if (file && existsSync(file.filepath)) {
                  unlinkSync(file.filepath);
                }
              } catch (e) {
                console.error(e);
              }
            }
          }
        }
      }
      throw new Error('未知操作');
    } catch (e) {
      return {
        state: e?.message || e || '出错了',
      };
    }
  }

  static getFileWriter = getFileWriter;
}
