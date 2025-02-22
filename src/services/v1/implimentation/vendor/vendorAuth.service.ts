import { inject, injectable } from "tsyringe";
import { IVendorAuthService } from "../../interfaces/vendor/IVendorAuthService";
import { BadrequestError } from "../../../../utils/errors/badRequest.error";
import { deleteRedisData, getRedisData, setRedisData } from "../../../../utils/redis.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { IVendorAuthRepository } from "../../../../repositories/v1/interfaces/vendor/IVendorAuth.repository";
import { createOtp, sendForgotPasswordLink, sendOtpEmail } from "../../../../utils/otp.util";
import { ExpiredError } from "../../../../utils/errors/expired.error";
import { hashPassword } from "../../../../utils/password.util";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import bcrypt from 'bcrypt';
import { ValidationError } from "../../../../utils/errors/validation.error";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../../../utils/jwt.util";
import * as crypto from 'crypto';
import { UnAuthorizedError } from "../../../../utils/errors/unAuthorized.error";
import { CustomTokenResponse } from "../../../../entities/v1/tokenEntity";
import { LoginResponse,Register } from "../../../../entities/v1/authenticationEntity";
import IVendor from "../../../../entities/v1/vendorEntity";
import { Role } from "../../../../constants/Role";

@injectable()
    export default class VendorAuthService implements IVendorAuthService {
              constructor(@inject('IVendorAuthRepository') private vendorAuthRepository: IVendorAuthRepository){}


    async register(name: string, email: string, password: string, mobile: string): Promise<void> {
        try {
            console.log("vendorAut register got");
            const existingVendor = await this.vendorAuthRepository.findVendorByEmail(email);
            console.log("existingVendor",existingVendor);
            if(existingVendor) throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_USED);
            
            await setRedisData(`vendor:${email}`,JSON.stringify({name,email,password,mobile}),3600)
            const registerFromRedis = await getRedisData(`vendor:${email}`);
            console.log("registerFromRedis vendor auth",registerFromRedis);
        } catch (error) {
          throw error;  
        }

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



               async vendorLogin(email: string, password: string): Promise<LoginResponse<IVendor,'vendor'>> {
                try {
                    const vendor = await this.vendorAuthRepository.findVendorByEmail(email);
                    console.log("vendor login service",vendor);
                if(!vendor){
                    throw new NotFoundError("Invalid credentials");
                }
                if(!vendor.password) throw new ValidationError("No password in vendor");
                
                const validPassword = await bcrypt.compare(password,vendor.password);
                if(!validPassword)throw new ValidationError(ResponseMessage.INVALID_CREDINTIALS);
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


               forgotPassword = async (email:string): Promise<string> =>{
                try {
                    const vendor = await this.vendorAuthRepository.findVendorByEmail(email);
                    if(!vendor) throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
                    const token = crypto.randomBytes(8).toString('hex');
                   await setRedisData(`forgotToken:${email}`, token , 1800 );
                    return token;
                } catch (error) {
                    throw error;
                }
               };


               resetPasswordTokenVerify = async (email:string, token:string): Promise<void> =>{
                try {
                  const  forgotTokenData = await getRedisData(`forgotToken:${email}`);
                  console.log("forgotTokenData from boy service",forgotTokenData);
                  if(!forgotTokenData){
                    throw new ExpiredError(ResponseMessage.FORGOT_PASSWORD_TOKEN_EXPIRED);
                  }
                  if( forgotTokenData != token){
                    throw new ValidationError(ResponseMessage.INVALID_FORGOT_PASSWORD_TOKEN);
                  }
                } catch (error) {
                    throw error;
                }
               };



               resetPassword = async (email:string, password:string): Promise<void> => {
                try {
                    const hashedPassword = await hashPassword(password);
                    await this.vendorAuthRepository.updateVendorPassword(email, hashedPassword);
                } catch (error) {
                    throw error;
                }
               };



               resetPasswordLink = async (token:string,email:string,role:Role): Promise<void>=>{
                   try {
                    console.log("email form vendor service",email,token);
                       await sendForgotPasswordLink(email,token,role);
                   } catch (error) {
                       throw error;
                   }
               }
        

 async setNewAccessToken (refreshToken:string): Promise <CustomTokenResponse>{
    try {
       const decoded =  await verifyRefreshToken(refreshToken);
       const role = decoded?.role ?? "Vendor";
       console.log("vendor from setNewAccessToken from service",decoded);
       console.log("role from setNewAccessToken from service",role);

       if(!decoded || !decoded.email ){
        throw new UnAuthorizedError(ResponseMessage.INVALID_REFRESH_TOKEN);
       }
       const vendor = await this.vendorAuthRepository.findVendorByEmail(decoded.email);
       if(!vendor) throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
        const accessToken = await generateAccessToken({data:vendor, role});
        return {
            accessToken,
            message:ResponseMessage.ACCESS_TOKEN_SET,
            success:true,
        }

    } catch (error) {
        throw error;
    }
   };


   googleRegister = async(data: Register): Promise<void> => {
       try {
           const existingVendor =await this.vendorAuthRepository.findVendorByEmail(data.email);
           if(existingVendor){
               throw new BadrequestError(ResponseMessage.EMAIL_ALREADY_USED);
           }
           await this.vendorAuthRepository.createVendor(data);
       } catch (error) {
           throw error;
       } 
      };
   
   
      googleLogin = async  (data: Register): Promise<void> => {
       try {
         const vendor =  await this.vendorAuthRepository.findVendorByEmail(data.email);
           console.log("service boy from repository google login",vendor);
           if(!vendor){
               throw new Error(ResponseMessage.USER_NOT_FOUND);
           }
       } catch (error) {
           throw error;
       }
      };
        
}