import { inject, injectable } from "tsyringe";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import { ImageFiles } from "../../../../types/type";
import logger from "../../../../utils/logger.util";
import { handleImagesUpload,  } from "../../../../utils/imageUpload.util";
import s3Util from "../../../../utils/s3.util"; 
import { formatFilesForLog } from "../../../../utils/formatFilesForLog.util";
import { VerificationStatus, VerificationStatusType } from "../../../../constants/status";
import { ServiceBoyLoginDTO } from "../../../../dtos/v1/serviceBoy.dto";
import { mapToServiceBoyLoginDTO } from "../../../../mappers.ts/serviceBoy.mapper";
import { IServiceBoyService } from "../../interfaces/serviceBoy/IServiceBoy.service";
import { IServiceBoyRepository } from "../../../../repositories/v1/interfaces/serviceBoy/IServiceBoy.repository";
import { deleteImageFromCloudinary } from "../../../../utils/cloudinary.util";


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
      files.profileImage?.length ||
      files.aadharImageFront?.length ||
      files.aadharImageBack?.length;

    if (hasAnyFile) {
      oldServiceBoyProfile = await this._serviceBoyRepository.loadProfile({ _id: data._id });
    }

    const imagesToDelete: string[] = [];

    await handleImagesUpload<IServiceBoy>(
  [
    {
      file: files.profileImage,
      field: "profileImage",
      type: "profileImage",
      folder: "profileImages",
      isSecure: false,
    },
    {
      file: files.aadharImageFront,
      field: "aadharImageFront",
      type: "aadharImageFront",
      folder: "aadharImages",
      isSecure: true,
    },
    {
      file: files.aadharImageBack,
      field: "aadharImageBack",
      type: "aadharImageBack",
      folder: "aadharImages",
      isSecure: true,
    },
  ],
  data,
  oldServiceBoyProfile,
  uploadedNewImages,
  imagesToDelete
);

    if (!files.profileImage?.length) {
      delete data.profileImage;
    }

    if (!files.aadharImageFront?.length) {
      delete data.aadharImageFront;
    }

    if (!files.aadharImageBack?.length) {
      delete data.aadharImageBack;
    }


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


        // 🔥 Delete old images
    if (imagesToDelete.length > 0) {
      (async () => {
        await Promise.all(
          imagesToDelete.map((publicId) =>
            deleteImageFromCloudinary(publicId).catch(() => {})
          )
        );
      })();
    }

    return updatedProfile;
  } catch (error) {
    logger.error("Profile update failed, rolling back uploads", { error });


     if (uploadedNewImages.length > 0) {
      await Promise.all(
        uploadedNewImages.map((publicId) =>
          deleteImageFromCloudinary(publicId).catch(() => {})
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

