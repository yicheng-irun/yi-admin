import {
  readFileSync, writeFileSync, existsSync, mkdirSync,
} from 'fs';
import {
  resolve, extname, relative, dirname,
} from 'path';
import { createHash } from 'crypto';
import { File } from 'formidable';

export function mkdirTraverse(dirpath: string): void {
  if (!existsSync(dirpath)) {
    const bpath = dirname(dirpath);
    mkdirTraverse(bpath);
    mkdirSync(dirpath);
  }
}

/**
 * 用于 EditStringFileType中的本地文件 fileWrite
 * @param param0
 */
export function getFileWriter({
  folder = './',
  baseUploadsFolder = resolve(process.cwd(), './uploads/'),
  baseUrlPath = '/uploads/',
}: {
   folder?: string;
   baseUploadsFolder?: string;
   baseUrlPath?: string;
} = {}): (file: File) => Promise<{
   url: string;
}> {
  const uploadFolder = resolve(baseUploadsFolder, folder);

  return async function _(file: File): Promise<{
         url: string;
      }> {
    const fileData = readFileSync(file.filepath);
    const hash = createHash('md5').update(fileData).digest('hex');

    const extName = extname(file.originalFilename);
    const fileName = `${hash}_${fileData.length}${extName}`;

    const savePath = resolve(uploadFolder, fileName);
    mkdirTraverse(dirname(savePath));
    const url = `${baseUrlPath}${relative(baseUploadsFolder, savePath).replace(/\\+/g, '/')}`;

    writeFileSync(savePath, fileData);
    return {
      url,
    };
  };
}
