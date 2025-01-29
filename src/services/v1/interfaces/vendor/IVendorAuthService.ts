import IVendor from "../../../../entities/v1/vendorEntity";
import { CustomTokenResponse } from "../../../../entities/v1/tokenEntity";
import { Register } from "../../../../entities/v1/authenticationEntity";

export interface VendorLoginResponse {
  vendor: IVendor; 
    accessToken: string;
    refreshToken: string;
}

 export interface IVendorAuthService {
    register(name:string, email:string, password:string,mobile:string): Promise<void>
    generateOTP(email:string): Promise<void>
    verifyOTP(email: string, otp: string): Promise<void>
    resendOtp(email: string): Promise<void>
    vendorLogin(email:string, password:string): Promise<VendorLoginResponse>
    forgotPassword(email:string): Promise<string>
    resetPasswordTokenVerify(email:string, token:string): Promise<void>
    resetPassword(password:string,email:string): Promise<void>
    resetPasswordLink(token:string,email:string): Promise<void>
    setNewAccessToken(refreshToken:string):Promise<CustomTokenResponse>
    googleRegister(data:Register): Promise <void>
    googleLogin(data:Register): Promise <void>





}