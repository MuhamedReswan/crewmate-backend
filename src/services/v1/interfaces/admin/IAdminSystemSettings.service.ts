import ISystemSettings from "../../../../entities/v1/systemSettingsEntity";

export interface IAdminSystemSettingsService {
  getSettings(): Promise<ISystemSettings | null>;
  updateSettings(data: Partial<ISystemSettings>): Promise<ISystemSettings | null>;
}