import mongoose, { Mongoose, Schema, model } from 'mongoose';
import IVendor from '../../entities/v1/vendorEntity';

 const vendorSchema: Schema = new Schema<IVendor>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  isVerified: { type: Boolean, default: false },
  profileImage: { type: String },
  location: {type: Object,default:{}},
  password: { type: String },
});

export const vendorModel = mongoose.model<IVendor>('Vendors', vendorSchema);