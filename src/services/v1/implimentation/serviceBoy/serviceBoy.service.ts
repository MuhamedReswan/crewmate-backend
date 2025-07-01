import { inject, injectable } from "tsyringe";
import { IServiceBoyRepository } from "../../../../repositories/v1/implimentation/serviceBoy/serviceBoy.repository";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import { resizeImage } from "../../../../utils/sharp.util";
import { ImageFiles, LocationData } from "../../../../types/type";
import s3 from "../../../../utils/s3.util";
import mongoose from "mongoose";
import logger from "../../../../utils/logger.util";

export interface IServiceBoyService {
  updateProfile(
    data: Partial<IServiceBoy>,
    files: any
  ): Promise<IServiceBoy | undefined>
  

  LoadProfile (_id:Partial<IServiceBoy>):Promise<IServiceBoy | undefined> 
}

@injectable()
export default class ServiceBoyService implements IServiceBoyService {
  constructor(
    @inject("IServiceBoyRepository")
    private serviceBoyRepository: IServiceBoyRepository
  ) {}


  LoadProfile = async(_id:Partial<IServiceBoy>):Promise<IServiceBoy | undefined> => {
    try {
const serviceBoyProfile = await this.serviceBoyRepository.loadProfile(_id)
return serviceBoyProfile
       } catch (error) {
      throw error;
    }
  };




  updateProfile = async (
    data: Partial<IServiceBoy>,
    files: ImageFiles
  ): Promise<IServiceBoy | undefined> => {
    try {
    logger.debug("Received profile update files", { files });
      logger.debug("Initial profile update data", { data });

      const resizeAndAssignBuffer = async (
        imageArray?: { buffer: Buffer }[]
      ) => {
        if (imageArray && imageArray.length === 1) {
          const resizedBuffer = await resizeImage(imageArray[0].buffer);
          if (resizedBuffer) {
            imageArray[0].buffer = resizedBuffer;
          }
        }
      };

      const processAndUploadImage = async (
        imageArray?: { buffer: Buffer; mimetype: string }[],
        imageType?: string,
        userName?: string
      ): Promise<string | undefined> => {
        if (imageArray && imageArray.length === 1) {
          await resizeAndAssignBuffer(imageArray);
          let imageName = `${userName}-${imageType}-${Date.now()}`;
          await s3.uploadImageToBucket(
            imageArray[0].buffer,
            imageArray[0].mimetype,
            imageName
          );
          return s3.getImageUrlFromBucket(imageName);
        }
        return undefined;
      };

      // Process and upload profile image
      if (files.profileImage) {
        data.profileImage = await processAndUploadImage(
          files.profileImage,
          "profileImage",
          data.name
        );
      }

      // Process and upload Aadhar front image
      if (files.aadharImageFront) {
        data.aadharImageFront = await processAndUploadImage(
          files.aadharImageFront,
          "aadharImageFront",
          data.name
        );
      }

      // Process and upload Aadhar back image
      if (files.aadharImageBack) {
        data.aadharImageBack = await processAndUploadImage(
          files.aadharImageBack,
          "aadharImageBack",
          data.name
        );
      }
      logger.debug("Profile update data before location parsing", { data });

      if (typeof data.location === "string") {
        try {
          data.location = JSON.parse(data.location);
        } catch (error) {
          logger.warn("Invalid location JSON string", { location: data.location, error });
          data.location = undefined; // Handle invalid location gracefully
        }
      }

      logger.debug("Final profile update data", { data });

      const _id = data._id;
      delete data._id;
      const updatedProfile = await this.serviceBoyRepository.updateProfile(
        { _id: _id },
        data
      );

      logger.debug("Updated profile data", { updatedProfile });
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  }
  };

