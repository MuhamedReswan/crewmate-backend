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
getVendorById:RequestHandler
getVendorSinglePendingVerification:RequestHandler
getAllVendors:RequestHandler
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


      getVendorSinglePendingVerification = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
try {
const {id} = req.params;
const {isVerified} =req.query
    const verificationStatus = isVerified as VerificationStatusType;
    const result = await this._adminVendorService.getVendorById(id,verificationStatus);
    if(!result){
   res
        .status(HttpStatusCode.NotFound)
        .json(
          responseHandler(
            ResponseMessage.NO_USER_TO_VERIFY_WITH_THIS,
            HttpStatusCode.NotFound
          )
        );
        return
    }
    res.status(200).json(responseHandler(ResponseMessage.LOAD_SERVICE_BOY_SUCCESS,HttpStatusCode.Ok, result))
  
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

              getVendorById = async (
                req: Request,
                res: Response,
                next: NextFunction
              ): Promise<void> => {
        try {
        const {id} = req.params;
            const result = await this._adminVendorService.getVendorById(id);
            res.status(200).json(responseHandler(ResponseMessage.LOAD_VENDOR_SUCCESS,HttpStatusCode.Ok, result))
          
        } catch (error) {
          next(error)
        }
              }


                    getAllVendors = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || ""
    logger.info("req.query.isBlocked",req.query)
    const isBlockedRaw = req.query.isBlocked as string;
    if(isBlockedRaw){
    }
    const isBlocked = isBlockedRaw === 'true' ? true : isBlockedRaw === 'false' ? false : undefined;
    const result = await this._adminVendorService.getPaginatedVendors(page, limit, search,isBlocked);
    res.status(200).json(responseHandler(ResponseMessage.LOAD_VENDOR_SUCCESS,HttpStatusCode.Ok, result))
  
} catch (error) {
  next(error)
}
      }
}