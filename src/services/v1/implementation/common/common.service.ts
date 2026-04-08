import s3Util from "../../../../utils/s3.util";
import logger from "../../../../utils/logger.util";
import { ICommonService } from "../../interfaces/common/ICommon.service";
import { generateSignedUrl } from "../../../../utils/cloudinary.util";


export default class CommonService implements ICommonService {
  constructor() {}

  streamImageByKey = async(key:string):Promise<string | undefined> =>  {
    try{
let imageUrl = await s3Util.getImageUrlFromBucket(key);
logger.info("imageUrl",{imageUrl});
if(imageUrl){
    return imageUrl;
}
    }catch(error){
        throw error;
    }
  };

   getSecureDocumentUrl = async (publicId: string) => {
  if (!publicId) {
    throw new Error("publicId is required");
  }

  // 🔑 generate signed URL
  const url = generateSignedUrl(publicId);

  return url;
};
  
}