import { model, Schema } from 'mongoose';
import { EditTypes } from '../../server';

const StringFileTestSchema = new Schema<{
  file1: string;
  file2: string;
}>({
  file1: {
    type: String,
    name: '文件1',
    editType: new EditTypes.EditStringFileType({
      writeFile: EditTypes.EditStringFileType.getFileWriter(),
    }),
  },
  file2: {
    type: String,
    name: '文件2',
    editType: new EditTypes.EditStringFileType({
      maxFileSize: 50 * 1000,
      writeFile: EditTypes.EditStringFileType.getFileWriter({
        folder: 'file2',
      }),
    }),
  },

}, { timestamps: true });

const StringFileTestModel = model('string-file-test', StringFileTestSchema);
export default StringFileTestModel;
