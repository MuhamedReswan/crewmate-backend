import { inject, injectable } from "tsyringe";
import { AdminSystemSettingsRepository } from "../../../../repositories/v1/implimentation/admin/adminSystemSettings.repository";
import ISystemSettings from "../../../../entities/v1/systemSettingsEntity";

export interface IAdminSystemSettingsService {
  getSettings(): Promise<ISystemSettings | null>;
  updateSettings(data: Partial<ISystemSettings>): Promise<ISystemSettings>;
}

@injectable()
export class AdminSystemSettingsService {
  constructor(
    @inject(AdminSystemSettingsRepository)
    private systemSettingsRepo: AdminSystemSettingsRepository
  ) {}

  getSettings() {
    return this.systemSettingsRepo.getSettings();
  }

  updateSettings(data: any) {
    data.updatedAt = new Date();
    return this.systemSettingsRepo.updateSettings(data);
  }
}

