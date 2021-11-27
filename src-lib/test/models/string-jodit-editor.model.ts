import { model, Schema } from 'mongoose';
import { EditTypes } from '../../server';

const StringJoditEditorSchema = new Schema<{
  text1: string;
  text2: string;
}>({
  text1: {
    type: String,
    editType: new EditTypes.EditStringJoditEditorType({
      writeFile: EditTypes.EditStringJoditEditorType.getFileWriter({
        folder: 'jodit',
      }),
    }),
  },
  text2: {
    type: String,
    editType: new EditTypes.EditStringJoditEditorType({
      placeholder: '呃呃呃，输入点什么吧',
      writeFile: EditTypes.EditStringJoditEditorType.getFileWriter({
        folder: 'jodit2',
      }),
    }),
  },
}, { timestamps: true });

const StringJoditEditorModel = model('string-jodit-editor', StringJoditEditorSchema);
export default StringJoditEditorModel;
