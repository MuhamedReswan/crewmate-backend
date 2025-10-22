import mongoose, {Schema} from "mongoose";
import IAdmin from "../../entities/v1/adminEntity";
import { LocationSchema } from "./location.model";
import { Role } from "../../constants/Role";


const  AdminSchema : Schema = new Schema<IAdmin>({
  password: { type: String },
  email: { type: String},
  name: { type: String},
  location:LocationSchema,
  role: { 
    type: String, 
    enum: Object.values(Role), 
    default: Role.ADMIN  
  },});

export const adminModel = mongoose.model<IAdmin>('Admins', AdminSchema);
