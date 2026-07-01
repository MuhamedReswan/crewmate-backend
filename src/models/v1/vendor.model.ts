import { Document, Schema, model } from "mongoose";

import { Role } from "../../constants/Role";
import { VerificationStatus } from "../../constants/status";
import IVendor from "../../entities/v1/vendorEntity";

import { ImageSchema, SecureImageSchema } from "./common/image.schema";
import { LocationSchema } from "./location.model";

const vendorSchema: Schema = new Schema<IVendor>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  isVerified: { type: String, default: VerificationStatus.Pending },
  rejectionReason: { type: String, default: null },
  isBlocked: { type: Boolean, default: false },
  profileImage: { type: ImageSchema },
  password: { type: String },
  role: { type: String, default: Role.VENDOR },
  estd: { type: String },
  instaId: { type: String },
  licenceNumber: { type: String },
  licenceImage: { type: SecureImageSchema },
  location: {
    type: LocationSchema,
    required: false,
  },
});

export const vendorModel = model<IVendor & Document>("Vendors", vendorSchema);
