import { inject, injectable } from "tsyringe";
import { IAdminVendorService } from "../../../../services/v1/implimentation/admin/adminVendor.service";
import { NextFunction, Request, Response } from "express";
import { RequestHandler } from "../../../../types/type";
import logger from "../../../../utils/logger.util";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { HttpStatusCode } from "axios";
import { VerificationStatusType } from "../../../../constants/verificationStatus";
import { NotFoundError } from "../../../../utils/errors/notFound.error";

export interface IAdminVendorController{
getAllVendorPendingVerification:RequestHandler
verifyVendorByAdmin:RequestHandler
}

@injectable()
export default class AdminVendorController implements IAdminVendorController{
constructor(@inject("IAdminVendorService") private _adminVendorService:IAdminVendorService){}

 getAllVendorPendingVerification= async( req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
try {
    const vendorsForVerification = await this._adminVendorService.loadAllPendingVerification();
      logger.info("seviceBoysForVerification",{vendorsForVerification});
            res.status(200).json(responseHandler(ResponseMessage.LOAD_VERIFICATION_SUCCESS, HttpStatusCode.Ok, vendorsForVerification ));
} catch (error) {
    next(error)
}
  }



   verifyVendorByAdmin =  async (
          req: Request,
          res: Response,
          next: NextFunction
        ): Promise<void> => {
      try {
  
    const { id } = req.params; 
    const status = req.query.status as VerificationStatusType;
         if (!status) {
        throw new NotFoundError(ResponseMessage.NO_VERIFICATION_STATUS)
      }
  
          const result = await this._adminVendorService.verifyVendor(id,status);
     if(!result) return;
          res.status(200).json(responseHandler(ResponseMessage.VERIFICATION_STATUS_UPDATE_SUCCESS,HttpStatusCode.Ok, result))
      } catch (error) {
          next(error)
      }
        }



}