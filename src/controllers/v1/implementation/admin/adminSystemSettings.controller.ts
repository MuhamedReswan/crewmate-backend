import { inject, injectable } from "tsyringe";
import { Request, Response, NextFunction } from "express";
import { AdminSystemSettingsService } from "../../../../services/v1/implementation/admin/adminSystemSettings.service";
import { responseHandler } from "../../../../utils/responseHandler.util";
import { HttpStatusCode } from "../../../../constants/httpStatusCode";
import { ResponseMessage } from "../../../../constants/resposnseMessage";
import { IAdminSystemSettingsController } from "../../interfaces/admin/IAdminSystemSettings.controller";



@injectable()
export class AdminSystemSettingsController implements IAdminSystemSettingsController {
  constructor(
    @inject("AdminSystemSettingsService")
    private _systemSettingsService: AdminSystemSettingsService
  ) {}

  getSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await this._systemSettingsService.getSettings();
      res
        .status(200)
        .json(
          responseHandler(
            ResponseMessage.SYSTEM_SETTINGS_LOAD_SUCCESS,
            HttpStatusCode.OK,
            settings
          )
        );
    } catch (error) {
      next(error);
    }
  };

  updateSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this._systemSettingsService.updateSettings(req.body);
      res
        .status(200)
        .json(
          responseHandler(
            ResponseMessage.SYSTEM_SETTINGS_UPDATE_SUCCESS,
            HttpStatusCode.OK,
            updated
          )
        );
    } catch (error) {
      next(error);
    }
  };
}
