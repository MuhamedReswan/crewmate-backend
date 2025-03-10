import { NextFunction, Request, response, Response } from "express";
import { IServiceBoyAuthService } from "../../../../services/v1/interfaces/serviceBoy/IServiceBoyAuthService";
import { IServiceBoyAuthController } from "../../interfaces/serviceBoy/IServiceBoyAuthController";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../../utils/jwt.util";
import { Role } from "../../../../constants/Role";

@injectable()
export default class ServiceBoyAuthController
  implements IServiceBoyAuthController
{
  private serviceBoyAuthService: IServiceBoyAuthService;

  constructor(
    @inject("IServiceBoyAuthService")
    serviceBoyAuthService: IServiceBoyAuthService
  ) {
    this.serviceBoyAuthService = serviceBoyAuthService;
  }

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, email, password, mobile } = req.body;
      console.log("req.body register controller", req.body);
      await this.serviceBoyAuthService.register(name, email, password, mobile);
      await this.serviceBoyAuthService.generateOTP(email);
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
      console.log("req.body on controller", req.body);
      let serviceBoy = await this.serviceBoyAuthService.verifyOTP(email, otp);
      console.log("verifyotp", serviceBoy);
      if (serviceBoy) {
        const role = Role.SERVICE_BOY;
        const accessToken = generateAccessToken({
          data: serviceBoy,
          role: role,
        });
        const refreshToken = generateRefreshToken({
          data: serviceBoy,
          role: role,
        });
        console.log("refresh token", refreshToken);
        console.log("accessToken token", accessToken);
        res
          .status(HttpStatusCode.OK)
          .json(
            responseHandler(
              ResponseMessage.OTP_VERIFICATION_SUCCESS,
              HttpStatusCode.OK,
              { serviceBoy, role }
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
      console.log("email from resend otp controller", email);

      await this.serviceBoyAuthService.resendOtp(email);
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(ResponseMessage.RESEND_OTP_SEND, HttpStatusCode.OK, {
            email,
            success: true,
          })
        );
    } catch (error) {
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
      const serviceBoy = await this.serviceBoyAuthService.serviceBoyLogin(
        email,
        password
      );
      console.log("serviceBoy from login controller", serviceBoy);
      // set access token and refresh token in coockies
      res.cookie("refreshToken", serviceBoy.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });
      res.cookie("accessToken", serviceBoy.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "lax",
      });
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(
            ResponseMessage.LOGIN_SUCCESS,
            HttpStatusCode.OK,
            serviceBoy
          )
        );
    } catch (error) {
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
        res
          .status(HttpStatusCode.UNAUTHORIZED)
          .json(
            responseHandler(
              ResponseMessage.NO_REFRESH_TOKEN,
              HttpStatusCode.UNAUTHORIZED
            )
          );
      }
      const result = await this.serviceBoyAuthService.setNewAccessToken(
        refreshToken
      );
      console.log("result of new access token form controller", result);
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
        sameSite: "strict",
      });
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(ResponseMessage.ACCESS_TOKEN_SET, HttpStatusCode.OK)
        );
    } catch (error) {
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
      const forgotToken = await this.serviceBoyAuthService.forgotPassword(
        email
      );
      if (!forgotToken)
        throw new NotFoundError(ResponseMessage.FORGOT_PASSWORD_TOKEN_NOTFOUND);
      await this.serviceBoyAuthService.resetPasswordLink(email, forgotToken,Role.SERVICE_BOY);
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(
            ResponseMessage.FORGOT_PASSWORD_LINK_SEND,
            HttpStatusCode.OK
          )
        );
    } catch (error) {
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
      if (token) {
        await this.serviceBoyAuthService.resetPasswordTokenVerify(
          email,
          token
        );
        await this.serviceBoyAuthService.resetPassword(email, password);
      } else {
        await this.serviceBoyAuthService.resetPassword(email, password);
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
      console.log("googleToken",googleToken);
      const serviceBoy = await this.serviceBoyAuthService.googleAuth({googleToken});
      console.log("serviceBoyInfo",serviceBoy);
if(!serviceBoy) throw new NotFoundError(ResponseMessage.GOOGLE_AUTH_FAILED);

      console.log("serviceBoy from google login controller", serviceBoy);
      // set access token and refresh token in coockies
      res.cookie("refreshToken", serviceBoy.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });
      res.cookie("accessToken", serviceBoy.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "lax",
      });
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(
            ResponseMessage.LOGIN_SUCCESS,
            HttpStatusCode.OK,
            serviceBoy
          )
        );
    } catch (error) {
      next(error);
    }
  };

  logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("logout service boy invoked")
      res.clearCookie("accessToken").clearCookie("refreshToken");
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
      next();
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
        ))
    } catch (error) {
      next()
    }
  }
}
