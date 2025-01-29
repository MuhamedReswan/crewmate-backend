import { inject, injectable } from "tsyringe";
import { IVendorAuthService, IVendorLoginResponse } from "../../interfaces/vendor/IVendorAuthService";
import { BadrequestError } from "../../../../utils/errors/badRequest.error";
import { deleteRedisData, getRedisData, setRedisData } from "../../../../utils/redis.util";
import { ResponseMessage } from "../../../../enums/resposnseMessage";
import { IVendorAuthRepository } from "../../../../repositories/v1/interfaces/vendor/vendorAuth.repository";
import { createOtp, sendOtpEmail } from "../../../../utils/otp.util";
import { ExpiredError } from "../../../../utils/errors/expired.error";
import { hashPassword } from "../../../../utils/password.util";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import bcrypt from 'bcrypt';
import { ValidationError } from "../../../../utils/errors/validation.error";
import { generateAccessToken, generateRefreshToken } from "../../../../utils/jwt.util";

@injectable()
    export default class VendorAuthService implements IVendorAuthService {
              constructor(@inject('IVendorAuthRepository') private vendorAuthRepository: IVendorAuthRepository){}


    async register(name: string, email: string, password: string, mobile: string): Promise<void> {
        console.log("vendorAut register got");
const existingVendor = await this.vendorAuthRepository.findVendorByEmail(email);
if(existingVendor) throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_USED);

await setRedisData(`vendor:${email}`,JSON.stringify({name,email,password,mobile}),3600)
const registerFromRedis = await getRedisData(`vendor:${email}`);
console.log("registerFromRedis vendor auth",registerFromRedis);
    };


       async generateOTP(email:string){
            try {
                const vendor = await this.vendorAuthRepository.findVendorByEmail(email);
            if(vendor) throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_VERIFIED);
    
            const otp = createOtp();
            await setRedisData(`otpV:${email}`, JSON.stringify({otp}),120);
            const savedOtp = await getRedisData(`otpV:${email}`);
            console.log("savedOtp",savedOtp);
            await sendOtpEmail(email, otp);
    
            } catch (error) {
               console.log(error); 
               throw error;
            } 
        };

        async verifyOTP(email: string, otp: string): Promise<void> {
            try {
                console.log("within verify otp in vendor authservice");
                console.log(`email:${email},otp:${otp} serivce`);
        
                const savedOtp = await getRedisData(`otpV:${email}`);
                console.log("savedOtp",savedOtp)
                if(!savedOtp) throw new ExpiredError(ResponseMessage.OTP_EXPIRED)
            
                const {otp: savedOtpValue} = JSON.parse(savedOtp);
                console.log("savedOtpValue",savedOtpValue);
                console.log("otp",otp);
                if(otp !== savedOtpValue) throw new BadrequestError(ResponseMessage.INVALID_OTP);
    
                const deleteOtp = await deleteRedisData(`otpV:${email}`);
                console.log("deleteotp",deleteOtp);
                
               const vendorData  = await getRedisData(`vendor:${email}`)
               console.log("vendorData  from serivice",vendorData);
               if(vendorData){
                 const vendorDataObject = JSON.parse(vendorData);
                 console.log("parsed vendorData  from serivice",vendorDataObject);
    
                 vendorDataObject.password = await hashPassword(vendorDataObject.password);
                const createdVendor = await this.vendorAuthRepository.createVendor(vendorDataObject);
                console.log("createdVendor from service",createdVendor);
                 await deleteRedisData(`vendor:${email}`); 
              }
            } catch (error) {
                console.log(error);
                throw error;
            }
        };



        async resendOtp (email:string): Promise <void> {
            try {
                await deleteRedisData(`otpV${email}`);
                const otp = createOtp();
                await setRedisData(`otpV:${email}`, JSON.stringify({otp}),120);
                let savedOtp = await getRedisData(`otpV:${email}`);
                console.log("savedOtp",savedOtp);
                await sendOtpEmail(email, otp);    
            } catch (error) {
                throw error
            }
               };



               async vendorLogin(email: string, password: string): Promise<IVendorLoginResponse> {
                try {
                    const vendor = await this.vendorAuthRepository.findVendorByEmail(email);
                    console.log("vendor login service",vendor);
                if(!vendor){
                    throw new NotFoundError("Invalid credentials");
                }
                const validPassword = await bcrypt.compare(password,vendor.password);
                if(!validPassword)throw new ValidationError("Invalid credentials");
                    console.log("validPassword login service",validPassword);
                    const role = 'Vendor';
                    const accessToken = generateAccessToken({ role, data: vendor });
                    const refreshToken = generateRefreshToken({ role, data: vendor });
                    console.log("refresh token",refreshToken);
                    console.log("accessToken token",accessToken);
        return {vendor,accessToken,refreshToken};
                } catch (error) {
                    throw error;
                }
            };
        


        
}