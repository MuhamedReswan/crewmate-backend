import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../../../repositories/v1/implimentation/vendor/vendor.repository";
import IVendor from "../../../../entities/v1/vendorEntity";
import { ImageFiles } from "../../../../types/type";
import logger from "../../../../utils/logger.util";
import { processAndUploadImage } from "../../../../utils/imageUpload.util";

export interface IVendorService {
  updateVendorProfile: (body: Partial<IVendor>, files: ImageFiles) => Promise<IVendor | undefined>;
   loadVendorProfile (_id:Partial<IVendor>):Promise<IVendor | undefined> 
}

@injectable()
export default class VendorService implements IVendorService {
  constructor(@inject("IVendorRepository") private _vendorRepository: IVendorRepository) {}

  public updateVendorProfile = async (
    data: Partial<IVendor>,
    files: ImageFiles
  ): Promise<IVendor | undefined> => {
    try {
      logger.debug("Updating vendor profile", { data, files });

      if(files.profileImage){
        data.profileImage = await processAndUploadImage(
          files.profileImage,
          "profileImage",
          data.name
        );
      }

      if(files.licenceImage){
        data.licenceImage = await processAndUploadImage(
          files.licenceImage,
          "licenceImage",
          data.name
        );
      }

      this.parseLocation(data);

      // Remove _id before update and keep it for filter
      const _id = data._id;
      delete data._id;

      const updatedProfile = await this._vendorRepository.vendorUpdateProfile({ _id }, data);

      if (updatedProfile) {
     return updatedProfile as IVendor;
      }

      return undefined;
    } catch (error) {
      throw error;
    }
  };


  // 🔹 Safely parses JSON string for location
  private parseLocation(data: Partial<IVendor>) {
    if (typeof data.location === "string") {
      try {
        data.location = JSON.parse(data.location);
      } catch (error) {
        console.error("Failed to parse location:", error);
        data.location = undefined;
      }
    }
  }

  loadVendorProfile = async (_id: Partial<IVendor>): Promise<IVendor | undefined> => {
  try {
    const vendorProfile = await this._vendorRepository.loadProfile(_id);
    return vendorProfile;
  } catch (error) {
    throw error;
  }
};
}
