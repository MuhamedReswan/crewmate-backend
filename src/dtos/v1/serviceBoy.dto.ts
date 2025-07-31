import { VerificationStatusType } from "../../constants/verificationStatus";

export interface ServiceBoyLoginDTO {
  _id: string;
  name: string;
  email: string;
  isVerified:VerificationStatusType;
  isBlocked:boolean;
  role:string;
}

