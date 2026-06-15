import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import logger from "../../../../utils/logger.util";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { VerificationStatus, VerificationStatusType } from "../../../../constants/status";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { IAdminVendorController } from "../../interfaces/admin/IAdminVendor.controller";
import { IAdminVendorService } from "../../../../services/v1/interfaces/admin/IAdminVendor.service";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";


@injectable()
export default class AdminVendorController implements IAdminVendorController{
constructor(@inject("IAdminVendorService") private _adminVendorService:IAdminVendorService){}

//  getAllVendorPendingVerification= async( req: Request,
//     res: Response,
//     next: NextFunction
//   ): Promise<void> => {
// try {
//     const vendorsForVerification = await this._adminVendorService.loadAllPendingVerification();
//       logger.info("seviceBoysForVerification",{vendorsForVerification});
//             res.status(HttpStatusCode.OK).json(responseHandler(ResponseMessage.LOAD_VERIFICATION_SUCCESS, HttpStatusCode.OK, vendorsForVerification ));
// } catch (error) {
//     next(error)
// }
//   }


//       getVendorSinglePendingVerification = async (
//         req: Request,
//         res: Response,
//         next: NextFunction
//       ): Promise<void> => {
// try {
// const {id} = req.params;
// const {isVerified} =req.query
//     const verificationStatus = isVerified as VerificationStatusType;
//     const result = await this._adminVendorService.getVendorById(id,verificationStatus);
//     if(!result){
//    res
//         .status(HttpStatusCode.NOT_FOUND)
//         .json(
//           responseHandler(
//             ResponseMessage.NO_USER_TO_VERIFY_WITH_THIS,
//             HttpStatusCode.NOT_FOUND
//           )
//         );
//         return
//     }
//     res.status(HttpStatusCode.OK).json(responseHandler(ResponseMessage.LOAD_SERVICE_BOY_SUCCESS,HttpStatusCode.OK, result))
  
// } catch (error) {
//   next(error)
// }
//       } 



  //  verifyVendorByAdmin =  async (
  //         req: Request,
  //         res: Response,
  //         next: NextFunction
  //       ): Promise<void> => {
  //     try {
  
  //   const { id } = req.params; 
  //   const status = req.query.status as VerificationStatusType;
  //   const reason = req.query.reason as string;

  //        if (!status) {
  //       throw new NotFoundError(ResponseMessage.NO_VERIFICATION_STATUS)
  //     }
  
  //         const result = await this._adminVendorService.verifyVendor(id,status,reason);
  //    if(!result) return;

  //        const responseMessage =
  //          status === VerificationStatus.Rejected 
  //            ? ResponseMessage.VERIFICATION_STATUS_REJECTED_SUCCESS
  //            : ResponseMessage.VERIFICATION_STATUS_UPDATED_SUCCESS;
  //         res.status(HttpStatusCode.OK).json(responseHandler(responseMessage,HttpStatusCode.OK, result))
  //     } catch (error) {
  //         next(error)
  //     }
  //       }

              getVendorById = async (
                req: Request,
                res: Response,
                next: NextFunction
              ): Promise<void> => {
        try {
        const {id} = req.params;
            const result = await this._adminVendorService.getVendorById(id);
            res.status(HttpStatusCode.OK).json(responseHandler(ResponseMessage.LOAD_VENDOR_SUCCESS,HttpStatusCode.OK, result))
          
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
    const isBlockedRaw = req.query.isBlocked as string;
    if(isBlockedRaw){
    }
    const isBlocked = isBlockedRaw === 'true' ? true : isBlockedRaw === 'false' ? false : undefined;
    const result = await this._adminVendorService.getPaginatedVendors(page, limit, search,isBlocked);
    res.status(HttpStatusCode.OK).json(responseHandler(ResponseMessage.LOAD_VENDOR_SUCCESS,HttpStatusCode.OK, result))
  
} catch (error) {
  next(error)
}
      }
}