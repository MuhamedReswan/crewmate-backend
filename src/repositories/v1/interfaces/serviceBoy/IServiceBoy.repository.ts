import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import { PaginatedResponse } from "../../../../types/pagination.type";

export interface IServiceBoyRepository {
  updateUser(
    id: Partial<IServiceBoy>,
    data: Partial<IServiceBoy>
  ): Promise<IServiceBoy | undefined>;
  findUser(id: Partial<IServiceBoy>): Promise<IServiceBoy | undefined>;
  loadAllPendingVerification(): Promise<IServiceBoy[] | undefined>;
  findPaginatedUsers(
    page: number,
    limit: number,
    search: string,
    isBlocked: boolean | undefined
  ): Promise<PaginatedResponse<IServiceBoy> | undefined>;
}
