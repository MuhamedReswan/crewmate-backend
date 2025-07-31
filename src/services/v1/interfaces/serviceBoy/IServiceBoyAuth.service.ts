import { GoogleLogin, ServiceBoyLoginResponse } from "../../../../entities/v1/authenticationEntity";
import { Role } from "../../../../constants/Role";

export interface IServiceBoyAuthService {
    register(name:string, email:string, password:string,mobile:string): Promise<void>
    generateOTP(email:string): Promise<void>
    verifyOTP(email:string, otp:string): Promise<ServiceBoyLoginResponse | void>
    serviceBoyLogin(email:string, password:string): Promise<ServiceBoyLoginResponse>
    resendOtp(email:string): Promise<void>
    setNewAccessToken(refreshToken:string):Promise<any>
    forgotPassword(email:string): Promise<string>
    resetPasswordTokenVerify(email:string, token:string): Promise<void>
    googleAuth(data: GoogleLogin): Promise <ServiceBoyLoginResponse | undefined>
    resetPassword(email:string, password:string): Promise<void>
    resetPasswordLink(token:string,email:string,role:Role): Promise<void>
}