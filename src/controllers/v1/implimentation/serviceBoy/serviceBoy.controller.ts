import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { IServiceBoyService } from "../../../../services/v1/implimentation/serviceBoy/serviceBoy.service";
import { RequestHandler } from "../../../../types/type";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import logger from "../../../../utils/logger.util";
import { formatFilesForLog } from "../../../../utils/formatFilesForLog.util";
import { VerificationStatus, VerificationStatusType } from "../../../../constants/verificationStatus";

export interface IServiceBoyController{
    loadProfile:RequestHandler
    updateProfile:RequestHandler
    retryServiceBoyVerfication:RequestHandler
    loadServiceBoyById:RequestHandler
}

@injectable()
export default class ServiceBoyController implements IServiceBoyController{
    constructor(@inject("IServiceBoyService")private _serviceBoyService:IServiceBoyService){}


 loadProfile = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {
            logger.info("req.body of service boy",req.params);
            let { id} = req.params;
            logger.info("req.params of service boy load profile",{id});
            
             const _id = new Types.ObjectId(id);
            const serviceBoyProfile =   await this._serviceBoyService.LoadProfile({_id});
            logger.info("serviceBoyProfile from controleer",serviceBoyProfile);

                res.status(200).json(responseHandler(ResponseMessage.LOAD_PROFILE_SUCCESS, HttpStatusCode.OK, serviceBoyProfile ));

        } catch (error) {
logger.error("ServiceBoyController: loadProfile error", error );
            next(error);
        }
    };




updateProfile  = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
    try {
         logger.info("ServiceBoyController: updateProfile called", {
        body: req.body,
        files: formatFilesForLog(req.files),
      });        
        const updatedProfile = await this._serviceBoyService.updateProfile(req.body,req.files);
        if(updatedProfile){
            res.status(200).json(responseHandler( ResponseMessage.PROFILE_UPDATED,HttpStatusCode.OK, updatedProfile));
        }else{
            res.status(400).json(responseHandler( ResponseMessage.PROFILE_UPDATION_FAILED,HttpStatusCode.BAD_REQUEST));
        }
    } catch (error) {
              logger.error("ServiceBoyController: updateProfile error", error );
        next(error);
    }
};


retryServiceBoyVerfication = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
    try {
const {id} = req.params;
 const _id = new Types.ObjectId(id);
const verificationStatus = VerificationStatus.Pending
    const result = await this._serviceBoyService.retryVerification({_id},verificationStatus);
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
              logger.error("serviceBoyController: retry verification error", error );
        next(error);
    }
};


 loadServiceBoyById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { id } = req.params;
        logger.debug("loadServiceBoyId-id from controller", {id});

          if (!req.params.id) {
      res.status(400).json({ message: "serviceBoy ID is required" });
      return;
    }

        const _id = new Types.ObjectId(id);
        const serviceBoy = await this._serviceBoyService.loadServiceBoyById({ _id });
        logger.info("loadServiceBoyId from controller", serviceBoy);

        res.status(200).json(responseHandler(ResponseMessage.UPDATE_STATUS_SUCCESS, HttpStatusCode.OK, serviceBoy));
    } catch (error) {
        logger.error("serviceBoy controller: loadServiceBoyById error", error);
        next(error);
    }
};

}
