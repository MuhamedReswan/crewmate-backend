import axios from 'axios';
import mime from 'mime-types';
import s3Operations from './s3.util';
import logger from './logger.util';

export const storeGoogleImageToS3 = async (
  imageUrl: string,
  userName: string,
  imageType: string = 'profileImage'
): Promise<string> => {
  try {

    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    const contentType = response.headers['content-type'];
    const fileExtension = mime.extension(contentType) || 'jpg';

    const imageName = `${userName}-${imageType}-${Date.now()}.${fileExtension}`;

    await s3Operations.uploadImageToBucket(buffer, contentType, imageName);
    logger.info("Image uploaded to S3 with key:", imageName);

    return imageName;
  } catch (error: unknown) {
    logger.error("Failed to upload Google Auth image to S3", error);
    throw new Error("Google image upload failed");
  }
};
