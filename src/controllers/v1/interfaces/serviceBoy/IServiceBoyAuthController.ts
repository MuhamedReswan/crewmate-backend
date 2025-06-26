import { NextFunction, Request, Response } from "express";
import { RequestHandler } from "../../../../types/type"
export interface ITokenResult {
    accessToken: string;
  }

  interface MiddlewareFunction {
    (req: Request<any, any, any, any>, res: Response, next: NextFunction): void;  }

export interface IServiceBoyAuthController {
register:RequestHandler
verifyOTP: RequestHandler
serviceBoyLogin:RequestHandler
resendOtp:RequestHandler,
setNewAccessToken:RequestHandler
forgotPassword:RequestHandler
googleAuth:RequestHandler
resetPassword:RequestHandler,
logout:RequestHandler,

tokenTest:MiddlewareFunction

}