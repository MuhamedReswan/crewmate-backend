import { inject, injectable } from "tsyringe";
import { IServiceBoyRepository } from "../../../../repositories/v1/implimentation/serviceBoy/serviceBoy.repository";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import { resizeImage } from "../../../../utils/sharp.util";
import { ImageFiles, LocationData } from "../../../../types/type";
import s3 from "../../../../utils/s3.util";
import mongoose from "mongoose";

export interface IServiceBoyService {
  updateProfile(
    data: Partial<IServiceBoy>,
    files: any
  ): Promise<IServiceBoy | undefined>;
}

@injectable()
export default class ServiceBoyService implements IServiceBoyService {
  constructor(
    @inject("IServiceBoyRepository")
    private serviceBoyRepository: IServiceBoyRepository
  ) {}

  updateProfile = async (
    data: Partial<IServiceBoy>,
    files: ImageFiles
  ): Promise<IServiceBoy | undefined> => {
    try {
      console.log("servicefiles", files);
      console.log("test=========================data",data);
      console.log(" Profile Image:", files.profileImage);
      console.log("Aadhar Front:", files.aadharImageFront);
      console.log(" Aadhar Back:", files.aadharImageBack);

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
      console.log("data before process location----------------------------------------- ", data);

      if (typeof data.location === "string") {
        try {
          data.location = JSON.parse(data.location);
        } catch (error) {
          console.error("Failed to parse location:", error);
          data.location = undefined; // Handle invalid location gracefully
        }
      }

      console.log("data after process location----------------------------------- ", data);

      const _id = data._id;
      delete data._id;
      const updatedProfile = await this.serviceBoyRepository.updateProfile(
        { _id: _id },
        data
      );

      console.log("updatedProfile service", updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.log("updateProfile service error", error);
      throw error;
    }
  };
}
