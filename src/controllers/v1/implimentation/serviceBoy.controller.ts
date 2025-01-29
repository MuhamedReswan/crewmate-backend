import { NextFunction, Request, response, Response } from "express";
import { IServiceBoyService } from "../../../services/v1/interfaces/IServiceBoyService";
import { IServiceBoyController } from "../interfaces/IServiceBoyController";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../enums/httpStatusCode";
import { responseHandler } from "../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../enums/resposnseMessage";
import { BadrequestError } from "../../../utils/errors/badRequest.error";



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
            .json(responseHandler(ResponseMessage.REGISTER_SUCCESS,HttpStatusCode.OK));
        } catch (error) {
            next(error)
        }
    }


     verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, otp } = req.body;
            console.log("req.body on controller",req.body);
           let verify =  await this.serviceBoyService.verifyOTP(email, otp); 
           console.log("verifyotp",verify)
            res.status(HttpStatusCode.CREATED)
            .json(responseHandler(ResponseMessage.OTP_VERIFICATION_SUCCESS,HttpStatusCode.CREATED))
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
           console.log("serviceBoy from login controller",serviceBoy)
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


    forgotPassword =  async (req:Request, res:Response, next:NextFunction): Promise<void> => {
        try {
            const {email} = req.body;
          const isSendeMail = await this.serviceBoyService.forgotPassword(email);
          if (isSendeMail){ 
            res.status(HttpStatusCode.OK)
.json(responseHandler(ResponseMessage.FORGOT_PASSWORD_LINK_SEND, HttpStatusCode.OK));
          }
        } catch (error) {
            next(error);
        }
    }


    forgotResetPassword = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
        try {
            const {email, password,token} = req.body;
            await this.serviceBoyService.resetPasswordTokenVerify(email,token);
         await this.serviceBoyService.forgotResetPassword(email,password);
         res.status(HttpStatusCode.OK)
         .json(responseHandler(ResponseMessage.PASSWORD_RESET_SUCCESS,HttpStatusCode.OK));
        } catch (error) {
            next(error)
        }
    };


    googleRegister = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
        try {
            console.log('recieved body : ',req.body)
            const { serviceBoyCredential } = req.body
            const name = serviceBoyCredential.name
            const email = serviceBoyCredential.email 
            const password = serviceBoyCredential.sub
            const profileImage = serviceBoyCredential.picture
            const serviceBoy = await this.serviceBoyService.googleRegister({name,email,password,profileImage});
            console.log("serviceBoy in controllr google aut: ",serviceBoy)
            res.status(HttpStatusCode.OK).json(responseHandler(ResponseMessage.GOOGLE_REGISTER_SUCCESS, HttpStatusCode.OK));
        } catch (error) {
            next(error)   
        }
    };


    googleLogin = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
        try {
            const { serviceBoyCredential } = req.body
            const name = serviceBoyCredential.name
            const email = serviceBoyCredential.email 
            await this.serviceBoyService.googleLogin({email});
        } catch (error) {
            next(error);
        }
    };


    resetPassword = async (req:Request, res:Response, next: NextFunction): Promise<void> => {
        try {
           const {email, password} = req.body;
           await this.serviceBoyService.resetPassword(email, password);
           res.status(HttpStatusCode.OK)
           .json(responseHandler(ResponseMessage.RESET_PASSWORD_SUCCESS,HttpStatusCode.OK));
        } catch (error) {
            next(error);
        }
    };
}