import IVendor from "../../../../entities/v1/vendorEntity";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { vendorModel } from "../../../../models/v1/vendor.model";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { createOtp, sendOtpEmail } from "../../../../utils/otp.util";
import { deleteRedisData, getRedisData, setRedisData } from "../../../../utils/redis.util";
import { IVendorAuthRepository } from "../../interfaces/vendor/IVendorAuth.repository";
import { BaseRepository } from "../base/base.repository";
import { Register } from "../../../../entities/v1/authenticationEntity";
import { inject, injectable } from "tsyringe";
import { Model } from "mongoose";
import { partialUtil } from "zod/lib/helpers/partialUtil";

@injectable()
export default class VendorAuthRepository extends BaseRepository<IVendor> implements IVendorAuthRepository { 
    constructor(@inject("VendorModel") model: Model<IVendor> ){
        super(model);
    }
    async findVendorByEmail(email: string): Promise<IVendor | null>{
        try {
            return await vendorModel.findOne({email});
        } catch (error) {
            console.log(error);
            throw error
        }
    };


    async createVendor(vendorData: Partial<IVendor>): Promise<void>{
        try {
            console.log("vendor got");
            console.log("vendorData",vendorData);
        
            let vendorDetails =  await this.create(vendorData);
            console.log("vendorDetails from repo create",vendorDetails)
        } catch (error) {
            console.log("error from createServiceBoy repository",error)
            throw error
        }
    };


    async resendOtp (email:string): Promise <void> {
        try {
            await deleteRedisData(`otpV${email}`);
            const otp = createOtp();
            await setRedisData(`otpV:${email}`, JSON.stringify({otp}),120);
            let savedOtp = await getRedisData(`otpV:${email}`);
            console.log("savedOtpV",savedOtp);
            await sendOtpEmail(email, otp);    
        } catch (error) {
            throw error
        }
           };


           async updateVendorPassword(email:string, password:string): Promise<void>  {
               try {
               const updatedServiceBoy =  this.updateOne(
                   {email},
                   {password}
                   );
           
            if(!updatedServiceBoy){
           throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
            }
               } catch (error) {
                   throw error
               }
           };
}