import { Register } from "../../../../entities/v1/authenticationEntity";

export interface IVendorAuthRepository {
    findVendorByEmail(email:string):Promise<any>;
    resendOtp (email:string): Promise <void> 
createVendor(vendorData: Register): Promise<void>}