import { model, Schema } from 'mongoose';
import { EditTypes } from '../../server';


const StringWangEditorSchema = new Schema<{
  text1: string;
  text2: string;
}>({
  text1: {
    type: String,
    editType: new EditTypes.EditStringWangEditorType({
      writeFile: EditTypes.EditStringWangEditorType.getFileWriter({
        folder: 'wangeditor',
      }),
    }),
  },
  text2: {
    type: String,
    editType: new EditTypes.EditStringWangEditorType({
      placeholder: '呃呃呃，输入点什么吧',
      writeFile: EditTypes.EditStringWangEditorType.getFileWriter({
        folder: 'wangeditor2',
      }),
    }),
  },
}, { timestamps: true });

const StringWangEditorModel = model('string-wang-editor', StringWangEditorSchema);
export default StringWangEditorModel;
