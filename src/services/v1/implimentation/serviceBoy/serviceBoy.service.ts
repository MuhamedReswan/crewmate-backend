import { inject, injectable } from "tsyringe";
import { IServiceBoyRepository } from "../../../../repositories/v1/implimentation/serviceBoy/serviceBoy.repository";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import { ImageFiles } from "../../../../types/type";
import logger from "../../../../utils/logger.util";
import { processAndUploadImage } from "../../../../utils/imageUpload.util";

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
    try {
    logger.debug("Received profile update files", { files });
      logger.debug("Initial profile update data", { data });

      

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
      const updatedProfile = await this._serviceBoyRepository.updateProfile(
        { _id: _id },
        data
      );

      logger.debug("Updated profile data", { updatedProfile });
      return updatedProfile;
    } catch (error) {
      throw error;
    }
  };
  };

