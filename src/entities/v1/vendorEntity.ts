import { Types } from "mongoose";

import { VerificationStatusType } from "../../constants/status";
import { IImage, ISecureImage, LocationData } from "../../types/type";

export default interface IVendor {
  _id: Types.ObjectId;
  name: string;
  email: string;
  mobile: string;
  password: string;
  isVerified: VerificationStatusType;
  rejectionReason?: string | null;
  isBlocked: boolean;
  profileImage: IImage;
  licenceImage: ISecureImage;
  licenceNumber: string;
  estd: string;
  instaId: string;
  location?: LocationData;
  role: string;
}
