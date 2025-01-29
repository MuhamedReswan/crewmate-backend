import { NextFunction, Request, response, Response } from "express";
import { IVendorAuthController } from "../../interfaces/vendor/IVendorAuthController";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../../enums/httpStatusCode";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../enums/resposnseMessage";
import { IVendorAuthService } from "../../../../services/v1/interfaces/vendor/IVendorAuthService";

@injectable()
export default class VendorAuthController implements IVendorAuthController{

    constructor(@inject('IVendorAuthService') private vendorAuthService: IVendorAuthService) {}



    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, email, password, mobile } = req.body;
            console.log("req.body register controller",req.body);
             await this.vendorAuthService.register( name, email, password, mobile );
             await this.vendorAuthService.generateOTP(email);
            res
            .status(HttpStatusCode.OK)
            .json(responseHandler(ResponseMessage.REGISTER_SUCCESS,HttpStatusCode.OK));
        } catch (error) {
            res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({message: 'Internal Server Error'});
        }
    };


    verifyOTP = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { email, otp } = req.body;
            console.log("req.body on controller",req.body);
           let verify =  await this.vendorAuthService.verifyOTP(email, otp); 
           console.log("verifyotp",verify)
            res.status(HttpStatusCode.CREATED)
            .json(responseHandler(ResponseMessage.OTP_VERIFICATION_SUCCESS,HttpStatusCode.CREATED))
        } catch (error) {
            next(error);
        }
    };


    resendOtp = async (req: Request, res:Response, next: NextFunction):Promise<void> => {
        try {
            const {email} = req.body;
await this.vendorAuthService.resendOtp(email);
res.status(HttpStatusCode.OK)
.json(responseHandler(ResponseMessage.RESEND_OTP_SEND,HttpStatusCode.OK));
        } catch (error) {
            next(error)
        }
    };


    vendorLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const {email, password} = req.body;
           const vendor =  await this.vendorAuthService.vendorLogin(email, password);
           // set access token and refresh token in coockies
           res.cookie('refreshToken', vendor.accessToken,{
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
            sameSite: 'lax'
           } );
           res.cookie('accessToken', vendor.accessToken, {
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
    };

}