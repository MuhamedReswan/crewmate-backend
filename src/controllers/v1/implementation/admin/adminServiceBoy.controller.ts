import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import logger from "../../../../utils/logger.util";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { VerificationStatus, VerificationStatusType } from "../../../../constants/status";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { IAdminServiceBoyController } from "../../interfaces/admin/IAdminServiceBoy.controller";
import { IAdminServiceBoyService } from "../../../../services/v1/interfaces/admin/IAdminServiceBoy.service";



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
    const reason = req.query.reason as string;

logger.debug("verification rejection reason ",{reason});

       if (!status) {
      throw new NotFoundError(ResponseMessage.NO_VERIFICATION_STATUS)
    }

    const result = await this._adminServiceBoyService.verifyServiceBoy(id, status, reason);

   if(!result) return;
    const responseMessage =
      status === VerificationStatus.Rejected 
        ? ResponseMessage.VERIFICATION_STATUS_REJECTED_SUCCESS
        : ResponseMessage.VERIFICATION_STATUS_UPDATED_SUCCESS;

        res.status(200).json(responseHandler(responseMessage,HttpStatusCode.OK, result))
    } catch (error) {
        next(error)
    }
      }



      getAllServiceBoys = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || ""
    const isBlockedRaw = req.query.isBlocked as string;
    if(isBlockedRaw){
    }
    const isBlocked = isBlockedRaw === 'true' ? true : isBlockedRaw === 'false' ? false : undefined;
    const result = await this._adminServiceBoyService.getPaginatedServiceBoys(page, limit, search,isBlocked);
    res.status(200).json(responseHandler(ResponseMessage.LOAD_SERVICE_BOY_SUCCESS,HttpStatusCode.OK, result))
  
} catch (error) {
  next(error)
}
      } 

      getServiceBoysById = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
try {
const {id} = req.params;
    const result = await this._adminServiceBoyService.getServiceBoyById(id);
    res.status(200).json(responseHandler(ResponseMessage.LOAD_SERVICE_BOY_SUCCESS,HttpStatusCode.OK, result))
  
} catch (error) {
  next(error)
}
      } 

      getSinglePendingVerification = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
try {
const {id} = req.params;
const {isVerified} =req.query
    const verificationStatus = isVerified as VerificationStatusType;
    const result = await this._adminServiceBoyService.getServiceBoyById(id,verificationStatus);
    if(!result){
   res
        .status(HttpStatusCode.NOT_FOUND)
        .json(
          responseHandler(
            ResponseMessage.NO_USER_TO_VERIFY_WITH_THIS,
            HttpStatusCode.NOT_FOUND
          )
        );
        return
    }
    res.status(200).json(responseHandler(ResponseMessage.LOAD_SERVICE_BOY_SUCCESS,HttpStatusCode.OK, result))
  
} catch (error) {
  next(error)
}
      } 


      updateServiceBoyStatus = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
        try {
const { id, status } = req.params;
const updateServiceBoy = await this._adminServiceBoyService.updateServiceBoyStatus(id, status); 
logger.info("updateServiceBoy",{updateServiceBoy});
  res.status(200).json(responseHandler(ResponseMessage.UPDATE_STATUS_SUCCESS,HttpStatusCode.OK));

        } catch (error) {
         next(error);
        }
      }
}


