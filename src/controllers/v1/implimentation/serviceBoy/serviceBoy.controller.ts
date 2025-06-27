import { inject, injectable } from "tsyringe";
import { IServiceBoyService } from "../../../../services/v1/implimentation/serviceBoy/serviceBoy.service";
import { RequestHandler } from "../../../../types/type";
import { NextFunction, Request, Response } from "express";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import logger from "../../../../utils/logger.util";

export interface IServiceBoyController{
    loadProfile:RequestHandler
    updateProfile:RequestHandler
}

@injectable()
export default class ServiceBoyController implements IServiceBoyController{
    constructor(@inject("IServiceBoyService")private serviceBoyService:IServiceBoyService){}


 loadProfile = async(req:Request, res:Response, next:NextFunction):Promise<void> => {
        try {
logger.info("req.body of service boy",req)
        } catch (error) {
logger.error("ServiceBoyController: loadProfile error", { error });
            next(error)
        }
    }




updateProfile  = async(req:any, res:Response, next:NextFunction):Promise<void> => {
    try {
         logger.info("ServiceBoyController: updateProfile called", {
        body: req.body,
        files: req.files,
        user: req.user,
      });        
        const updatedProfile = await this.serviceBoyService.updateProfile(req.body,req.files);
        if(updatedProfile){
            res.status(200).json(responseHandler( ResponseMessage.PROFILE_UPDATED,HttpStatusCode.OK, updatedProfile));
        }else{
            res.status(400).json(responseHandler( ResponseMessage.PROFILE_UPDATION_FAILED,HttpStatusCode.BAD_REQUEST));
        }
    } catch (error) {
              logger.error("ServiceBoyController: updateProfile error", { error });
        next(error)
    }
}

}
