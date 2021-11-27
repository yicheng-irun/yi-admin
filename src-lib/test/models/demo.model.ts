import { model, Schema, Types } from 'mongoose';
import { EditTypes, MongooseModelAdmin } from '../../server';
import { RefFieldClassModel, RefFieldClassSchema } from './demo.refclass.model';

const YiAdminDemoSchema = new Schema<{
  strField: string;
  strField2: string;
  strField3: string;
  strEnumField: string;
  strEnumField2: string;
  strRemoteSelectField3: string;
  textField3: string;
  numField: number;
  numField2: number;
  numEnumField: number;
  numRemoteSelectField: number;
  boolField: boolean;
  dateField: Date;
  objIdField: string;
  refField: Types.ObjectId;
}>({
  strField: {
    type: String,
    maxlength: 20,
    minlength: 3,
    name: '字符串strField',
    default: 'defaultValue',
    placeholder: '请输入xxx',
  },
  strField2: {
    type: String,
    required: true,
    filterType: new MongooseModelAdmin.FilterTypes.FilterStringSearchType(),
  },
  strField3: {
    type: String,
    filterType: new MongooseModelAdmin.FilterTypes.FilterStringSearchType(),
  },
  strEnumField: {
    type: String,
    enum: ['哈哈哈', '嘿嘿嘿', '额额额', 'jjj'],
    filterType: new MongooseModelAdmin.FilterTypes.FilterSelectType({
      options: ['哈哈哈', '嘿嘿嘿', '额额额', 'jjj'].map((item) => ({ label: item, value: item })),
    }),
  },
  strEnumField2: {
    type: String,
    enum: ['1', '2', '3', '4'],
    editType: new EditTypes.EditStringEnumType({
      required: false,
      enum: [{
        label: '啊啊1',
        value: '1',
      }, {
        label: '啊啊2',
        value: '2',
      }, {
        label: '啊啊3',
        value: '3',
      }],
    }),
    filterType: new MongooseModelAdmin.FilterTypes.FilterSelectType({
      options: ['1', '2', '3', '4'].map((item) => ({ label: item, value: item })),
    }),
  },

  strRemoteSelectField3: {
    type: String,
    helpText: '字符串远程选择类型示例',
    editType: new EditTypes.EditStringRemoteSelectType({
      required: false,
      async getLabelByValue(value): Promise<string> {
        if (value) {
          return `label:${value}`;
        }
        return '';
      },
      async getOptions(query: string): Promise<({ label: string; value: string })[]> {
        await new Promise((resolve) => setTimeout(resolve, 200));
        const q = String(query).trim();
        return [
          ...(q ? [{
            label: `label:${q}`,
            value: q,
          }] : []),
          {
            label: '不通过',
            value: '不通过',
          },
          {
            label: '公开',
            value: '通过',
          },
          {
            label: '删除状态',
            value: '删除',
          },
          {
            label: '状态3',
            value: 'status3',
          },
        ];
      },
    }),
  },

  textField3: {
    type: String,
    editType: new EditTypes.EditStringTextareaType({
      required: false,
      maxLength: 100,
      placeholder: '请输入XXX',
    }),
  },
  numField: {
    type: Number,
    min: 0,
    max: 100,
  },
  numField2: {
    type: Number,
    min: 0,
    max: 10,
    step: 0.1,
  },
  numEnumField: {
    type: Number,
    editType: new EditTypes.EditNumberEnumType({
      enum: [{
        label: '啊啊啊',
        value: 1,
      }, {
        label: '啊啊啊2',
        value: 2,
      }, {
        label: '啊啊啊3',
        value: 3,
      }],
    }),
  },
  numRemoteSelectField: {
    type: Number,
    name: '数字远程选择',
    editType: new EditTypes.EditNumberRemoteSelectType({
      async getOptions(): Promise<(number | { label: string; value: number})[]> {
        return [
          1,
          2,
          3,
          {
            label: '十',
            value: 10,
          },
          {
            label: '百',
            value: 100,
          },
          {
            label: '千',
            value: 1000,
          },
        ];
      },
      helpText: '数字远程选择组件示例',
    }),
  },
  boolField: {
    type: Boolean,
    default: false,
    filterType: new MongooseModelAdmin.FilterTypes.FilterBooleanType(),
  },
  dateField: Date,
  objIdField: Types.ObjectId,
  refField: {
    type: RefFieldClassSchema,
    ref: RefFieldClassModel,
  },
}, {
  timestamps: true,
});


const YiAdminDemoModel = model('yi_admin_demo', YiAdminDemoSchema);
export default YiAdminDemoModel;
