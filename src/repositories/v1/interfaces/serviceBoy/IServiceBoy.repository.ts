import IServiceBoy from "../../../../entities/v1/serviceBoyEntity"
import { PaginatedResponse } from "../../../../types/pagination.type"

export interface IServiceBoyRepository{
  updateServiceBoy(id:Partial<IServiceBoy>, data: Partial<IServiceBoy>): Promise<IServiceBoy | undefined>
  loadProfile(id:Partial<IServiceBoy>): Promise<IServiceBoy | undefined>
  loadAllSBPendingVerification(): Promise<IServiceBoy[] | undefined>
  findServiceBoysPaginated(page: number, limit: number, search: string, isBlocked:boolean|undefined):Promise<PaginatedResponse<IServiceBoy>|undefined>
}