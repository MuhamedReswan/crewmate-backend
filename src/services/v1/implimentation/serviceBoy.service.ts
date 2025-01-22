import { injectable,inject } from "tsyringe";
import { IServiceBoyRepository } from "../../../repositories/v1/interfaces/IServiceBoyRepository";
import redisClient from "../../../utils/redisClient.util";
import { IServiceBoyService } from "../interfaces/IServiceBoyService";
import { sendOtpEmail } from "../../../utils/otp.util";
import { createOtp } from "../../../utils/otp.util";
import { hashPassword } from "../../../utils/password.util";
import { ExpiredError } from "../../../utils/errors/expired.error";
import { BadrequestError } from "../../../utils/errors/badRequest.error";
import { ResponseMessage } from "../../../enums/resposnseMessage";


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

await redisClient.setEx(`serviceBoy:${email}`,3600, JSON.stringify({name,email,password,mobile}));
let registerFromRedis = await redisClient.get(`serviceBoy:${email}`);
console.log("registerFromRedis",registerFromRedis);
    }


    async generateOTP(email:string){
        try {
            const serviceBoy = await this.serviceBoyRepository.findServiceBoyByEmail(email);
        if(serviceBoy) throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_VERIFIED);

        const otp = createOtp();
        await redisClient.setEx(`otpB:${email}`, 320, JSON.stringify({otp}));
        let savedOtp = await redisClient.get(`otpB:${email}`);
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
    
            const savedOtp = await redisClient.get(`otpB:${email}`);
            console.log("savedOtp",savedOtp)
            if(!savedOtp) throw new ExpiredError('OTP expired')
        
            const {otp: savedOtpValue} = JSON.parse(savedOtp);
            console.log("savedOtpValue",savedOtpValue);
            console.log("otp",otp);
            if(otp !== savedOtpValue) throw new BadrequestError('Invalid OTP');

            let deleteotp = await redisClient.del(`otpB:${email}`);
            console.log("deleteotp",deleteotp);
            
           let serviceBoyData  = await redisClient.get(`serviceBoy:${email}`);
           console.log("serviceBoyData  from serivice",serviceBoyData);
           if(serviceBoyData){
             let serviceBoyDataObject = JSON.parse(serviceBoyData);
             console.log("parsed serviceBoyData  from serivice",serviceBoyDataObject);

             serviceBoyDataObject.password = await hashPassword(serviceBoyDataObject.password);
            let createdBoy = await this.serviceBoyRepository.createServiceBoy(serviceBoyDataObject);
            console.log("createdBoy from service",createdBoy);
             await redisClient.del(`serviceBoy:${email}`); 
          }
         

        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    



}