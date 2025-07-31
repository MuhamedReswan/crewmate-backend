import { CustomTokenResponse } from "../../../../entities/v1/tokenEntity";
import { GoogleLogin, VendorLoginResponse } from "../../../../entities/v1/authenticationEntity";
import { Role } from "../../../../constants/Role";


 export interface IVendorAuthService {
    register(name:string, email:string, password:string,mobile:string): Promise<void>
    generateOTP(email:string): Promise<void>
    verifyOTP(email: string, otp: string): Promise<VendorLoginResponse | void>
    resendOtp(email: string): Promise<void>
    vendorLogin(email: string, password: string): Promise<VendorLoginResponse | undefined>  
    resetPasswordTokenVerify(email:string, token:string): Promise<void>
    resetPassword(password:string,email:string): Promise<void>
    resetPasswordLink(token:string,email:string,role:Role.VENDOR): Promise<void>
    setNewAccessToken(refreshToken:string):Promise<CustomTokenResponse>
    googleAuth(data: GoogleLogin): Promise <VendorLoginResponse | undefined>
    forgotPassword(email: string):Promise<string>





}