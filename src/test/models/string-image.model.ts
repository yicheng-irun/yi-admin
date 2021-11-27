import { model, Schema } from 'mongoose';
import { EditTypes } from '../../server';

const StringImageTestSchema = new Schema<{
  image1: string;
  image2: string;
}>({
  image1: {
    type: String,
    name: '图片1',
    editType: new EditTypes.EditStringImageType({
      writeFile: EditTypes.EditStringImageType.getFileWriter(),
      listStyleMaxWidth: '5em',
      listStyleMaxHeight: '3em',
    }),
  },
  image2: {
    type: String,
    name: '图片2',
    editType: new EditTypes.EditStringImageType({
      maxFileSize: 80 * 1000,
      writeFile: EditTypes.EditStringImageType.getFileWriter({
        folder: 'image2',
      }),
    }),
  },
}, {
  timestamps: true,
});

const StringImageTestModel = model('string-image-test', StringImageTestSchema);
export default StringImageTestModel;
