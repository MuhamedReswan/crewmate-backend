import { inject, injectable } from "tsyringe";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import logger from "../../../../utils/logger.util";
import { ACCESS_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE } from "../../../../config/env";
import { IAdminAuthController } from "../../interfaces/admin/IAdminAuth.controller";
import { IAdminAuthService } from "../../../../services/v1/interfaces/admin/IAdminAuth.service";
@injectable()
export default class AdminAuthController implements IAdminAuthController {
  constructor(@inject("IAdminAuthService") private _adminAuthService: IAdminAuthService) {}

  verifyLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info("Admin login attempt", { email: req.body.email });
      const { email, password } = req.body;
      const admin = await this._adminAuthService.verifyLogin(email, password);
      if(!admin){
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
          responseHandler(ResponseMessage.LOGIN_SUCCESS, HttpStatusCode.OK,admin.admin)
        );
    } catch (error) {
      logger.error("Admin login error", error );
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
            logger.error("Admin logout error", error );
      next(error);
    }
  };
}
