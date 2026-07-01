import mongoose, { Schema } from "mongoose";

import { Role } from "../../constants/Role";
import { VerificationStatus } from "../../constants/status";
import IServiceBoy from "../../entities/v1/serviceBoyEntity";

import { ImageSchema, SecureImageSchema } from "./common/image.schema";
import { LocationSchema } from "./location.model";

const UnAvailableSchema = new Schema({
  date: { type: Date, required: true },
  reason: { type: String, required: true },
});

const ServiceBoysSchema: Schema = new Schema<IServiceBoy>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  isVerified: { type: String, default: VerificationStatus.Pending },
  rejectionReason: { type: String, default: null },
  isBlocked: { type: Boolean, default: false },
  profileImage: { type: ImageSchema },
  aadharNumber: { type: String, unique: true, sparse: true },
  aadharImageFront: { type: SecureImageSchema },
  aadharImageBack: { type: SecureImageSchema },
  age: { type: Number },
  qualification: { type: String },
  points: { type: Number, default: 0 },
  role: { type: String, default: Role.SERVICE_BOY },
  date: { type: Schema.Types.Date },
  password: { type: String },
  servicerId: { type: String, unique: true, sparse: true },
  walletId: { type: Schema.Types.ObjectId, unique: true, sparse: true },
  workHistory: { type: Schema.Types.ObjectId, unique: true, sparse: true },
  location: { type: LocationSchema, required: false },
  offDates: [UnAvailableSchema],
});

export const serviceBoyModel = mongoose.model<IServiceBoy>("ServiceBoys", ServiceBoysSchema);
