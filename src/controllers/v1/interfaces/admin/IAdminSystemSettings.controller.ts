import { RequestHandler } from "../../../../types/type";

export interface IAdminSystemSettingsController {
  getSettings: RequestHandler;
  updateSettings: RequestHandler;
}