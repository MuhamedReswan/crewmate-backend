import mongoose, { Schema, model } from 'mongoose';
import IServiceBoy from "../../entities/v1/serviceBoyEntity";

const ServieBoysSchema: Schema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, unique: true },
  isVerified: { type: Boolean, default: false },
  profileImage: { type: String },
  aadharNumber: { type: String, unique: true },
  isBlocked: {type: Boolean, default: false},
  location: {
  },
  age: { type: Number },
  qualification: { type: String },
  points: { type: Number, default:0 },
  offDates: [{
  }],
  date: {  type: Schema.Types.Date },
  password: { type: String },
  servicerId: { type: String, unique: true },
  walletId: { type: Schema.Types.ObjectId, unique: true },
  workHistoryId: { type: Schema.Types.ObjectId, unique: true },
});

export default  model<IServiceBoy>('ServieBoys', ServieBoysSchema);



