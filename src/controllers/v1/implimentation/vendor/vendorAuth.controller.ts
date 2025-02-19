import { NextFunction, Request, response, Response } from "express";
import { IVendorAuthController } from "../../interfaces/vendor/IVendorAuth.controller";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { IVendorAuthService } from "../../../../services/v1/interfaces/vendor/IVendorAuthService";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { sendForgotPasswordLink } from "../../../../utils/otp.util";

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
            .json(responseHandler(ResponseMessage.REGISTER_SUCCESS,HttpStatusCode.OK,{email}));
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



    forgotPassword =  async (req:Request, res:Response, next:NextFunction): Promise<void> => {
            try {
                const {email} = req.body;
              const forgotToken = await this.vendorAuthService.forgotPassword(email);
              if (!forgotToken) throw new NotFoundError(ResponseMessage.FORGOT_PASSWORD_TOKEN_NOTFOUND)
                 await this.vendorAuthService.resetPasswordLink(email,forgotToken);
                res.status(HttpStatusCode.OK)
    .json(responseHandler(ResponseMessage.FORGOT_PASSWORD_LINK_SEND, HttpStatusCode.OK));
          
            } catch (error) {
                next(error);
            }
        };


        resetPassword = async (req:Request, res:Response, next: NextFunction): Promise<void> => {
            try {
               const {email, password,forgotToken} = req.body;
               if(forgotToken){
                await this.vendorAuthService.resetPasswordTokenVerify(email,forgotToken);
                await this.vendorAuthService.resetPassword(email, password);
               }else{
                await this.vendorAuthService.resetPassword(email, password);
               }
               res.status(HttpStatusCode.OK)
               .json(responseHandler(ResponseMessage.RESET_PASSWORD_SUCCESS,HttpStatusCode.OK));
            } catch (error) {
                next(error);
            }
        };
    
    
resetPasswordLink = async (token:string,email:string): Promise<void>=>{
    try {
        await sendForgotPasswordLink(email,token);
    } catch (error) {
        throw error;
    }
};



setNewAccessToken = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if(!refreshToken){
         res.status(HttpStatusCode.UNAUTHORIZED)
        .json(responseHandler(ResponseMessage.NO_REFRESH_TOKEN,HttpStatusCode.UNAUTHORIZED))
        }
        const result = await this.vendorAuthService.setNewAccessToken(refreshToken);
        console.log("result of new access token form controller",result);
        res.cookie('accessToken',result.accessToken,
             { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 3600000, sameSite: 'strict' });
              res.status(HttpStatusCode.OK)
             .json(responseHandler(ResponseMessage.ACCESS_TOKEN_SET,HttpStatusCode.OK));
            } catch (error) {
                next(error)
    }
};


googleRegister = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    try {
        console.log('recieved body : ',req.body)
        const { vendorCredential } = req.body
        const name = vendorCredential.name
        const email = vendorCredential.email 
        const password = vendorCredential.sub
        const profileImage = vendorCredential.picture
        const vendor = await this.vendorAuthService.googleRegister({name,email,password,profileImage});
        console.log("vendor in controllr google aut: ",vendor)
        res.status(HttpStatusCode.OK).json(responseHandler(ResponseMessage.GOOGLE_REGISTER_SUCCESS, HttpStatusCode.OK));
    } catch (error) {
        next(error)   
    }
};


googleLogin = async (req:Request, res:Response, next:NextFunction): Promise<void> => {
    try {
        const { vendorCredential } = req.body
        const name = vendorCredential.name
        const email = vendorCredential.email 
        await this.vendorAuthService.googleLogin({email});
    } catch (error) {
        next(error);
    }
};
}