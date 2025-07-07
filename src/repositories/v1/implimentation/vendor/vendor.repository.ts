import { inject, injectable } from "tsyringe";
import IVendor from "../../../../entities/v1/vendorEntity";
import { BaseRepository } from "../base/base.repository";
import { Model } from "mongoose";
import logger from "../../../../utils/logger.util";

export interface IVendorRepository{
    vendorUpdateProfile (id: Partial<IVendor>, data: Partial<IVendor>): Promise<IVendor | undefined>
    loadProfile(id: Partial<IVendor>): Promise<IVendor | undefined>
}

@injectable()
export default class VendorRepository  extends BaseRepository<IVendor> implements IVendorRepository{
    constructor(@inject("VendorModel") model: Model<IVendor> ){
        super(model);
    }

    vendorUpdateProfile = async (id: Partial<IVendor>, data: Partial<IVendor>): Promise<IVendor | undefined> => {
        try {
      logger.debug("Updating vendor profile", { id, updateData: data });
            const updatedProfile = await this.updateOne(id, data);
      logger.debug("Vendor profile updated", { updatedProfile });

            if (updatedProfile) {
                return updatedProfile;
            }
            return;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    }


async loadProfile(_id: Partial<IVendor>): Promise<IVendor | undefined> {
  try {
    const vendorProfile = await this.findOne(_id);

    logger.debug("vendorProfile", { vendorProfile });

    if (vendorProfile) return vendorProfile;
    return;
  } catch (error) {
    throw error;
  }
}

}