import { Document, Schema, model } from 'mongoose';

export interface ObjDocument extends Document {
    obj: {
        aaa: string;
        bbb: number;
    };
    obj2: {
        ccc: string;
        ddd: string;
        eee: {
            fff: string;
            ggg: number;
        };
    };
    arr: {
        aaa: string;
        bbb: string;
    }[];
}

const ObjSchema = new Schema<ObjDocument>({
  obj: {
    aaa: String,
    bbb: String,
  },
  obj2: {
    ccc: String,
    ddd: String,
    eee: {
      fff: String,
      ggg: Number,
    },
  },
  arr: [{
    aaa: String,
    bbb: Number,
  }],
});

export const ObjModel = model('obj_type', ObjSchema);
export default ObjModel;
