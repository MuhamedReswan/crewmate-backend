import { FilterQuery, Model } from "mongoose";
import { inject, injectable } from "tsyringe";

import { VerificationStatus } from "../../../../constants/status";
import IVendor from "../../../../entities/v1/vendorEntity";
import { PaginatedResponse } from "../../../../types/pagination.type";
import logger from "../../../../utils/logger.util";
import { IVendorRepository } from "../../interfaces/vendor/IVendor.repository";
import { BaseRepository } from "../base/base.repository";

@injectable()
export default class VendorRepository extends BaseRepository<IVendor> implements IVendorRepository {
  constructor(@inject("VendorModel") model: Model<IVendor>) {
    super(model);
  }

  updateUser = async (
    id: Partial<IVendor>,
    data: Partial<IVendor>
  ): Promise<IVendor | undefined> => {
    try {
      logger.debug("Updating vendor", { id, updateData: data });
      const updatedVendor = await this.updateOne(id, data);
      logger.debug("Vendor updated", { updatedVendor });

      if (updatedVendor) {
        return updatedVendor;
      }
      return;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  async findUser(data: Partial<IVendor>): Promise<IVendor | undefined> {
    try {
      const vendorProfile = await this.findOne(data, { password: 0 });

      logger.debug("vendorProfile", { vendorProfile });

      if (vendorProfile) return vendorProfile;
      return;
    } catch (error) {
      throw error;
    }
  }

  async loadAllPendingVerification(): Promise<IVendor[] | undefined> {
    try {
      const query: FilterQuery<IVendor> = {
        isVerified: VerificationStatus.Pending,
        mobile: { $exists: true },
        estd: { $exists: true },
      };
      const pendingVerifications = await this.findAll(query);
      logger.info("pendingVerifications-- VendorRepository", { pendingVerifications });
      if (pendingVerifications) return pendingVerifications;
      return;
    } catch (error) {
      throw error;
    }
  }

  async findPaginatedUsers(
    page: number,
    limit: number,
    search: string,
    isBlocked: boolean
  ): Promise<PaginatedResponse<IVendor> | undefined> {
    try {
      const query: Partial<IVendor> = {};
      if (typeof isBlocked === "boolean") {
        query.isBlocked = isBlocked;
      }
      return this.findPaginated(query, page, limit, search, ["name", "email", "mobile"]);
    } catch (error) {
      throw error;
    }
  }
}
