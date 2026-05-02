import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import logger from "../../../../utils/logger.util";
import {
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
} from "../../../../config/env";
import { IAdminAuthController } from "../../interfaces/admin/IAdminAuth.controller";
import { IAdminAuthService } from "../../../../services/v1/interfaces/admin/IAdminAuth.service";
import { validateRefreshSession } from "../../../../utils/authSession.utils";
import { decodeRefreshToken } from "../../../../utils/jwt.util";
import { setRedisData } from "../../../../utils/redis.util";
@injectable()
export default class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject("IAdminAuthService") private _adminAuthService: IAdminAuthService
  ) {}

  verifyLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info("Admin login attempt", { email: req.body.email });
      const { email, password } = req.body;
      const oldRefreshToken = req.cookies?.refreshToken;
      const admin = await this._adminAuthService.verifyLogin(
        email,
        password,
        oldRefreshToken
      );
      if (!admin) {
        logger.warn("Invalid admin credentials", { email });
        throw new NotFoundError(ResponseMessage.INVALID_CREDINTIALS);
      }
      // set access token and refresh token in coockies
      res.cookie("refreshToken", admin.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: REFRESH_TOKEN_MAX_AGE,
        sameSite: "lax",
      });
      res.cookie("accessToken", admin.accessToken, {
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
            admin.admin
          )
        );
    } catch (error) {
      logger.error("Admin login error", error);
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
        return;
      }

      await validateRefreshSession(refreshToken);

      const result = await this._adminAuthService.setNewAccessToken(
        refreshToken
      );

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: ACCESS_TOKEN_MAX_AGE,
        sameSite: "lax",
      });

      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(ResponseMessage.ACCESS_TOKEN_SET, HttpStatusCode.OK)
        );
    } catch (error) {
      logger.error("Admin refresh error", error);
      next(error);
    }
  };

  adminLogout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info("Admin logout invoked");

      const refreshToken = req.cookies?.refreshToken;

      if (refreshToken) {
        const decoded = decodeRefreshToken(refreshToken);

        if (decoded?.exp) {
          const ttl = decoded.exp - Math.floor(Date.now() / 1000);

          await setRedisData(`blacklist:${refreshToken}`, "1", ttl);
        }
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
      logger.error("Admin logout error", error);
      next(error);
    }
  };
}
