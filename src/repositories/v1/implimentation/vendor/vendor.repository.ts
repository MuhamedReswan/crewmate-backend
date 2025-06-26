import { inject, injectable } from "tsyringe";
import IVendor from "../../../../entities/v1/vendorEntity";
import { BaseRepository } from "../base/base.repository";
import { Model } from "mongoose";

export interface IVendorRepository{
    vendorUpdateProfile (id: Partial<IVendor>, data: Partial<IVendor>): Promise<IVendor | undefined>
}

@injectable()
export default class VendorRepository  extends BaseRepository<IVendor> implements IVendorRepository{
    constructor(@inject("VendorModel") model: Model<IVendor> ){
        super(model);
    }

    vendorUpdateProfile = async (id: Partial<IVendor>, data: Partial<IVendor>): Promise<IVendor | undefined> => {
        try {
            console.log("id from vendor repository",id);
            const updatedProfile = await this.updateOne(id, data);
            console.log("updatedProfile-----------------",updatedProfile);
            console.log("data", data);

            if (updatedProfile) {
                return updatedProfile;
            }
            return;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }
}