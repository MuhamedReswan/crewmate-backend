import IServiceBoy from "../../../../entities/v1/serviceBoyEntity"
import { Register } from "../../../../entities/v1/authenticationEntity";
import { Role } from "../../../../constants/Role";
export  interface ServiceBoyLoginResponse {
    serviceBoy: IServiceBoy; 
    accessToken: string;
    refreshToken: string;
  }

    export interface IResetPassword{
      email:string,
      forgotToken?:string
      password: string
    }
  
export interface IServiceBoyAuthService {
    register(name:string, email:string, password:string,mobile:string): Promise<void>
    generateOTP(email:string): Promise<void>
    verifyOTP(email:string, otp:string): Promise<IServiceBoy | void>
    serviceBoyLogin(email:string, password:string): Promise<ServiceBoyLoginResponse>
    resendOtp(email:string): Promise<void>
    setNewAccessToken(refreshToken:string):Promise<any>
    forgotPassword(email:string): Promise<string>
    resetPasswordTokenVerify(email:string, token:string): Promise<void>
    googleRegister(data:Register): Promise <void>
    googleLogin(data:Register): Promise <void>
    resetPassword(email:string, password:string): Promise<void>
    resetPasswordLink(token:string,email:string,role:Role): Promise<void>
}