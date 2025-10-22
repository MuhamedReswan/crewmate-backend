import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { IVendorService } from "../../../../services/v1/implimentation/vendor/vendor.service";
import { ImageFiles, RequestHandler } from "../../../../types/type";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import logger from "../../../../utils/logger.util";
import { formatFilesForLog } from "../../../../utils/formatFilesForLog.util";
import { VerificationStatus } from "../../../../constants/verificationStatus";
import { ObjectId } from "mongodb";
import validateObjectId from "../../../../utils/validateObjectId.util";


export interface IVendorController{
    updateVendorProfile:RequestHandler
    loadVendorProfile:RequestHandler
    retryVendorVerfication:RequestHandler
    loadVendorById:RequestHandler
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
};

     updateVendorProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
       try{
        logger.info("Updating vendor profile", {
        body: req.body,
        files: formatFilesForLog(req.files),
      });

    const updateVendorProfile = await this._vendorService.updateVendorProfile(
        req.body,
        req.files as ImageFiles);

          if(updateVendorProfile){
                    res.status(200).json(responseHandler( ResponseMessage.PROFILE_UPDATED,HttpStatusCode.OK, updateVendorProfile));
                }else{
                    res.status(400).json(responseHandler( ResponseMessage.PROFILE_UPDATION_FAILED,HttpStatusCode.BAD_REQUEST));
                }
 }catch(error){
         logger.error("Error while updating vendor profile", error );
      next(error);
       }
     };


     retryVendorVerfication = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
    try {
const {id} = req.params;
 const _id = new Types.ObjectId(id);
const verificationStatus = VerificationStatus.Pending
    const result = await this._vendorService.retryVerification({_id},verificationStatus);
    if(!result){
   res
        .status(HttpStatusCode.NOT_FOUND)
        .json(
          responseHandler(
            ResponseMessage.NO_USER_TO_RETRY_WITH_THIS,
            HttpStatusCode.NOT_FOUND
          )
        );
        return
    }
    res.status(200).json(responseHandler(ResponseMessage.RETRY_VERIFICATION_SENT,HttpStatusCode.OK))
  } catch (error) {
              logger.error("vendorController: retry verification error", error );
        next(error);
    }
};

 loadVendorById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;

  if (!id || !validateObjectId(id)) {
      res.status(HttpStatusCode.BAD_REQUEST).json(
        responseHandler(ResponseMessage.INVALID_VENDOR_ID
          , HttpStatusCode.BAD_REQUEST)
      );
      return;
    }

        const _id = new Types.ObjectId(id);
        const vendor = await this._vendorService.loadVendorById({ _id });
        logger.info("loadVendorById from controller", vendor);

        res.status(200).json(responseHandler(ResponseMessage.UPDATE_STATUS_SUCCESS, HttpStatusCode.OK, vendor));
    } catch (error) {
        logger.error("VendorController: loadProfile error", error);
        next(error);
    }
};
    }