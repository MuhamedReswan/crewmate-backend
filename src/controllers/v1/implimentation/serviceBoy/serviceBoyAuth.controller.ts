import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";
import { IServiceBoyAuthService } from "../../../../services/v1/interfaces/serviceBoy/IServiceBoyAuth.service";
import { IServiceBoyAuthController } from "../../interfaces/serviceBoy/IServiceBoyAuth.controller";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { decodeRefreshToken } from "../../../../utils/jwt.util";
import { Role } from "../../../../constants/Role";
import logger from "../../../../utils/logger.util";
import { getRedisData, setRedisData } from "../../../../utils/redis.util";
import { UnAuthorizedError } from "../../../../utils/errors/unAuthorized.error";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "../../../../config/env";

@injectable()
export default class ServiceBoyAuthController
  implements IServiceBoyAuthController
{

  constructor(
    @inject("IServiceBoyAuthService")
   private _serviceBoyAuthService: IServiceBoyAuthService
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, email, password, mobile } = req.body;
logger.debug("Register controller received: " + JSON.stringify(req.body));
      await this._serviceBoyAuthService.register(name, email, password, mobile);
      await this._serviceBoyAuthService.generateOTP(email);
           logger.info(`OTP generated and sent to email: ${email}`);
      res
        .status(HttpStatusCode.CREATED)
        .json(
          responseHandler(
            ResponseMessage.REGISTER_SUCCESS,
            HttpStatusCode.CREATED,
            { email }
          )
        );
    } catch (error) {
      logger.error("Service Boy Register error: " + error);
      next(error);
    }
  };

  verifyOTP = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, otp } = req.body;
            logger.info(`Verifying OTP for email: ${email}`);
      let serviceBoyData = await this._serviceBoyAuthService.verifyOTP(email, otp);
      logger.debug("verifyOTP result: " + JSON.stringify(serviceBoyData));
      if (serviceBoyData) {

         // set access token and refresh token in coockies
      res.cookie("refreshToken", serviceBoyData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: REFRESH_TOKEN_MAX_AGE,
        sameSite: "lax",
      });
      res.cookie("accessToken", serviceBoyData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: ACCESS_TOKEN_MAX_AGE,
        sameSite: "lax",
      });
       
         logger.info(`OTP verified. Access and Refresh tokens generated for: ${email}`);
        res
          .status(HttpStatusCode.OK)
          .json(
            responseHandler(
              ResponseMessage.OTP_VERIFICATION_SUCCESS,
              HttpStatusCode.OK,
               serviceBoyData.serviceBoy 
            )
          );
      } else {
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(
            responseHandler(
              ResponseMessage.USER_NOT_FOUND,
              HttpStatusCode.BAD_REQUEST
            )
          );
      }
    } catch (error) {
      logger.error(" Service Boy OTP Verification error", error);
      next(error);
    }
  };

  resendOtp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;
      logger.info(`Resending OTP to email: ${email}`);
      await this._serviceBoyAuthService.resendOtp(email);
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(ResponseMessage.RESEND_OTP_SEND, HttpStatusCode.OK, {
            email,
            success: true,
          })
        );
    } catch (error) {
      logger.error("Service Boy Resend OTP error", error);
      next(error);
    }
  };

  serviceBoyLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const serviceBoyData = await this._serviceBoyAuthService.serviceBoyLogin(
        email,
        password
      );

    if (!serviceBoyData) {
        throw new NotFoundError(ResponseMessage.LOGIN_VERIFICATION_FAILED);
        }

      // set access token and refresh token in coockies
      res.cookie("refreshToken", serviceBoyData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: REFRESH_TOKEN_MAX_AGE,
        sameSite: "lax",
      });
      res.cookie("accessToken", serviceBoyData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: ACCESS_TOKEN_MAX_AGE,
        sameSite: "lax",
      });
      logger.info(`Login success for email: ${email}`);
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(
            ResponseMessage.LOGIN_SUCCESS,
            HttpStatusCode.OK,
            serviceBoyData.serviceBoy
          )
        );
    } catch (error) {
      logger.error("Service Boy Login error", error);
      next(error);
    }
  };

  setNewAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const refreshToken = req.cookies?.refreshToken;
      if (!refreshToken) {
         logger.warn("No refresh token found in cookies");
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json(
            responseHandler(
              ResponseMessage.NO_REFRESH_TOKEN,
              HttpStatusCode.UNAUTHORIZED
            )
          );
      }


          const isBlacklisted = await getRedisData(refreshToken);
      if (isBlacklisted) {
        throw new UnAuthorizedError(ResponseMessage.BLACK_LISTED_TOKEN);
      }


      const result = await this._serviceBoyAuthService.setNewAccessToken(
        refreshToken
      );
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: ACCESS_TOKEN_MAX_AGE,
        sameSite: "strict",
      });
      logger.info("New access token set successfully");
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(ResponseMessage.ACCESS_TOKEN_SET, HttpStatusCode.OK)
        );
    } catch (error) {
       logger.error("Set New Access Token error", error);
      next(error);
    }
  };

  forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email } = req.body;
      logger.info(`Forgot password request for email: ${email}`);
      const forgotToken = await this._serviceBoyAuthService.forgotPassword(
        email
      );
      if (!forgotToken)
        throw new NotFoundError(ResponseMessage.FORGOT_PASSWORD_TOKEN_NOTFOUND);
      await this._serviceBoyAuthService.resetPasswordLink(email, forgotToken,Role.SERVICE_BOY);
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(
            ResponseMessage.FORGOT_PASSWORD_LINK_SEND,
            HttpStatusCode.OK
          )
        );
    } catch (error) {
      logger.error("Forgot password error", error);
      next(error);
    }
  };

  resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password, token } = req.body;
        logger.info(`Resetting password for email: ${email}`);
      if (token) {
        await this._serviceBoyAuthService.resetPasswordTokenVerify(
          email,
          token
        );
        await this._serviceBoyAuthService.resetPassword(email, password);
      } else {
        await this._serviceBoyAuthService.resetPassword(email, password);
      }
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(
            ResponseMessage.RESET_PASSWORD_SUCCESS,
            HttpStatusCode.OK
          )
        );
    } catch (error) {
            logger.error("Reset password error", error);
      next(error);
    }
  };


  googleAuth = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { googleToken } = req.body;
      logger.info("Google login token received");
        const serviceBoyData = await this._serviceBoyAuthService.googleAuth({googleToken});
      console.log("Google auth result: " + JSON.stringify(serviceBoyData));
if(!serviceBoyData) throw new NotFoundError(ResponseMessage.GOOGLE_AUTH_FAILED);

console.log("google auth controller serviceBoyData",serviceBoyData);

console.log("google auth controller serviceBoyData.serviceBoy",serviceBoyData.serviceBoy);

logger.info("Google login token received",{})
      // set access token and refresh token in coockies
      res.cookie("refreshToken", serviceBoyData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: REFRESH_TOKEN_MAX_AGE,
        sameSite: "lax",
      });
      res.cookie("accessToken", serviceBoyData.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: ACCESS_TOKEN_MAX_AGE,
        sameSite: "lax",
      });
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(
            ResponseMessage.LOGIN_SUCCESS,
            HttpStatusCode.OK,
            serviceBoyData.serviceBoy
          )
        );
    } catch (error) {
      logger.error("Google login error", error);
      next(error);
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {

const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
  //  res.status(HttpStatusCode.BAD_REQUEST)
  //  .json(
  //   responseHandler
  //   (ResponseMessage.INVALID_REFRESH_TOKEN,
  //     HttpStatusCode.BAD_REQUEST));

     res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(
            ResponseMessage.LOGOUT_SUCCESS,
            HttpStatusCode.OK,
            true
          )
        );
  }

  const decoded =decodeRefreshToken(refreshToken);
  logger.info("decoded token in sevicebOy logout controller",{decoded});

    if (decoded?.exp) {
      const now = Math.floor(Date.now() / 1000);
      const ttl = decoded.exp - now;

      await setRedisData(refreshToken, "blacklisted", ttl);
    }
      
      res.clearCookie("accessToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });
      
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(
            ResponseMessage.LOGOUT_SUCCESS,
            HttpStatusCode.OK,
            true
          )
        );
    } catch (error) {
        logger.error("Logout error", error);
      next(error);
    }
  };



   tokenTest = (req:Request, res:Response, next:NextFunction): void => {
    try {
      res
      .status(HttpStatusCode.OK)
      .json(
        responseHandler(
          "Test token success",
          HttpStatusCode.OK,
          true
        ));
    } catch (error) {
       logger.error("Token test error", error);
      next(error);
    }
  };
}
