import { inject, injectable } from "tsyringe";
import { IServiceBoyRepository } from "../../../../repositories/v1/implimentation/serviceBoy/serviceBoy.repository";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import { ImageFiles } from "../../../../types/type";
import logger from "../../../../utils/logger.util";
import { processAndUploadImage } from "../../../../utils/imageUpload.util";
import s3Util from "../../../../utils/s3.util"; 
import { formatFilesForLog } from "../../../../utils/formatFilesForLog.util";
import { VerificationStatus, VerificationStatusType } from "../../../../constants/verificationStatus";
import { ServiceBoyLoginDTO } from "../../../../dtos/v1/serviceBoy.dto";
import { mapToServiceBoyLoginDTO } from "../../../../mappers.ts/serviceBoy.mapper";

export interface IServiceBoyService {
  updateProfile(
    data: Partial<IServiceBoy>,
    files: any
  ): Promise<IServiceBoy | undefined>
  

  LoadProfile (_id:Partial<IServiceBoy>):Promise<IServiceBoy | undefined> 
  retryVerification (_id:Partial<IServiceBoy>,isVerified:VerificationStatusType):Promise<IServiceBoy | undefined> 
  loadServiceBoyById (_id:Partial<IServiceBoy>):Promise<ServiceBoyLoginDTO | undefined>
}

@injectable()
export default class ServiceBoyService implements IServiceBoyService {
  constructor(
    @inject("IServiceBoyRepository")
    private _serviceBoyRepository: IServiceBoyRepository
  ) {}


  LoadProfile = async(_id:Partial<IServiceBoy>):Promise<IServiceBoy | undefined> => {
    try {
const serviceBoyProfile = await this._serviceBoyRepository.loadProfile(_id);
return serviceBoyProfile;
       } catch (error) {
      throw error;
    }
  };



updateProfile = async (
  data: Partial<IServiceBoy>,
  files: ImageFiles
): Promise<IServiceBoy | undefined> => {
  let uploadedNewImages: string[] = []; 
  let oldServiceBoyProfile: Partial<IServiceBoy> | undefined;

  try {
    logger.debug("Received profile update files", { files: formatFilesForLog(files) });
    logger.debug("Initial profile update data", { data });

    const hasAnyFile =
      (files.aadharImageBack && files.aadharImageBack.length > 0) ||
      (files.aadharImageFront && files.aadharImageFront.length > 0) ||
      (files.profileImage && files.profileImage.length > 0);

    if (hasAnyFile) {
      oldServiceBoyProfile = await this._serviceBoyRepository.loadProfile({ _id: data._id });
    }

    const imagesToDelete: string[] = [];
    const uploadTasks: Promise<void>[] = [];

    if (files.profileImage) {
      uploadTasks.push(
        processAndUploadImage(files.profileImage, "profileImage", data.name)
          .then((url) => {
            data.profileImage = url;
            uploadedNewImages.push(url!);
            if (oldServiceBoyProfile?.profileImage) {
              imagesToDelete.push(oldServiceBoyProfile.profileImage);
            }
          })
      );
    }

    if (files.aadharImageFront) {
      uploadTasks.push(
        processAndUploadImage(files.aadharImageFront, "aadharImageFront", data.name)
          .then((url) => {
            data.aadharImageFront = url;
            uploadedNewImages.push(url!);
            if (oldServiceBoyProfile?.aadharImageFront) {
              imagesToDelete.push(oldServiceBoyProfile.aadharImageFront);
            }
          })
      );
    }

    if (files.aadharImageBack) {
      uploadTasks.push(
        processAndUploadImage(files.aadharImageBack, "aadharImageBack", data.name)
          .then((url) => {
            data.aadharImageBack = url;
            uploadedNewImages.push(url!);
            if (oldServiceBoyProfile?.aadharImageBack) {
              imagesToDelete.push(oldServiceBoyProfile.aadharImageBack);
            }
          })
      );
    }

    // Run all uploads in parallel
    await Promise.all(uploadTasks);

    logger.debug("Profile update data before location parsing", { data });

    // Parse location if it's a string
    if (typeof data.location === "string") {
      try {
        data.location = JSON.parse(data.location);
      } catch (error) {
        logger.warn("Invalid location JSON string", { location: data.location, error });
        data.location = undefined;
      }
    }

    logger.debug("Final profile update data", { data });

    // Update DB
    const _id = data._id;
    delete data._id;
    const updatedProfile = await this._serviceBoyRepository.updateServiceBoy(
      { _id },
      data
    );

    logger.info("Images to delete after DB success", { imagesToDelete });
    logger.debug("Updated profile data", { updatedProfile });

    // Delete old images asynchronously
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

    return updatedProfile;
  } catch (error) {
    logger.error("Profile update failed, rolling back uploads", { error });

    // Rollback newly uploaded images if DB update/upload failed
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

  retryVerification = async(_id:Partial<IServiceBoy>,isVerified:VerificationStatusType):Promise<IServiceBoy | undefined> => {
    try {
      const updateData: Partial<IServiceBoy> = { isVerified };
       if (isVerified !== VerificationStatus.Rejected) {
      updateData.rejectionReason = null;
    }
    
const serviceBoyProfile = await this._serviceBoyRepository.updateServiceBoy(_id, updateData);
    return serviceBoyProfile;
       } catch (error) {
      throw error;
    }
  };


    loadServiceBoyById = async(_id:Partial<IServiceBoy>):Promise<ServiceBoyLoginDTO | undefined> => {
      try {
  const serviceBoy = await this._serviceBoyRepository.loadProfile(_id);
  if(!serviceBoy)return 
    return mapToServiceBoyLoginDTO(serviceBoy);
  
         } catch (error) {
        throw error;
      }
    };

  };

