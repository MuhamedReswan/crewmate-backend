import { VerificationStatusType } from "../../constants/status";

export interface ServiceBoyLoginDTO {
  _id: string;
  name: string;
  email: string;
  isVerified:VerificationStatusType;
  isBlocked:boolean;
  role:string;
  rejectionReason?: string | null 
}

