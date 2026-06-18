import { VerificationStatusType } from "../../../../constants/status";
import { UserType } from "../../../../constants/userType";
import IServiceBoy from "../../../../entities/v1/serviceBoyEntity";
import IVendor from "../../../../entities/v1/vendorEntity";
import { PaginatedResponse, RequestHandler } from "../../../../types";

export interface IAdminUserManagementService {
   
loadAllPendingVerification(userType:UserType):Promise<Partial<IServiceBoy>[] | Partial<IVendor>[] |undefined>,
getUserById(userType:UserType,id:string,isVerified?:VerificationStatusType,):Promise<Partial<IVendor> | Partial<IServiceBoy> | undefined>
verifyUser (id: string,  status: VerificationStatusType,reason?: string, userType?:UserType): Promise<Partial<IVendor> | undefined> 
getPaginatedUsers (userType:UserType, page: number, limit: number, search: string, isBlocked:boolean |undefined): Promise<PaginatedResponse<IServiceBoy | IVendor> | undefined> 
}