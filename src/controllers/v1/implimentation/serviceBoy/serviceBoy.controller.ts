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

export interface IServiceBoyController{
    loadProfile:RequestHandler
    updateProfile:RequestHandler
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

}
