import { model, Schema } from 'mongoose';
import { EditTypes, MongooseModelAdmin } from '../../server';
import { EditArrayStringTagType } from '../../server/lib/edit-types/edit-array-string-tag-type';


const ArrayStringEnumSchema = new Schema<{
  remoteSelect: string[];
  remoteSelect2: string[];
  arrTag: string[];
}>({
  remoteSelect: {
    type: [String],
    editType: new EditTypes.EditArrayType({
      childrenType: new EditTypes.EditStringRemoteSelectType({
        required: false,
        async getLabelByValue(value): Promise<string> {
          if (value) {
            return `${value}`;
          }
          return '';
        },
        async getOptions(query: string): Promise<({ label: string; value: string })[]> {
          const q = String(query).trim();
          const distinctData: string[] = await ArrayStringEnumModel.distinct('remoteSelect').exec();
          const options = [];
          if (q && distinctData.indexOf(q) < 0) {
            options.push({
              value: q,
              label: `${q}`,
            });
          }
          distinctData.forEach((item) => {
            options.push({
              value: String(item),
              label: `${item}`,
            });
          });

          return options;
        },
      }),
    }),
    filterType: new MongooseModelAdmin.FilterTypes.FilterStringSearchType({}),
  },
  remoteSelect2: {
    type: [String],
    editType: new EditTypes.EditArrayType({
      childrenType: new EditTypes.EditStringRemoteSelectType({
        required: false,
        async getLabelByValue(value): Promise<string> {
          if (value) {
            return `${value}`;
          }
          return '';
        },
        async getOptions(query: string): Promise<({ label: string; value: string })[]> {
          const q = String(query).trim();
          const distinctData: string[] = await ArrayStringEnumModel.distinct('remoteSelect2').exec();
          const options = [];
          if (q && distinctData.indexOf(q) < 0) {
            options.push({
              value: q,
              label: `${q}`,
            });
          }
          distinctData.forEach((item) => {
            options.push({
              value: String(item),
              label: `${item}`,
            });
          });

          return options;
        },
      }),
      listStyleInline: true,
    }),
    filterType: new MongooseModelAdmin.FilterTypes.FilterRemoteSelectType({
      multiSelect: true,
    }),
  },

  arrTag: {
    type: [String],
    editType: new EditArrayStringTagType({
      async getTags(q: string): Promise<string[]> {
        const distinctData: string[] = await ArrayStringEnumModel.distinct('arrTag').exec();
        if (distinctData.includes(q)) return distinctData;
        return [String(q).trim(), ...distinctData];
      },
      maxLength: 5,
    }),
  },

}, { timestamps: true });


const ArrayStringEnumModel = model('array-string-enum', ArrayStringEnumSchema);
export default ArrayStringEnumModel;
