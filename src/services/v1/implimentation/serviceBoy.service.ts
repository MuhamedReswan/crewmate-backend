import { injectable,inject } from "tsyringe";
import { IServiceBoyRepository } from "../../../repositories/v1/interfaces/IServiceBoyRepository";
import redisClient from "../../../utils/redisClient.util";
import { IServiceBoyService } from "../interfaces/IServiceBoyService";
import { sendOtpEmail } from "../../../utils/otp.util";
import { createOtp } from "../../../utils/otp.util";


@injectable()
export default class ServiceBoyService implements IServiceBoyService{
    private serviceBoyRepository: IServiceBoyRepository;

    constructor(@inject("IServiceBoyRepository") serviceBoyRepository: IServiceBoyRepository){
        this.serviceBoyRepository = serviceBoyRepository;
    }


     async register(name: string, email: string, password: string, mobile: string): Promise<void> {
        console.log("ServiceBoyServie register got");
const existingServiceBoy = await this.serviceBoyRepository.findServiceBoyByEmail(email);
if(existingServiceBoy) throw new Error('Email is already in use');

await redisClient.setEx(`email:${email}`,3600, JSON.stringify({name,email,password,mobile}));
let registerFromRedis = await redisClient.get(`email:${email}`);
console.log("registerFromRedis",registerFromRedis);
    }


    async generateOTP(email:string){
        const serviceBoy = await this.serviceBoyRepository.findServiceBoyByEmail(email);
        if(serviceBoy) throw new Error('Email already verified');

        const otp = createOtp();
        await redisClient.setEx(`otp:${email}`, 120, JSON.stringify({otp}));
        let savedOtp = await redisClient.get(`otp:${email}`);
        console.log("savedOtp",savedOtp);
        await sendOtpEmail(email, otp);
    }


    async verifyOTP(email: string, otp: string): Promise<void> {
        const savedOtp = await redisClient.get(`otp:${email}`);
        if(!savedOtp) throw new Error('OTP expired');

        const {otp: savedOtpValue} = JSON.parse(savedOtp);
        console.log("savedOtpValue",savedOtpValue);
        if(otp !== savedOtpValue) throw new Error('Invalid OTP');
        await redisClient.del(`otp:${email}`);
        await this.serviceBoyRepository.createServiceBoy({email});
    }
    



}