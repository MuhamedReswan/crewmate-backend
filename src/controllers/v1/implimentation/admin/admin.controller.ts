import { inject, injectable } from "tsyringe";
import { IAdminController } from "../../interfaces/admin/IAdminController";
import { IAdminService } from "../../../../services/v1/interfaces/admin/IAdminService";
import { NextFunction, Request, Response } from "express";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
@injectable()
export class AdminController implements IAdminController {
  constructor(@inject("IAdminService") private adminService: IAdminService) {}

  verifyLogin = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("within admin login controller")
      const { email, password } = req.body;
      const vendor = await this.adminService.verifyLogin(email, password);
      if(!vendor) throw new NotFoundError(ResponseMessage.INVALID_CREDINTIALS);
      console.log("vendor from login controller", vendor);
      // set access token and refresh token in coockies
      res.cookie("refreshToken", vendor.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "lax",
      });
      res.cookie("accessToken", vendor.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 15 * 60 * 1000,
        sameSite: "lax",
      });
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(ResponseMessage.LOGIN_SUCCESS, HttpStatusCode.OK)
        );
    } catch (error) {
      console.log("admin login error",error);
      next(error);
    }
  };
}
