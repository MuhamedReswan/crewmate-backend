import { RequestHandler } from "../../../utils/type"
export interface ITokenResult {
    accessToken: string;
  }
export interface IServiceBoyController {
register:RequestHandler
verifyOTP: RequestHandler
serviceBoyLogin:RequestHandler
resendOtp:RequestHandler,
setNewAccessToken:RequestHandler<void>
forgotPassword:RequestHandler
forgotResetPassword:RequestHandler

}