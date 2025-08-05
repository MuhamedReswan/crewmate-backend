import s3Util from "../../../../utils/s3.util";
import logger from "../../../../utils/logger.util";

export interface ICommonService{
streamImageByKey(key:string):Promise<string | undefined>
}

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
  
}