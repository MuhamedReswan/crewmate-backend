import { NextFunction, Request, Response } from "express";
import { inject, injectable } from "tsyringe";

import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { VerificationStatus, VerificationStatusType } from "../../../../constants/status";
import { UserType } from "../../../../constants/userType";
import { IAdminUserManagementService } from "../../../../services/v1/interfaces/admin/IAdminUserManagement.service";
import { NotFoundError } from "../../../../utils/errors/notFound.error";
import logger from "../../../../utils/logger.util";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { IAdminUserManagementController } from "../../interfaces/admin/IAdminUserManagement.controller";

@injectable()
export default class AdminUserManagementController implements IAdminUserManagementController {
  constructor(
    @inject("IAdminUserManagementService")
    private _adminUserManagementService: IAdminUserManagementService
  ) {}

  getAllPendingVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { userType } = req.params;

      console.log("params", req.params);
      console.log("url", req.originalUrl);

      const pendingVerifications =
        await this._adminUserManagementService.loadAllPendingVerification(userType as UserType);
      logger.info("pendingVerifications", { pendingVerifications });
      res
        .status(HttpStatusCode.OK)
        .json(
          responseHandler(
            ResponseMessage.LOAD_VERIFICATION_SUCCESS,
            HttpStatusCode.OK,
            pendingVerifications
          )
        );
    } catch (error) {
      logger.error("getAllPendingVerification error", { error });
      next(error);
    }
  };

  getSinglePendingVerification = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id, userType } = req.params;
      const { isVerified } = req.query;
      logger.log("usertype form single verifivation controller", { userType });
      const verificationStatus = isVerified as VerificationStatusType;
      const result = await this._adminUserManagementService.getUserById(
        userType as UserType,
        id,
        verificationStatus
      );
      if (!result) {
        res
          .status(HttpStatusCode.NOT_FOUND)
          .json(
            responseHandler(ResponseMessage.NO_USER_TO_VERIFY_WITH_THIS, HttpStatusCode.NOT_FOUND)
          );
        return;
      }
      res
        .status(HttpStatusCode.OK)
        .json(responseHandler(ResponseMessage.LOAD_SERVICE_BOY_SUCCESS, HttpStatusCode.OK, result));
    } catch (error) {
      next(error);
    }
  };

  verifyUserByAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, userType } = req.params;
      const status = req.query.status as VerificationStatusType;
      const reason = req.query.reason as string;

      if (!status) {
        throw new NotFoundError(ResponseMessage.NO_VERIFICATION_STATUS);
      }

      const result = await this._adminUserManagementService.verifyUser(
        id,
        status,
        reason,
        userType as UserType
      );
      if (!result) return;

      const responseMessage =
        status === VerificationStatus.Rejected
          ? ResponseMessage.VERIFICATION_STATUS_REJECTED_SUCCESS
          : ResponseMessage.VERIFICATION_STATUS_UPDATED_SUCCESS;
      res
        .status(HttpStatusCode.OK)
        .json(responseHandler(responseMessage, HttpStatusCode.OK, result));
    } catch (error) {
      next(error);
    }
  };

  getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userType } = req.params;

      const responseMessage =
        userType === UserType.SERVICE_BOY
          ? ResponseMessage.LOAD_SERVICE_BOY_SUCCESS
          : ResponseMessage.LOAD_VENDOR_SUCCESS;

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || "";
      const isBlockedRaw = req.query.isBlocked as string;
      if (isBlockedRaw) {
      }
      const isBlocked =
        isBlockedRaw === "true" ? true : isBlockedRaw === "false" ? false : undefined;
      const result = await this._adminUserManagementService.getPaginatedUsers(
        userType as UserType,
        page,
        limit,
        search,
        isBlocked
      );
      res
        .status(HttpStatusCode.OK)
        .json(responseHandler(responseMessage, HttpStatusCode.OK, result));
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, userType } = req.params;
      const responseMessage =
        userType === UserType.SERVICE_BOY
          ? ResponseMessage.LOAD_SERVICE_BOY_SUCCESS
          : ResponseMessage.LOAD_VENDOR_SUCCESS;

      const result = await this._adminUserManagementService.getUserById(userType as UserType, id);
      res
        .status(HttpStatusCode.OK)
        .json(responseHandler(responseMessage, HttpStatusCode.OK, result));
    } catch (error) {
      next(error);
    }
  };

  updateUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id, status, userType } = req.params;

      const updatedUser = await this._adminUserManagementService.updateUserStatus(
        id,
        status,
        userType as UserType
      );
      logger.info("updatedUser", { updatedUser });
      res
        .status(HttpStatusCode.OK)
        .json(responseHandler(ResponseMessage.UPDATE_STATUS_SUCCESS, HttpStatusCode.OK));
    } catch (error) {
      next(error);
    }
  };
}
