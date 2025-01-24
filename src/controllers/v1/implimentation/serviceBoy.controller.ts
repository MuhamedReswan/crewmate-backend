import { NextFunction, Request, response, Response } from "express";
import { IServiceBoyService } from "../../../services/v1/interfaces/IServiceBoyService";
import { IServiceBoyController } from "../interfaces/IServiceBoyController";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../enums/httpStatusCode";
import { responseHandler } from "../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../enums/resposnseMessage";



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
            .json(responseHandler(ResponseMessage.SERVICE_BOY_REGISTER_SUCCESS,HttpStatusCode.OK));
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message: 'Internal Server Error'});
        }
    }


     verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, otp } = req.body;
            console.log("req.body on controller",req.body);
           let verify =  await this.serviceBoyService.verifyOTP(email, otp); 
           console.log("verifyotp",verify)
            res.status(HttpStatusCode.CREATED)
            .json(responseHandler(ResponseMessage.SERVICE_BOY_VERIFICATION_SUCCESS,HttpStatusCode.CREATED))
        } catch (error) {
            next(error);
        }

    }


    resendOtp = async (req: Request, res:Response, next: NextFunction):Promise<void> => {
        try {
            const {email} = req.body;
await this.serviceBoyService.resendOtp(email);
res.status(HttpStatusCode.OK)
.json(responseHandler(ResponseMessage.RESEND_OTP_SEND,HttpStatusCode.OK));
        } catch (error) {
            next(error)
        }


    }


    serviceBoyLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {email, password} = req.body;
           const serviceBoy =  await this.serviceBoyService.serviceBoyLogin(email, password);
           // set access token and refresh token in coockies
           res.cookie('refreshToken', serviceBoy.accessToken,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
           } );
           res.cookie('accessToken', serviceBoy.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 15 * 60 * 1000,
            sameSite: 'lax'
           })

           res.status(HttpStatusCode.OK)
           .json(responseHandler(ResponseMessage.LOGIN_SUCCESS,HttpStatusCode.OK))

        } catch (error) {
            next(error);
        }
    }


    setNewAccessToken = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
        try {
            const refreshToken = req.cookies?.refreshToken;
            if(!refreshToken){
             res.status(HttpStatusCode.UNAUTHORIZED)
            .json(responseHandler(ResponseMessage.NO_REFRESH_TOKEN,HttpStatusCode.UNAUTHORIZED))
            }
            const result = await this.serviceBoyService.setNewAccessToken(refreshToken);
            console.log("result of new access token form controller",result);
            res.cookie('accessToken',result.accessToken,
                 { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000, sameSite: 'strict' });
                  res.status(HttpStatusCode.OK)
                 .json(responseHandler(ResponseMessage.ACCESS_TOKEN_SET,HttpStatusCode.OK));
        } catch (error) {
            next(error)
        }
    }
}