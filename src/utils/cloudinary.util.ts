// import { v2 as cloudinary } from "cloudinary";
// import streamifier from "streamifier";

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_NAME!,
//   api_key: process.env.CLOUDINARY_KEY!,
//   api_secret: process.env.CLOUDINARY_SECRET!,
// });

// export const uploadAndResizeImage = (
//   buffer: Buffer,
//   folderName: string
// ): Promise<{ url: string; publicId: string }> => {
//   return new Promise((resolve, reject) => {
//     const stream = cloudinary.uploader.upload_stream(
//       {
//         folder: folderName,
//         transformation: [
//           {
//             width: 200,
//             height: 200,
//             crop: "pad", // similar to fit: 'contain'
//             background: "white"
//           }
//         ]
//       },
//       (error, result) => {
//         if (error || !result) return reject(error);

//         resolve({
//           url: result.secure_url,
//           publicId: result.public_id
//         });
//       }
//     );

//     streamifier.createReadStream(buffer).pipe(stream);
//   });
// };

import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

import { IImage, ISecureImage, UploadOptions } from "../types";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME!,
  api_key: process.env.CLOUDINARY_KEY!,
  api_secret: process.env.CLOUDINARY_SECRET!,
});

// Upload buffer → Cloudinary
export const uploadImageToCloudinary = (
  buffer: Buffer,
  options: UploadOptions
): Promise<ISecureImage | IImage> => {
  const { folderName, publicId, isSecure } = options;
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folderName,
        public_id: publicId,
        type: isSecure ? "private" : "upload",
      },
      (error, result) => {
        if (error || !result) return reject(error);

        if (isSecure) {
          resolve({
            publicId: result.public_id,
          });
        } else {
          resolve({
            publicId: result.public_id,
            url: result.secure_url,
          });
        }
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Delete image
export const deleteImageFromCloudinary = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};

export const uploadImageFromUrlToCloudinary = async (
  imageUrl: string,
  publicId: string,
  folder: string
): Promise<{ publicId: string; url: string }> => {
  try {
    const result = await cloudinary.uploader.upload(imageUrl, {
      public_id: publicId,
      folder,
    });

    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    throw error;
  }
};

export const generateSignedUrl = (publicId: string): string => {
  return cloudinary.url(publicId, {
    type: "private",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 600, // 10 min
  });
};
