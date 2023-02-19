import { model, Schema } from 'mongoose';
import { EditTypes } from '../../server';

const ArrayTestSchema = new Schema<{
  arrayField: string[];
  arrayField2: number[];
  arrayField3: boolean[];
  arrayField4: boolean[];
}>({
  arrayField: {
    type: [String],
    name: '鹅鹅鹅',
    editType: new EditTypes.EditArrayType({
      childrenType: new EditTypes.EditStringType({
        helpText: '呃呃呃',
      }),
    }),
  },
  arrayField2: {
    type: [Number],
    editType: new EditTypes.EditArrayType({
      childrenType: new EditTypes.EditNumberType({}),
    }),
  },
  arrayField3: {
    type: [Boolean],
    editType: new EditTypes.EditArrayType({
      childrenType: new EditTypes.EditBooleanType({}),
    }),
  },

  arrayField4: {
    type: [Boolean],
    editType: new EditTypes.EditArrayType({
      childrenType: new EditTypes.EditBooleanType({}),
    }),
    name: '布尔数组',
  },

}, { timestamps: true });

const ArrayTestModel = model('array-test', ArrayTestSchema);
export default ArrayTestModel;
