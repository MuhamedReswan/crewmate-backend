import { ObjectId } from "mongoose";
import { LocationData } from "../../types/type";

export default interface IVendor extends Document {
    _id?:ObjectId;
    name?:string, 
    email:string,
    mobile?:string,
    password?:string,
    isVerified?:boolean,
    profileImage?:string
    licenceImage?:string,
    licenceNumber?:string,
    location?:LocationData
}