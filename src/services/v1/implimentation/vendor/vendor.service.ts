import { inject, injectable } from "tsyringe";
import { IVendorRepository } from "../../../../repositories/v1/implimentation/vendor/vendor.repository";
import IVendor from "../../../../entities/v1/vendorEntity";
import { ImageFiles } from "../../../../types/type";
import { resizeImage } from "../../../../utils/sharp.util";
import s3 from "../../../../utils/s3.util";

export interface IVendorService {
  updateVendorProfile: (body: Partial<IVendor>, files: ImageFiles) => Promise<IVendor | undefined>;
}

@injectable()
export default class VendorService implements IVendorService {
  constructor(@inject("IVendorRepository") private vendorRepository: IVendorRepository) {}

  public updateVendorProfile = async (
    data: Partial<IVendor>,
    files: ImageFiles
  ): Promise<IVendor | undefined> => {
    try {
      // Log input for debugging
      console.log("body", data);
      console.log("files", files);

      // Handle profile image
      data.profileImage = await this.handleImageUpload(
        files.profileImage,
        "profileImage",
        data.name
      );

      // Handle licence image
      data.licenceImage = await this.handleImageUpload(
        files.licenceImage,
        "licenceImage",
        data.name
      );

      // Handle location parsing
      this.parseLocation(data);

      // Remove _id before update and keep it for filter
      const _id = data._id;
      delete data._id;

      // Perform DB update
      const updatedProfile = await this.vendorRepository.vendorUpdateProfile({ _id }, data);

      if (updatedProfile) {
        const { _id, name, email, profileImage, licenceImage } = updatedProfile;
        return { _id, name, email , profileImage, licenceImage } as IVendor;
      }

      return undefined;
    } catch (error) {
      console.error("Error updating vendor profile:", error);
      throw error;
    }
  };

  // 🔹 Handles resizing and uploading a single image type
  private async handleImageUpload(
    imageArray?: { buffer: Buffer; mimetype: string }[],
    imageType?: string,
    userName?: string
  ): Promise<string | undefined> {
    if (imageArray && imageArray.length === 1) {
      await this.resizeImageBuffer(imageArray);
      const key = `${userName}-${imageType}-${Date.now()}`;
      await s3.uploadImageToBucket(imageArray[0].buffer, imageArray[0].mimetype, key);
      // return s3.getImageUrlFromBucket(key);
      return key
    }
    return undefined;
  }

  // 🔹 Resizes image buffer using Sharp
  private async resizeImageBuffer(imageArray: { buffer: Buffer }[]): Promise<void> {
    if (imageArray.length === 1) {
      const resizedBuffer = await resizeImage(imageArray[0].buffer);
      if (resizedBuffer) {
        imageArray[0].buffer = resizedBuffer;
      }
    }
  }

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
}
