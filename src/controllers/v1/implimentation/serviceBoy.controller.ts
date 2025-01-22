import { NextFunction, Request, Response } from "express";
import { IServiceBoyService } from "../../../services/v1/interfaces/IServiceBoyService";
import { IServiceBoyController } from "../interfaces/IServiceBoyController";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../enums/httpStatusCode";
import { handleSuccess } from "../../../utils/successHandler.util";
import { ResponseMessage } from "../../../enums/resposnseMessage";
import redisClient from "../../../utils/redis.util";



@injectable()
export default class ServiceBoyController implements IServiceBoyController {
    private serviceBoyService: IServiceBoyService;

    constructor(@inject('IServiceBoyService') serviceBoyService: IServiceBoyService){
        this.serviceBoyService = serviceBoyService;
    }


     register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, email, password, mobile } = req.body;
            console.log("req.body register controller",req.body);
             await this.serviceBoyService.register( name, email, password, mobile );
             await this.serviceBoyService.generateOTP(email);
            res
            .status(HttpStatusCode.OK)
            .json(handleSuccess(ResponseMessage.SERVICE_BOY_REGISTER_SUCCESS));
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message: 'Internal Server Error'});
        }
    }


     verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, otp } = req.body;
            console.log("req.body on controller",req.body);
            const allKeysRedis = await redisClient.get("*");
            console.log("allKeysRedis",allKeysRedis);
           let verify =  await this.serviceBoyService.verifyOTP(email, otp); 
           console.log("verifyotp",verify)
            res.status(HttpStatusCode.CREATED).json(handleSuccess(ResponseMessage.SERVICE_BOY_VERIFICATION_SUCCESS))
        } catch (error) {
            next(error);
        }

    }
}