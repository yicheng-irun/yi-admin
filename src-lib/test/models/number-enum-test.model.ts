import { model, Schema } from 'mongoose';
import { EditTypes, MongooseModelAdmin } from '../../server';


const NumberEnumTestSchema = new Schema<{
  numEnumField: number;
  numEnumField2: number;
  numRemoteSelectField3: number;
}>({
  numEnumField: {
    type: Number,
    enum: [0, 10, 20, 30, 40],
  },
  numEnumField2: {
    type: Number,
    enum: [0, 1, 2, 3, 4],
    editType: new EditTypes.EditNumberEnumType({
      required: false,
      enum: [{
        label: '零',
        value: 0,
      }, {
        label: '一',
        value: 1,
      }, {
        label: '二',
        value: 2,
      }, {
        label: '三',
        value: 3,
      }, {
        label: '四',
        value: 4,
      }],
    }),
    filterType: new MongooseModelAdmin.FilterTypes.FilterSelectType({
      options: [{
        label: '零',
        value: 0,
      }, {
        label: '一',
        value: 1,
      }, {
        label: '二',
        value: 2,
      }, {
        label: '三',
        value: 3,
      }, {
        label: '四',
        value: 4,
      }],
      multiSelect: true,
    }),
  },
  numRemoteSelectField3: {
    type: Number,
    helpText: '字符串远程选择类型示例',
    editType: new EditTypes.EditNumberRemoteSelectType({
      required: false,
      async getLabelByValue(value): Promise<string> {
        if (value) {
          return `label:${value}`;
        }
        return '';
      },
      async getOptions(query: string): Promise<(number| { label: string; value: number })[]> {
        const q = Number.parseFloat(query);

        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        const distinctData = await NumberEnumTestModel.distinct('strRemoteSelectField3').exec();
        const options: (number| { label: string; value: number })[] = [];
        if (!Number.isNaN(q) && distinctData.indexOf(q) < 0) {
          options.push({
            value: q,
            label: `value is ${q}`,
          });
        }
        distinctData.forEach((item) => {
          options.push({
            value: Number(item),
            label: `value is ${item}`,
          });
        });

        return options;
      },
    }),
  },
}, {
  timestamps: true,
});

const NumberEnumTestModel = model('number-enum-test', NumberEnumTestSchema);
export default NumberEnumTestModel;
