import { inject, injectable } from "tsyringe";
import { IAdminController } from "../../interfaces/admin/IAdminController";
import { IAdminService } from "../../../../services/v1/interfaces/admin/IAdminService";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import logger from "../../../../utils/logger.util";
@injectable()
export class AdminController implements IAdminController {
  constructor(@inject("IAdminService") private adminService: IAdminService) {}

  verifyLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      logger.info("Admin login attempt", { email: req.body.email });
      const { email, password } = req.body;
      const admin = await this.adminService.verifyLogin(email, password);
      if(!admin){
        logger.warn("Invalid admin credentials", { email });
        throw new NotFoundError(ResponseMessage.INVALID_CREDINTIALS);
      } 
      // set access token and refresh token in coockies
      res.cookie("refreshToken", admin.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        sameSite: "lax",
      });
      res.cookie("accessToken", admin.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000, // 15 minutes
        sameSite: "lax",
      });
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(ResponseMessage.LOGIN_SUCCESS, HttpStatusCode.OK,admin)
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
            logger.error("Admin logout error", error );
      next(error);
    }
  };
}
