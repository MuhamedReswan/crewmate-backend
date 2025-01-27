import { vendorModel } from "../../../../models/v1/vendor.model";
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


    async createVendor(vendorData: any): Promise<any>{
        try {
            console.log("vendor got");
            console.log("vendorData",vendorData);
        
            let vendorDetails =  await vendorModel.create(vendorData);
            console.log("vendorDetails from repo create",vendorDetails)
        } catch (error) {
            console.log("error from createServiceBoy repository",error)
            throw error
        }
    }
}