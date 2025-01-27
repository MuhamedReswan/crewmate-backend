import { RequestHandler } from "../../../utils/type"
export interface ITokenResult {
    accessToken: string;
  }
export interface IServiceBoyController {
register:RequestHandler
verifyOTP: RequestHandler
serviceBoyLogin:RequestHandler
resendOtp:RequestHandler,
setNewAccessToken:RequestHandler
forgotPassword:RequestHandler
forgotResetPassword:RequestHandler
googleRegister:RequestHandler
googleLogin:RequestHandler
resetPassword:RequestHandler

}