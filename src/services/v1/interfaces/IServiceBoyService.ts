import IServiceBoy from "../../../entities/v1/serviceBoyEntity"
export  interface IServiceBoyLoginResponse {
    serviceBoy: IServiceBoy; 
    accessToken: string;
    refreshToken: string;
  }
  
export interface IServiceBoyService {
    register(name:string, email:string, password:string,mobile:string): Promise<void>
    generateOTP(email:string): Promise<void>
    verifyOTP(email:string, otp:string): Promise<void>
    serviceBoyLogin(email:string, password:string): Promise<IServiceBoyLoginResponse>
    resendOtp(email:string): Promise<void>
    setNewAccessToken(refreshToken:string):Promise<any>
    forgotPassword(email:string): Promise<string>
    forgotResetPassword(email:string, password:string): Promise<void>
    resetPasswordTokenVerify(email:string, token:string): Promise<void>
}