import { model, Schema } from 'mongoose';

export interface RefFieldClassDoc{
  name: string;
  title: string;
}

export const RefFieldClassSchema = new Schema<RefFieldClassDoc>({
  name: String,
  title: String,
}, {
  timestamps: true,
});

export const RefFieldClassModel = model('yi_admin_demo_ref', RefFieldClassSchema);
