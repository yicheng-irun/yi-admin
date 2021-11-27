import { model, Schema } from 'mongoose';
import { EditTypes } from '../../server';


const StringUEditorSchema = new Schema<{
  text1: string;
  text2: string;
}>({
  text1: {
    type: String,
    editType: new EditTypes.EditStringUEditorType({
      writeFile: EditTypes.EditStringUEditorType.getFileWriter({
        folder: 'ueditor',
      }),
    }),
  },
  text2: {
    type: String,
    editType: new EditTypes.EditStringUEditorType({
      placeholder: '呃呃呃，输入点什么吧',
      writeFile: EditTypes.EditStringUEditorType.getFileWriter({
        folder: 'ueditor2',
      }),
    }),
  },
}, { timestamps: true });

const StringUEditorModel = model('string-u-editor', StringUEditorSchema);
export default StringUEditorModel;
