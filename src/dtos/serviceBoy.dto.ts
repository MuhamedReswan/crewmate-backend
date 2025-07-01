import { Types } from "mongoose";

export interface ServiceBoyLoginDTO {
  _id: Types.ObjectId;
  name: string;
  email: string;
  isVerified:boolean;
  isBlocked:boolean;
  role:string;
}

