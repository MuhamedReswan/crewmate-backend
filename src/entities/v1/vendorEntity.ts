;
import { Types } from "mongoose";
import { LocationData } from "../../types/type";
import { VerificationStatusType } from "../../constants/verificationStatus";

export default interface IVendor {
    _id:Types.ObjectId;
    name:string, 
    email:string,
    mobile:string,
    password:string,
    isVerified:VerificationStatusType,
    rejectionReason?: string | null;
    isBlocked:boolean,
    profileImage:string,
    licenceImage:string,
    licenceNumber:string,
    estd:string,
    instaId:string,
    location?:LocationData,
    role:string; 
}