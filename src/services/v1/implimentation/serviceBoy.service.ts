import { injectable,inject } from "tsyringe";
import { IServiceBoyRepository } from "../../../repositories/v1/interfaces/IServiceBoyRepository";
import { deleteRedisData, getRedisData, setRedisData } from "../../../utils/redis.util";
import { IServiceBoyLoginResponse, IServiceBoyService } from "../interfaces/IServiceBoyService";
import { sendOtpEmail } from "../../../utils/otp.util";
import { createOtp } from "../../../utils/otp.util";
import { hashPassword } from "../../../utils/password.util";
import { ExpiredError } from "../../../utils/errors/expired.error";
import { BadrequestError } from "../../../utils/errors/badRequest.error";
import { ResponseMessage } from "../../../enums/resposnseMessage";
import { NotFoundError } from "../../../utils/errors/notFound.error";
import bcrypt from 'bcrypt';
import { ValidationError } from "../../../utils/errors/validation.error";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../../utils/jwt.util";
import IServiceBoy from "../../../entities/v1/serviceBoyEntity";
import { UnAuthorizedError } from "../../../utils/errors/unAuthorized.error";



@injectable()
export default class ServiceBoyService implements IServiceBoyService{
    private serviceBoyRepository: IServiceBoyRepository;

    constructor(@inject("IServiceBoyRepository") serviceBoyRepository: IServiceBoyRepository){
        this.serviceBoyRepository = serviceBoyRepository;
    }


     async register(name: string, email: string, password: string, mobile: string): Promise<void> {
        console.log("ServiceBoyServie register got");
const existingServiceBoy = await this.serviceBoyRepository.findServiceBoyByEmail(email);
if(existingServiceBoy) throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_USED);

await setRedisData(`serviceBoy:${email}`,JSON.stringify({name,email,password,mobile}),3600)
let registerFromRedis = await getRedisData(`serviceBoy:${email}`);
console.log("registerFromRedis",registerFromRedis);
    }


    async generateOTP(email:string){
        try {
            const serviceBoy = await this.serviceBoyRepository.findServiceBoyByEmail(email);
        if(serviceBoy) throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_VERIFIED);

        const otp = createOtp();
        await setRedisData(`otpB:${email}`, JSON.stringify({otp}),120);
        let savedOtp = await getRedisData(`otpB:${email}`);
        console.log("savedOtp",savedOtp);
        await sendOtpEmail(email, otp);

        } catch (error) {
           console.log(error); 
           throw error;
        }
        
    }


    async verifyOTP(email: string, otp: string): Promise<void> {
        try {
            console.log("within verify otp in service");
            console.log(`email:${email},otp:${otp} serivce`);
    
            const savedOtp = await getRedisData(`otpB:${email}`);
            console.log("savedOtp",savedOtp)
            if(!savedOtp) throw new ExpiredError('OTP expired')
        
            const {otp: savedOtpValue} = JSON.parse(savedOtp);
            console.log("savedOtpValue",savedOtpValue);
            console.log("otp",otp);
            if(otp !== savedOtpValue) throw new BadrequestError('Invalid OTP');

            let deleteotp = await deleteRedisData(`otpB:${email}`);
            console.log("deleteotp",deleteotp);
            
           let serviceBoyData  = await getRedisData(`serviceBoy:${email}`)
           console.log("serviceBoyData  from serivice",serviceBoyData);
           if(serviceBoyData){
             let serviceBoyDataObject = JSON.parse(serviceBoyData);
             console.log("parsed serviceBoyData  from serivice",serviceBoyDataObject);

             serviceBoyDataObject.password = await hashPassword(serviceBoyDataObject.password);
            let createdBoy = await this.serviceBoyRepository.createServiceBoy(serviceBoyDataObject);
            console.log("createdBoy from service",createdBoy);
             await deleteRedisData(`serviceBoy:${email}`); 
          }
        } catch (error) {
            console.log(error);
            throw error;
        }
    }


    async serviceBoyLogin(email: string, password: string): Promise<IServiceBoyLoginResponse> {
        try {
            const serviceBoy = await this.serviceBoyRepository.findServiceBoyByEmail(email);
            console.log("serviceBoy login service",serviceBoy);
        if(!serviceBoy){
            throw new NotFoundError("Invalid credentials");
        }
        const validPassword = await bcrypt.compare(password,serviceBoy.password);
        if(!validPassword)throw new ValidationError("Invalid credentials");
            console.log("validPassword login service",validPassword);
            const role = 'Service Boy';
            const accessToken = generateAccessToken(serviceBoy,role);
            const refreshToken = generateRefreshToken(serviceBoy,role);
            console.log("refresh token",refreshToken);
            console.log("accessToken token",accessToken);
return {serviceBoy,accessToken,refreshToken};
        } catch (error) {
            throw error;
        }
    }



   async resendOtp (email:string): Promise <void> {
try {
    await deleteRedisData(`otpB${email}`);
    const otp = createOtp();
    await setRedisData(`otpB:${email}`, JSON.stringify({otp}),120);
    let savedOtp = await getRedisData(`otpB:${email}`);
    console.log("savedOtp",savedOtp);
    await sendOtpEmail(email, otp);    
} catch (error) {
    throw error
}
   }


   async setNewAccessToken (refreshToken:string): Promise <any>{
    try {
       const decoded =  await verifyRefreshToken(refreshToken);
       const serviceBoy = decoded?.serviceBoy;
       const role = decoded?.role ?? "Service Boy";
       console.log("sevice boy from setNewAccessToken from service",serviceBoy);
       console.log("role from setNewAccessToken from service",role);

       if(!decoded || !serviceBoy ){
        throw new UnAuthorizedError(ResponseMessage.INVALID_REFRESH_TOKEN);
       }
        const accessToken = await generateAccessToken(serviceBoy,role);
        return {
            accessToken,
            message:"Access token set successfully from service",
            success:true,
        }

    } catch (error) {
        throw error;
    }
   }
    



}