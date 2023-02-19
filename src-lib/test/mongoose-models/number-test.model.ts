import { model, Schema } from 'mongoose';
import { MongooseModelAdmin } from '../../server';

const NumberTestSchema = new Schema<{
  numField: number;
  numField2: number;
  numField3: number;
}>({
  numField: {
    type: Number,
    placeholder: '请输入xxx',
    filterType: new MongooseModelAdmin.FilterTypes.FilterNumberRangeType({}),
  },
  numField2: {
    type: Number,
    filterType: new MongooseModelAdmin.FilterTypes.FilterNumberRangeType({}),
  },
  numField3: {
    type: Number,
    filterType: new MongooseModelAdmin.FilterTypes.FilterNumberRangeType({}),
  },
}, {
  timestamps: true,
});

const NumberTestModel = model('number-test', NumberTestSchema);
export default NumberTestModel;


// setTimeout(async () => {
//   for (let i = 0; i < 100; i += 1) {
//     const t = new NumberTestModel({
//       numField: Math.random() * 100000,
//       numField2: Math.round(Math.random() * 100000 - 50000),
//       numField3: Math.random(),
//     });
//     console.log(t);
//     await t.save();
//   }
// }, 234);
