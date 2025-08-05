import { inject, injectable } from "tsyringe";
import { FilterQuery, Model } from "mongoose";
import IVendor from "../../../../entities/v1/vendorEntity";
import { BaseRepository } from "../base/base.repository";
import logger from "../../../../utils/logger.util";
import { VerificationStatus } from "../../../../constants/verificationStatus";

export interface IVendorRepository{
    updateVendor (id: Partial<IVendor>, data: Partial<IVendor>): Promise<IVendor | undefined>
    loadProfile(id: Partial<IVendor>): Promise<IVendor | undefined>
    loadAllVendorendingVerification(): Promise<IVendor[] | undefined>
}

@injectable()
export default class VendorRepository  extends BaseRepository<IVendor> implements IVendorRepository{
    constructor(@inject("VendorModel") model: Model<IVendor> ){
        super(model);
    }

    updateVendor = async (id: Partial<IVendor>, data: Partial<IVendor>): Promise<IVendor | undefined> => {
        try {
      logger.debug("Updating vendor", { id, updateData: data });
            const updatedVendor = await this.updateOne(id, data);
      logger.debug("Vendor updated", { updatedVendor });

            if (updatedVendor) {
                return updatedVendor;
            }
            return;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw error;
        }
    };


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


async loadAllVendorendingVerification(): Promise<IVendor[] | undefined>{
  try {
    const query: FilterQuery<IVendor> = {
  isVerified: VerificationStatus.Pending,
  mobile: { $exists: true },
  estd: { $exists: true }
};
    const pendingVerifications = await this.findAll(query);
    logger.info("pendingVerifications-- VendorRepository",{pendingVerifications});
    if(pendingVerifications) return pendingVerifications;
    return;
    
  } catch (error) {
    throw error;
  }
}

}