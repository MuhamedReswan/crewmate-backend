import { RequestHandler } from "../../../../utils/type"
export interface ITokenResult {
    accessToken: string;
  }


export interface IServiceBoyAuthController {
register:RequestHandler
verifyOTP: RequestHandler
serviceBoyLogin:RequestHandler
resendOtp:RequestHandler,
setNewAccessToken:RequestHandler
forgotPassword:RequestHandler
googleAuth:RequestHandler
resetPassword:RequestHandler,
logout:RequestHandler

}