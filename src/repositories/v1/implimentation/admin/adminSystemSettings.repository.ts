import { inject, injectable } from "tsyringe";
import { Model } from "mongoose";
import { BaseRepository } from "../base/base.repository";

import ISystemSettings from "../../../../entities/v1/systemSettingsEntity";

export interface IAdminSystemSettingsRepository {
  getSettings(): Promise<ISystemSettings | null>;
  updateSettings(data: Partial<ISystemSettings>): Promise<ISystemSettings | null>;
}

@injectable()
export class AdminSystemSettingsRepository
  extends BaseRepository<ISystemSettings>
  implements IAdminSystemSettingsRepository {

  constructor(
    @inject("SystemSettingsModel")
    model: Model<ISystemSettings>
  ) {
    super(model);
  }

  async getSettings(): Promise<ISystemSettings | null> {
    return this.findOne({});
  }

  async updateSettings(data: Partial<ISystemSettings>): Promise<ISystemSettings | null> {
    return this.updateOne({}, data);
  }
}
