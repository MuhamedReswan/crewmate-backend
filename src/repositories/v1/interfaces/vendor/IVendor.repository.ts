import IVendor from "../../../../entities/v1/vendorEntity"
import { PaginatedResponse } from "../../../../types/pagination.type"

export interface IVendorRepository{
    updateVendor (id: Partial<IVendor>, data: Partial<IVendor>): Promise<IVendor | undefined>
    findVendor(id: Partial<IVendor>): Promise<IVendor | undefined>
    loadAllVendorendingVerification(): Promise<IVendor[] | undefined>
    findVendorPaginated(page: number, limit: number, search: string, isBlocked:boolean|undefined)
    :Promise<PaginatedResponse<IVendor>|undefined>
    
}