import { inject, injectable } from "tsyringe";
import { IVendorService } from "../../../../services/v1/implimentation/vendor/vendor.service";
import { NextFunction, Request, Response } from "express";
import { promises } from "dns";
import { ImageFiles, RequestHandler } from "../../../../types/type";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import logger from "../../../../utils/logger.util";

export interface IVendorController{
    updateVendorProfile:RequestHandler
}

@injectable()
export default class VendorController implements IVendorController{
    constructor(@inject('IVendorService') private vendorService: IVendorService) {}


     updateVendorProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
       try{
        logger.info("Updating vendor profile", {
        body: req.body,
        files: req.files,
      });

    const updateVendorProfile = await this.vendorService.updateVendorProfile(
        req.body,
        req.files as ImageFiles)

          if(updateVendorProfile){
                    res.status(200).json(responseHandler( ResponseMessage.PROFILE_UPDATED,HttpStatusCode.OK, updateVendorProfile));
                }else{
                    res.status(400).json(responseHandler( ResponseMessage.PROFILE_UPDATION_FAILED,HttpStatusCode.BAD_REQUEST));
                }
 }catch(error){
         logger.error("Error while updating vendor profile", error );
      next(error);
       }
     }
    }