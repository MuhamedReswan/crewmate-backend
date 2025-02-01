import mongoose, {  Schema } from 'mongoose';
import IServiceBoy from '../../entities/v1/serviceBoyEntity';

 const ServieBoysSchema: Schema = new Schema<IServiceBoy>({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  mobile: { type: String },
  isVerified: { type: Boolean, default: false },
  profileImage: { type: String },
  aadharNumber: { type: String, unique:true, sparse: true},
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
  servicerId: { type: String, unique: true, sparse: true },
  walletId: { type: Schema.Types.ObjectId, unique: true, sparse: true },
  workHistoryId: { type: Schema.Types.ObjectId, unique: true,sparse: true },
});

export const serviceBoyModel = mongoose.model<IServiceBoy>('ServiceBoys', ServieBoysSchema);


