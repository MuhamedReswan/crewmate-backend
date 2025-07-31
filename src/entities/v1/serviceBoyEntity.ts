import { Document, Types } from "mongoose";
import { LocationData } from "../../types/type";
import { VerificationStatusType } from "../../constants/verificationStatus";

export interface UnAvailable {
    date:Date,
    reason:string
}

export default interface IServiceBoy extends Document {
    _id:Types.ObjectId;
    name:string, 
    email:string,
    mobile:string,
    password:string,
    isVerified:VerificationStatusType,
    profileImage:string,
    isBlocked:boolean,
    aadharNumber:string,
    aadharImageBack:string,
    aadharImageFront:string,
    servicerId:string,
    role:string; 
    location:LocationData,
    age:number,
    qualification:string,
    points:number,
    servicerID:string,
    offDates:UnAvailable[]
    date:Date,
    walletId:Types.ObjectId,
    workHistoryId:Types.ObjectId   
}

