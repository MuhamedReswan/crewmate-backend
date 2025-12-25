import { VerificationStatusType } from "../../../../constants/status"
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity"
import { PaginatedResponse } from "../../../../types/pagination.type"

export interface IAdminServiceBoyService{
loadAllPendingVerification():Promise<Partial<IServiceBoy>[] | undefined>
verifyServiceBoy(id:string, status:VerificationStatusType,reason?:string):Promise<Partial<IServiceBoy> | undefined>
getPaginatedServiceBoys(page: number, limit: number, search: string, isBlocked:boolean|undefined)
: Promise<PaginatedResponse<IServiceBoy> | undefined>
updateServiceBoyStatus (id:string, status:string):Promise<Partial<IServiceBoy> | undefined>
getServiceBoyById (id:string,isVerified?: IServiceBoy["isVerified"]):Promise<Partial<IServiceBoy> | undefined>
}