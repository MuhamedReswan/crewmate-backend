import { inject, injectable } from "tsyringe";
import { AdminSystemSettingsRepository } from "../../../../repositories/v1/implementation/admin/adminSystemSettings.repository";
import { IAdminSystemSettingsService } from "../../interfaces/admin/IAdminSystemSettings.service";


@injectable()
export class AdminSystemSettingsService implements IAdminSystemSettingsService {
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

