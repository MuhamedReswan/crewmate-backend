import { inject, injectable } from "tsyringe";
import { IAdminUserManagementController } from "../../interfaces/admin/IAdminUserManagement.controller";
import { IAdminUserManagementService } from "../../../../services/v1/interfaces/admin/IAdminUserManagement.service";
import { UserType } from "../../../../constants/userType";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import logger from "../../../../utils/logger.util";
import { VerificationStatus, VerificationStatusType } from "../../../../constants/status";
import { NotFoundError } from "../../../../utils/errors/notFound.error";

@injectable()
export default class AdminUserManagementController
  implements IAdminUserManagementController
{
  constructor(
    @inject("IAdminUserManagementService")
    private _adminUserManagementService: IAdminUserManagementService
  ) {}

  getAllPendingVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userType } = req.params;

      console.log("params", req.params);
console.log("url", req.originalUrl);

      const pendingVerifications =
        await this._adminUserManagementService.loadAllPendingVerification(
          userType as UserType
        );
      logger.info("pendingVerifications", { pendingVerifications });
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(
            ResponseMessage.LOAD_VERIFICATION_SUCCESS,
            HttpStatusCode.OK,
            pendingVerifications
          )
        );
    } catch (error) {
      logger.error("getAllPendingVerification error", {error});
      next(error);
    }
  };


  getSinglePendingVerification = async (
        req: Request,
        res: Response,
        next: NextFunction
      ): Promise<void> => {
try {
const {id,userType} = req.params;
const {isVerified} =req.query
logger.log("usertype form single verifivation controller", {userType});
    const verificationStatus = isVerified as VerificationStatusType;
    const result = await this._adminUserManagementService.getUserById(id,verificationStatus,userType as UserType);
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
    res.status(HttpStatusCode.OK).json(responseHandler(ResponseMessage.LOAD_SERVICE_BOY_SUCCESS,HttpStatusCode.OK, result))
  
} catch (error) {
  next(error)
}
      } 

      verifyUserByAdmin =  async (
                req: Request,
                res: Response,
                next: NextFunction
              ): Promise<void> => {
            try {
        
          const { id,  userType } = req.params; 
          const status = req.query.status as VerificationStatusType;
          const reason = req.query.reason as string;
      
               if (!status) {
              throw new NotFoundError(ResponseMessage.NO_VERIFICATION_STATUS)
            }
        
                const result = await this._adminUserManagementService.verifyUser(id,status,reason,userType as UserType);
           if(!result) return;
      
               const responseMessage =
                 status === VerificationStatus.Rejected 
                   ? ResponseMessage.VERIFICATION_STATUS_REJECTED_SUCCESS
                   : ResponseMessage.VERIFICATION_STATUS_UPDATED_SUCCESS;
                res.status(HttpStatusCode.OK).json(responseHandler(responseMessage,HttpStatusCode.OK, result))
            } catch (error) {
                next(error)
            }
              }
}

