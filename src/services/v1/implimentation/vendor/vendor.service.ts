import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../../../repositories/v1/implimentation/vendor/vendor.repository";
import IVendor from "../../../../entities/v1/vendorEntity";
import { ImageFiles } from "../../../../types/type";
import logger from "../../../../utils/logger.util";
import { processAndUploadImage } from "../../../../utils/imageUpload.util";
import s3Util from "../../../../utils/s3.util";
import { formatFilesForLog } from "../../../../utils/formatFilesForLog.util";
import { VerificationStatus, VerificationStatusType } from "../../../../constants/verificationStatus";
import { VendorLoginDTO } from "../../../../dtos/v1/vendor.dto";
import { mapToVendorLoginDTO } from "../../../../mappers.ts/vendor.mapper";

export interface IVendorService {
  updateVendorProfile: (body: Partial<IVendor>, files: ImageFiles) => Promise<IVendor | undefined>;
   loadVendorProfile (_id:Partial<IVendor>):Promise<IVendor | undefined> 
   retryVerification (_id:Partial<IVendor>,isVerified:VerificationStatusType):Promise<IVendor | undefined> 
   loadVendorById (_id:Partial<IVendor>):Promise<VendorLoginDTO | undefined> 
}

@injectable()
export default class VendorService implements IVendorService {
  constructor(@inject("IVendorRepository") private _vendorRepository: IVendorRepository) {}

  public updateVendorProfile = async (
    data: Partial<IVendor>,
    files: ImageFiles
  ): Promise<IVendor | undefined> => {

    let uploadedNewImages: string[] = []; // Track successfully uploaded new images
    let oldVendorProfile: Partial<IVendor> | undefined;
    try {
      logger.debug("Updating vendor profile", { data, files: formatFilesForLog(files) });

 const hasAnyFile =
      (files.licenceImage && files.licenceImage.length > 0) ||
      (files.profileImage && files.profileImage.length > 0);

         if (hasAnyFile) {
            oldVendorProfile = await this._vendorRepository.findVendor({ _id: data._id });
            logger.debug("oldVendorProfile------------",{oldVendorProfile});
          }

const imagesToDelete: string[] = [];
const uploadTasks: Promise<void>[] = [];

  if (files.profileImage) {
      uploadTasks.push(
        processAndUploadImage(files.profileImage, "profileImage", data.name)
          .then((url) => {
            data.profileImage = url;
            uploadedNewImages.push(url!);
            if (oldVendorProfile?.profileImage) {
              imagesToDelete.push(oldVendorProfile.profileImage);
            }
          })
      );
    }

  if (files.licenceImage) {
      uploadTasks.push(
        processAndUploadImage(files.licenceImage, "licenceImage", data.name)
          .then((url) => {
            data.licenceImage = url;
            uploadedNewImages.push(url!);
            if (oldVendorProfile?.licenceImage) {
              imagesToDelete.push(oldVendorProfile.licenceImage);
            }
          })
      );
    }

     await Promise.all(uploadTasks);

      this.parseLocation(data);

      // Remove _id before update and keep it for filter
      const _id = data._id;
      delete data._id;

      const updatedProfile = await this._vendorRepository.updateVendor({ _id }, data);

          if (imagesToDelete.length > 0) {
      (async () => {
        await Promise.all(
          imagesToDelete.map((image) =>
            s3Util.deleteImageFromBucket(image).catch((err) => {
              logger.error("Failed to delete old image from S3", { image, err });
            })
          )
        );
      })();
    }

      if (updatedProfile) {
     return updatedProfile as IVendor;
      }

      return undefined;
    } catch (error) {
         if (uploadedNewImages.length > 0) {
      await Promise.all(
        uploadedNewImages.map((image) =>
          s3Util.deleteImageFromBucket(image).catch((err) =>
            logger.error("Rollback failed to delete uploaded image", { image, err })
          )
        )
      );
    }
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
    const vendorProfile = await this._vendorRepository.findVendor(_id);
    return vendorProfile;
  } catch (error) {
    throw error;
  }
};

  retryVerification = async(_id:Partial<IVendor>,isVerified:VerificationStatusType):Promise<IVendor | undefined> => {
    try {
        const updateData: Partial<IVendor> = { isVerified };
             if (isVerified !== VerificationStatus.Rejected) {
            updateData.rejectionReason = null;
          }
const vendorProfile = await this._vendorRepository.updateVendor(_id,updateData);
return vendorProfile;
       } catch (error) {
      throw error;
    }
  };

  loadVendorById = async(_id:Partial<IVendor>):Promise<VendorLoginDTO | undefined> => {
    try {
const vendor = await this._vendorRepository.findVendor(_id);
if(!vendor)return 
  return mapToVendorLoginDTO(vendor);

       } catch (error) {
      throw error;
    }
  };
}
