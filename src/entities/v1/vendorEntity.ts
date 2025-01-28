import { ObjectId } from "mongoose";

export default interface IVendor extends Document {
    _id?:ObjectId;
    name?:string, 
    email:string,
    mobile?:string,
    password?:string,
    isVerified?:boolean,
    profileImage?:string
}