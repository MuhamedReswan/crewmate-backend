export interface IServiceBoyService {
    register(name:string, email:string, password:string,mobile:string): Promise<void>
    generateOTP(email:string): Promise<void>
    verifyOTP(email:string, otp:string): Promise<void>
}