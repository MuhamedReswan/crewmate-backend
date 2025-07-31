import  { Document, Schema, model } from 'mongoose';
import IVendor from '../../entities/v1/vendorEntity';
import { LocationSchema } from './location.model';
import { Role } from '../../constants/Role';
import { VerificationStatus } from '../../constants/verificationStatus';

 const vendorSchema: Schema = new Schema<IVendor>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  isVerified: { type: String, default:VerificationStatus.Pending},
  isBlocked: { type: Boolean, default: false },
  profileImage: { type: String },
  password: { type: String },
  role:{type:String, default:Role.VENDOR},
  estd:{ type: String },
  instaId:{ type: String },
  licenceNumber:{ type: String },
  licenceImage:{ type: String },
 location: {
    type: LocationSchema,
    required: false
  }
});

export const vendorModel = model<IVendor& Document>('Vendors', vendorSchema);