import exp from "constants";
import { RequestHandler } from "../../../../utils/type";
import IVendor from "../../../../entities/v1/vendorEntity";

export interface IVendorLoginResponse {
  vendor: IVendor; 
    accessToken: string;
    refreshToken: string;
}

 export interface IVendorAuthService {
    register(name:string, email:string, password:string,mobile:string): Promise<void>
    generateOTP(email:string): Promise<void>
    verifyOTP(email: string, otp: string): Promise<void>
    resendOtp(email: string): Promise<void>
    vendorLogin(email:string, password:string): Promise<IVendorLoginResponse>
    forgotPassword(email:string): Promise<string>
    resetPasswordTokenVerify(email:string, token:string): Promise<void>
    resetPassword(password:string,email:string): Promise<void>
    resetPasswordLink(token:string,email:string): Promise<void>




}