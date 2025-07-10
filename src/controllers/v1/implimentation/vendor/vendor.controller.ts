import { inject, injectable } from "tsyringe";
import { IVendorService } from "../../../../services/v1/implimentation/vendor/vendor.service";
import { NextFunction, Request, Response } from "express";
import { promises } from "dns";
import { ImageFiles, RequestHandler } from "../../../../types/type";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import logger from "../../../../utils/logger.util";
import { Types } from "mongoose";

export interface IVendorController{
    updateVendorProfile:RequestHandler
    loadVendorProfile:RequestHandler
}

@injectable()
export default class VendorController implements IVendorController{
    constructor(@inject('IVendorService') private _vendorService: IVendorService) {}

    loadVendorProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        logger.info("req.params of vendor load profile", req.params);
        const { id } = req.params;

        const _id = new Types.ObjectId(id);
        const vendorProfile = await this._vendorService.loadVendorProfile({ _id });
        logger.info("vendorProfile from controller", vendorProfile);

        res.status(200).json(responseHandler(ResponseMessage.LOAD_PROFILE_SUCCESS, HttpStatusCode.OK, vendorProfile));
    } catch (error) {
        logger.error("VendorController: loadProfile error", error);
        next(error);
    }
}

     updateVendorProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
       try{
        logger.info("Updating vendor profile", {
        body: req.body,
        files: req.files,
      });

    const updateVendorProfile = await this._vendorService.updateVendorProfile(
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