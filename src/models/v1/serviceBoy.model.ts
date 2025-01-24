import mongoose, { Mongoose, Schema, model } from 'mongoose';
import IServiceBoy from '../../entities/v1/serviceBoyEntity';
import { string } from 'zod';

 const ServieBoysSchema: Schema = new Schema<IServiceBoy>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  isVerified: { type: Boolean, default: false },
  profileImage: { type: String },
  aadharNumber: { type: String },
  isBlocked: {type: Boolean, default: false},
  location: {type: Object,default:{}},
  age: { type: Number },
  qualification: { type: String },
  points: { type: Number, default:0 },
  role:{type:String, default:"Service Boy"},
  offDates: [{
  }],
  date: {  type: Schema.Types.Date },
  password: { type: String },
  servicerId: { type: String, unique: true },
  walletId: { type: Schema.Types.ObjectId, unique: true },
  workHistoryId: { type: Schema.Types.ObjectId, unique: true },
});

export const serviceBoyModel = mongoose.model<IServiceBoy>('ServiceBoys', ServieBoysSchema);


