import { model, Schema } from 'mongoose';
import { EditTypes } from '../../server';


const ArrayImageSchema = new Schema<{
  images1: string[];
  images2: string[];
  imgsInfo(): Promise<string>;
      }>({
        images1: {
          type: [String],
          editType: new EditTypes.EditArrayType({
            childrenType: new EditTypes.EditStringImageType({
              helpText: '图片列表',
              writeFile: EditTypes.EditStringImageType.getFileWriter({
                folder: 'array-images',
              }),
              listStyleMaxHeight: '3em',
            }),
            listStyleInline: true,
            maxLength: 2,
          }),
        },
        images2: {
          type: [String],
          editType: new EditTypes.EditArrayType({
            childrenType: new EditTypes.EditStringImageType({
              helpText: '图片列表',
              writeFile: EditTypes.EditStringImageType.getFileWriter({
                folder: 'array-images2',
              }),
              listStyleMaxHeight: '5em',
            }),
          }),
        },
      }, {
        timestamps: true,
      });

ArrayImageSchema.methods.imgsInfo = function(): Promise<string> {
  const rst = `<div>size: ${(this.images1?.length || 0) + (this.images2?.length || 0)}</div>`;
  return Promise.resolve(rst);
};

const ArrayImageModel = model('array-image', ArrayImageSchema);
export default ArrayImageModel;
