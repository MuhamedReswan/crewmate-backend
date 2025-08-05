import { inject, injectable } from "tsyringe";
import { IAdminServiceBoyService } from "../../../../services/v1/implimentation/admin/adminServiceBoy.service";
import { NextFunction, Request, Response } from "express";
import { RequestHandler } from "../../../../types/type";
import logger from "../../../../utils/logger.util";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { VerificationStatusType } from "../../../../constants/verificationStatus";
import { NotFoundError } from "../../../../utils/errors/notFound.error";

export interface IAdminServiceBoyController{
getAllServiceBoysPendingVerification:RequestHandler
verifyServiceBoyByAdmin:RequestHandler

}

@injectable()
export default class AdminServiceBoyController implements IAdminServiceBoyController {
    constructor(@inject("IAdminServiceBoyService") private _adminServiceBoyService: IAdminServiceBoyService){}


    getAllServiceBoysPendingVerification =  async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
        try {
            const seviceBoysForVerification  = await this._adminServiceBoyService.loadAllPendingVerification()
            logger.info("seviceBoysForVerification",{seviceBoysForVerification});
            res.status(200).json(responseHandler(ResponseMessage.LOAD_VERIFICATION_SUCCESS, HttpStatusCode.OK, seviceBoysForVerification ));
        } catch (error) {
            logger.error("getAllServiceBoysPendingVerification error", error );
            next(error)
        }
    }



    verifyServiceBoyByAdmin =  async (
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

        const result = await this._adminServiceBoyService.verifyServiceBoy(id,status);
   if(!result) return;
        res.status(200).json(responseHandler(ResponseMessage.VERIFICATION_STATUS_UPDATE_SUCCESS,HttpStatusCode.OK, result))
    } catch (error) {
        next(error)
    }
      }



}


