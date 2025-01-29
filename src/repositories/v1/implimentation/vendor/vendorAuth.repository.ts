import IVendor from "../../../../entities/v1/vendorEntity";
import { vendorModel } from "../../../../models/v1/vendor.model";
import { createOtp, sendOtpEmail } from "../../../../utils/otp.util";
import { deleteRedisData, getRedisData, setRedisData } from "../../../../utils/redis.util";
import { IVendorAuthRepository } from "../../interfaces/vendor/vendorAuth.repository";

export default class VendorAuthRepository implements IVendorAuthRepository { 
    async findVendorByEmail(email: string): Promise<any>{
        try {
            return await vendorModel.findOne({email});
        } catch (error) {
            console.log(error);
            throw error
        }
    };


    async createVendor(vendorData: IVendor): Promise<void>{
        try {
            console.log("vendor got");
            console.log("vendorData",vendorData);
        
            let vendorDetails =  await vendorModel.create(vendorData);
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
}