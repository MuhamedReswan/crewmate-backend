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

