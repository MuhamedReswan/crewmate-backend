import IVendor from "../../../../entities/v1/vendorEntity";
import { PaginatedResponse } from "../../../../types/pagination.type";

export interface IVendorRepository {
  updateUser(id: Partial<IVendor>, data: Partial<IVendor>): Promise<IVendor | undefined>;
  findUser(id: Partial<IVendor>): Promise<IVendor | undefined>;
  loadAllPendingVerification(): Promise<IVendor[] | undefined>;
  findPaginatedUsers(
    page: number,
    limit: number,
    search: string,
    isBlocked: boolean | undefined
  ): Promise<PaginatedResponse<IVendor> | undefined>;
}
