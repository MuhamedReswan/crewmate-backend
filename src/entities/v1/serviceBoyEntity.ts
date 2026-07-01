import { Document, Types } from "mongoose";

import { VerificationStatusType } from "../../constants/status";
import { IImage, LocationData } from "../../types/type";

export interface UnAvailable {
  date: Date;
  reason: string;
}

export default interface IServiceBoy extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  mobile: string;
  password: string;
  isVerified: VerificationStatusType;
  rejectionReason: string | null;
  profileImage: IImage;
  isBlocked: boolean;
  aadharNumber: string;
  aadharImageBack: IImage;
  aadharImageFront: IImage;
  servicerId: string;
  role: string;
  location: LocationData;
  age: number;
  qualification: string;
  points: number;
  servicerID: string;
  offDates: UnAvailable[];
  date: Date;
  walletId: Types.ObjectId;
  workHistory: Types.ObjectId;
}
