;
import { Types } from "mongoose";
import { LocationData } from "../../types/type";

export default interface IVendor {
    _id:Types.ObjectId;
    name:string, 
    email:string,
    mobile:string,
    password:string,
    isVerified:boolean,
    isBlocked:boolean,
    profileImage:string,
    licenceImage:string,
    licenceNumber:string,
    estd:string,
    instaId:string,
    location?:LocationData,
    role:string; 
}