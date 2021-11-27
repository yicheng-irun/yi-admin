import { model, Schema } from 'mongoose';


const FileImageSchema = new Schema<{
  file: string;
  image: string;
}>({
  file: String,
  image: String,
}, { timestamps: true });

const FileImageModel = model('file-image-test', FileImageSchema);
export default FileImageModel;
