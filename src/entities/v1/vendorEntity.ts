;
import { Types } from "mongoose";
import { IImage, ISecureImage, LocationData } from "../../types/type";
import { VerificationStatusType } from "../../constants/status";

export default interface IVendor {
    _id:Types.ObjectId;
    name:string, 
    email:string,
    mobile:string,
    password:string,
    isVerified:VerificationStatusType,
    rejectionReason?: string | null;
    isBlocked:boolean,
    profileImage:IImage,
    licenceImage:ISecureImage,
    licenceNumber:string,
    estd:string,
    instaId:string,
    location?:LocationData,
    role:string; 
}