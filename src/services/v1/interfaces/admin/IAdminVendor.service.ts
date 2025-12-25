import { VerificationStatusType } from "../../../../constants/status"
import IVendor from "../../../../entities/v1/vendorEntity"
import { PaginatedResponse } from "../../../../types/pagination.type"

export interface IAdminVendorService{
loadAllPendingVerification():Promise<Partial<IVendor>[] | undefined>
verifyVendor(id:string, status:VerificationStatusType,reason?: string):Promise<Partial<IVendor> | undefined>
getVendorById(id:string, isVerified?:IVendor["isVerified"] ):Promise<Partial<IVendor> | undefined>
getPaginatedVendors(page: number, limit: number, search: string, isBlocked:boolean|undefined)
: Promise<PaginatedResponse<IVendor> | undefined>
}