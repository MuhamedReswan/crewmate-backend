import { inject, injectable } from "tsyringe";
import { IVendorAuthService } from "../../interfaces/vendor/IVendorAuthService";
import { BadrequestError } from "../../../../utils/errors/badRequest.error";
import { getRedisData, setRedisData } from "../../../../utils/redis.util";
import { ResponseMessage } from "../../../../enums/resposnseMessage";
import { IVendorAuthRepository } from "../../../../repositories/v1/interfaces/vendor/vendorAuth.repository";
import { createOtp, sendOtpEmail } from "../../../../utils/otp.util";

@injectable()
    export default class VendorAuthService implements IVendorAuthService {
              constructor(@inject('IVendorAuthRepository') private vendorAuthRepository: IVendorAuthRepository){}


    async register(name: string, email: string, password: string, mobile: string): Promise<void> {
        console.log("vendorAut register got");
const existingVendor = await this.vendorAuthRepository.findVendorByEmail(email);
if(existingVendor) throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_USED);

await setRedisData(`vendor:${email}`,JSON.stringify({name,email,password,mobile}),3600)
let registerFromRedis = await getRedisData(`vendor:${email}`);
console.log("registerFromRedis vendor auth",registerFromRedis);
    };


       async generateOTP(email:string){
            try {
                const vendor = await this.vendorAuthRepository.findVendorByEmail(email);
            if(vendor) throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_VERIFIED);
    
            const otp = createOtp();
            await setRedisData(`otpV:${email}`, JSON.stringify({otp}),120);
            let savedOtp = await getRedisData(`otpV:${email}`);
            console.log("savedOtp",savedOtp);
            await sendOtpEmail(email, otp);
    
            } catch (error) {
               console.log(error); 
               throw error;
            }
            
        }
}