import { NextFunction, Request, response, Response } from "express";
import { IVendorAuthController } from "../../interfaces/vendor/IVendorAuth.controller";
import { inject, injectable } from "tsyringe";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { IVendorAuthService } from "../../../../services/v1/interfaces/vendor/IVendorAuthService";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import { sendForgotPasswordLink } from "../../../../utils/otp.util";
import { Role } from "../../../../constants/Role";
import logger from "../../../../utils/logger.util";
import { getRedisData, setRedisData } from "../../../../utils/redis.util";
import { decodeRefreshToken } from "../../../../utils/jwt.util";
import { UnAuthorizedError } from "../../../../utils/errors/unAuthorized.error";
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from "../../../../config/env";

@injectable()
export default class VendorAuthController implements IVendorAuthController {
  constructor(
    @inject("IVendorAuthService") private _vendorAuthService: IVendorAuthService
  ) {}

  register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { name, email, password, mobile } = req.body;
      await this._vendorAuthService.register(name, email, password, mobile);
      await this._vendorAuthService.generateOTP(email);
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
      logger.error("Vendor registration failed", error);
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
      logger.info("Verifying OTP for vendor", { email });
      let vendorData = await this._vendorAuthService.verifyOTP(email, otp);
      logger.debug("OTP verified result", { vendorData });
      if (vendorData) {
        const role = Role.VENDOR;
        // set access token and refresh token in coockies
        res.cookie("refreshToken", vendorData.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: REFRESH_TOKEN_MAX_AGE,
          sameSite: "lax",
        });
        res.cookie("accessToken", vendorData.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: ACCESS_TOKEN_MAX_AGE,
          sameSite: "lax",
        });
        res
          .status(HttpStatusCode.OK)
          .json(
            responseHandler(
              ResponseMessage.OTP_VERIFICATION_SUCCESS,
              HttpStatusCode.OK,
              vendorData.vendor
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
      logger.error("Vendor OTP verification failed", error);
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
      logger.info("Resending OTP to vendor", { email });
      await this._vendorAuthService.resendOtp(email);
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(ResponseMessage.RESEND_OTP_SEND, HttpStatusCode.OK)
        );
    } catch (error) {
      logger.error("Resend OTP failed", error);
      next(error);
    }
  };

  vendorLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, password } = req.body;
      const vendorData = await this._vendorAuthService.vendorLogin(
        email,
        password
      );

      if (!vendorData) {
        throw new NotFoundError(ResponseMessage.LOGIN_VERIFICATION_FAILED);
      }
      // set access token and refresh token in coockies
      res.cookie("refreshToken", vendorData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: REFRESH_TOKEN_MAX_AGE,
        sameSite: "lax",
      });
      res.cookie("accessToken", vendorData.accessToken, {
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
            vendorData.vendor
          )
        );
    } catch (error) {
      logger.error("Vendor login failed", error);
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
      logger.info("Vendor forgot password request", { email });
      const forgotToken = await this._vendorAuthService.forgotPassword(email);
      if (!forgotToken)
        throw new NotFoundError(ResponseMessage.FORGOT_PASSWORD_TOKEN_NOTFOUND);
      await this._vendorAuthService.resetPasswordLink(
        forgotToken,
        email,
        Role.VENDOR
      );
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(
            ResponseMessage.FORGOT_PASSWORD_LINK_SEND,
            HttpStatusCode.OK
          )
        );
    } catch (error) {
      logger.error("Forgot password process failed", error);
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
        await this._vendorAuthService.resetPasswordTokenVerify(email, token);
        await this._vendorAuthService.resetPassword(email, password);
      } else {
        await this._vendorAuthService.resetPassword(email, password);
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
      logger.error("Reset password failed", error);
      next(error);
    }
  };

  resetPasswordLink = async (
    token: string,
    email: string,
    role: Role
  ): Promise<void> => {
    try {
      await sendForgotPasswordLink(email, token, role);
    } catch (error) {
      logger.error("Error sending password reset link", error);
      throw error;
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
        logger.warn("No refresh token provided");
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

      const result = await this._vendorAuthService.setNewAccessToken(
        refreshToken
      );
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: ACCESS_TOKEN_MAX_AGE,
        sameSite: "strict",
      });
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(ResponseMessage.ACCESS_TOKEN_SET, HttpStatusCode.OK)
        );
    } catch (error) {
      logger.error("Setting new access token failed", error);
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
      logger.info("Google auth started for vendor");
      const vendorData = await this._vendorAuthService.googleAuth({
        googleToken,
      });
      if (!vendorData)
        throw new NotFoundError(ResponseMessage.GOOGLE_AUTH_FAILED);

      // set access token and refresh token in coockies
      res.cookie("refreshToken", vendorData.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: REFRESH_TOKEN_MAX_AGE,
        sameSite: "lax",
      });
      res.cookie("accessToken", vendorData.accessToken, {
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
            vendorData.vendor
          )
        );
    } catch (error) {
      logger.error("Vendor Google auth failed", error);
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
        res
          .status(HttpStatusCode.BAD_REQUEST)
          .json(
            responseHandler(
              ResponseMessage.INVALID_REFRESH_TOKEN,
              HttpStatusCode.BAD_REQUEST
            )
          );
      }

      const decoded = decodeRefreshToken(refreshToken);
      logger.info("decoded token in vendor logout controller", { decoded });
      if (decoded?.exp) {
        const now = Math.floor(Date.now() / 1000);
        const ttl = decoded.exp - now;

        await setRedisData(refreshToken, "blacklisted", ttl);
      }

      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      });

      res.clearCookie("accessToken", {
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
      logger.error("Vendor Logout failed", error);
      next(error);
    }
  };
}
