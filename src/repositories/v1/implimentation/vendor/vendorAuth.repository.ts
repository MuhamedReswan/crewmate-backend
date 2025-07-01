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
import logger from "../../../../utils/logger.util";

@injectable()
export default class VendorAuthRepository extends BaseRepository<IVendor> implements IVendorAuthRepository { 
    constructor(@inject("VendorModel") model: Model<IVendor> ){
        super(model);
    }
    async findVendorByEmail(email: string): Promise<IVendor | null>{
        try {

             logger.info("Finding vendor by email", { email });
      const vendor = await vendorModel.findOne({ email });

      if (!vendor) {
        logger.warn("No vendor found with given email", { email });
      }

      return vendor;
        } catch (error) {
            throw error
        }
    };


    async createVendor(vendorData: Partial<IVendor>): Promise<IVendor>{
        try {
          logger.info("Creating vendor", { vendorData });
        
            let vendorDetails =  await this.create(vendorData);
            logger.debug("Vendor created successfully", { vendorDetails });
            return vendorDetails
        } catch (error) {
            throw error
        }
    };


    async resendOtp (email:string): Promise <void> {
        try {
            await deleteRedisData(`otpV${email}`);
            const otp = createOtp();
            await setRedisData(`otpV:${email}`, JSON.stringify({otp}),120);
            let savedOtp = await getRedisData(`otpV:${email}`);
      logger.debug("Saved OTP for vendor", { email, otp, savedOtp });
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
            logger.warn("Vendor not found during password update", { email });
           throw new NotFoundError(ResponseMessage.USER_NOT_FOUND);
            }
               } catch (error) {
                   throw error
               }
           };
}