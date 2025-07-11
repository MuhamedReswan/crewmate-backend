import mongoose, {Schema} from "mongoose";
import IAdmin from "../../entities/v1/adminEntity";


const  AdminSchema : Schema = new Schema<IAdmin>({
  password: { type: String },
  email: { type: String},
  name: { type: String}  
});

export const adminModel = mongoose.model<IAdmin>('AdminSchema', AdminSchema);
