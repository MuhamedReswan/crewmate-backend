import IServiceBoy from "../entities/v1/serviceBoyEntity";
import { IImage, ImageConfig, ISecureImage } from "../types";
import { uploadImageToCloudinary } from "./cloudinary.util";
import s3Util from "./s3.util";
import { resizeImage } from "./sharp.util";

    export const resizeAndAssignBuffer = async (
        imageArray?: { buffer: Buffer }[]
      ) => {
        if (imageArray && imageArray.length === 1) {
          const resizedBuffer = await resizeImage(imageArray[0].buffer);
          if (resizedBuffer) {
            imageArray[0].buffer = resizedBuffer;
          }
        }
      };

  // handle image with s3
    export   const processAndUploadImage = async (
        imageArray?: { buffer: Buffer; mimetype: string }[],
        imageType?: string,
        userName?: string
      ): Promise<string | undefined> => {
        if (imageArray && imageArray.length === 1) {
          await resizeAndAssignBuffer(imageArray);
          let imageName = `${userName}-${imageType}-${Date.now()}`;
          await s3Util.uploadImageToBucket(
            imageArray[0].buffer,
            imageArray[0].mimetype,
            imageName
          );
          return imageName;
        }
        return undefined;
      };
      
// handle image with cloudinary 
export const processAndUploadImagecloudinary = async (
  imageArray?: { buffer: Buffer; mimetype: string }[],
  imageType?: string,
  userName?: string,
  folderName: string = "images",
  isSecure?: boolean
): Promise<ISecureImage |IImage | undefined> => {
  if (imageArray && imageArray.length === 1) {
    await resizeAndAssignBuffer(imageArray);

    let imageName = `${userName}-${imageType}-${Date.now()}`;

    const result = await uploadImageToCloudinary(
      imageArray[0].buffer,
      { folderName,
  publicId: imageName,
  isSecure,
      }
    );

return result ;
  }
};


// export const handleImageUpload = async (
//   file: { buffer: Buffer; mimetype: string }[] | undefined,
//   imageType: string,
//   field: "profileImage" | "aadharImageFront" | "aadharImageBack",
//   data: Partial<IServiceBoy>,
//   oldProfile: Partial<IServiceBoy> | undefined,
//   uploadedNewImages: string[],
//   imagesToDelete: string[]
// ) => {
//   if (!file) return;

//   const image = await processAndUploadImage(file, imageType, data.name);

//   if (!image) return;

//   // ✅ assign new image
//   data[field] = image;

//   // ✅ track uploaded image (for rollback)
//   uploadedNewImages.push(image.publicId);

//   // ✅ collect old image for deletion
//   const oldImage = oldProfile?.[field];
//   if (oldImage?.publicId) {
//     imagesToDelete.push(oldImage.publicId);
//   }
// };


export const handleImagesUpload = async <T>(
  configs: ImageConfig<T>[],
  data: Partial<T>,
  oldData: Partial<T> | undefined,
  uploadedNewImages: string[],
  imagesToDelete: string[]
) => {
  await Promise.all(
    configs.map(async ({ file, field, type, folder, isSecure}) => {
      if (!file || file.length === 0) return;

      const image = await processAndUploadImagecloudinary(
        file,
        type,
        (data as any).name,
        folder,
        isSecure,
      );

      if (!image) return;
(data as any)[field] = image;

//  // 🔐 Handle secure vs public
//       if (isSecure) {
//         // 🔒 only publicId
//         (data as any)[field] = {
//           publicId: image.publicId,
//         };
//       } else {
//         // 🌐 public image
//         (data as any)[field] = 
//         {
//           publicId: image.publicId,
//           url: image.url,
//         };
//       }

      // track uploaded images
      uploadedNewImages.push(image.publicId);

      // collect old image publicId
      const oldImage = oldData?.[field] as any;
      if (oldImage?.publicId) {
        imagesToDelete.push(oldImage.publicId);
      }
    })
  );
};